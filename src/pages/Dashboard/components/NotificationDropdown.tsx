import React, { useEffect, useRef, useState } from "react";
import {
    BellOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    PlayCircleOutlined,
    VideoCameraOutlined,
    MoreOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    CloseOutlined,

} from "@ant-design/icons";
import {
    Badge,
    Button,
    Empty,
    Typography,
    Dropdown,
    Avatar,
    Divider,
    theme,
    Dropdown as ActionDropdown,
    message,
    Drawer,

    Grid
} from "antd";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/feature/authSlice";
import { useSocket } from "@/hook/useSocket";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAsReadSingleMutation,
    useDeleteNotificationMutation,
    useMarkAsUnreadMutation
} from "@/redux/feature/notification/notificationApi";

const { Text } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;

interface NotificationItem {
    _id?: string;
    user?: string;
    recipientEmail?: string;
    title: string;
    message: string;
    read: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Custom color constants for different notification types
const NOTIFICATION_COLORS = {
    game: "#1890ff",
    security: "#ff4d4f",
    social: "#722ed1",
    friend: "#52c41a",
    general: "#8c8c8c"
} as const;

const NotificationDropdown: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useToken();
    const screens = useBreakpoint();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [socketToast, setSocketToast] = useState<{ type: 'info' | 'success' | 'error' | 'warning'; content: string; } | null>(null);

    const { data: notificationsResponse, isLoading, refetch } = useGetNotificationsQuery(undefined);
    const [markAsRead] = useMarkAsReadMutation();
    const [markAsReadSingle] = useMarkAsReadSingleMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [markAsUnread] = useMarkAsUnreadMutation();

    // console.log('Notifications Response:', notificationsResponse);

    // Directly use the API response - it already matches NotificationItem interface
    const notifications: NotificationItem[] = (notificationsResponse?.data?.result || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? String(item.createdAt) : undefined,
        updatedAt: item.updatedAt ? String(item.updatedAt) : undefined
    }));

    // console.log('Notifications Data:', notifications);

    // Play sound when a new notification arrives
    const prevCountRef = useRef<number>(0);
    const audioCtxRef = useRef<any>(null);

    const playNotificationSound = () => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = 1000;
            o.connect(g);
            g.connect(ctx.destination);
            const now = ctx.currentTime;
            o.start(now);
            g.gain.setValueAtTime(0.0001, now);
            g.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            o.stop(now + 0.36);
        } catch (e) {
            // Silently ignore; browser may block audio without user interaction
        }
    };

    useEffect(() => {
        const currentCount = notifications.length;
        // Ignore initial load
        if (prevCountRef.current === 0) {
            prevCountRef.current = currentCount;
            return;
        }

        if (currentCount > prevCountRef.current) {
            playNotificationSound();
        }

        prevCountRef.current = currentCount;
    }, [notifications.length]);

    const unreadNotifications = notifications.filter(item => !item.read);
    const unreadCount = unreadNotifications.length;
    const hasNotifications = notifications.length > 0;

    // Hook up socket to receive real-time notifications for current user
    const currentUser = useAppSelector(selectCurrentUser);
    // console.log("Current User in NotificationDropdown:", currentUser);
    const userId = currentUser?._id;
    const { onMessage, offMessage } = useSocket(import.meta.env.VITE_SOCKET_SERVER_URL, userId);

    useEffect(() => {
        const handleNewNotification = (payload: any) => {
            console.log("Socket new-notification:", payload);
            playNotificationSound();
            setSocketToast({ type: 'info', content: payload?.message || 'New notification!' });
            refetch();
        };

        onMessage("new-notification", handleNewNotification);

        return () => {
            offMessage("new-notification", handleNewNotification);
        };
    }, [onMessage, offMessage, refetch]); // dependencies included


    function getTimeLabel(createdAt?: string): string {
        if (!createdAt) return 'Some time ago';

        try {
            const createdDate = new Date(createdAt);
            const now = new Date();
            const diffMs = now.getTime() - createdDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return createdDate.toLocaleDateString();
        } catch (error) {
            return 'Some time ago';
        }
    }

    // Determine if a notification is from today
    function isToday(createdAt?: string): boolean {
        if (!createdAt) return false;

        try {
            const createdDate = new Date(createdAt);
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return createdDate >= todayStart;
        } catch (error) {
            return false;
        }
    }

    // Group notifications
    const todayNotifications = notifications.filter(item => isToday(item.createdAt)).slice(0, 3);
    const earlierNotifications = notifications.filter(item => !isToday(item.createdAt)).slice(0, 3);

    // Get color based on notification type (extracted from title/message)
    const getNotificationType = (item: NotificationItem): keyof typeof NOTIFICATION_COLORS => {
        const title = item.title?.toLowerCase() || '';
        const message = item.message?.toLowerCase() || '';

        if (title.includes('security') || title.includes('alert') || title.includes('warning')) {
            return 'security';
        }
        if (title.includes('friend') || message.includes('friend')) {
            return 'friend';
        }
        if (title.includes('social') || message.includes('social')) {
            return 'social';
        }
        if (title.includes('game') || message.includes('game')) {
            return 'game';
        }
        return 'general';
    };

    const getNotificationColor = (type?: keyof typeof NOTIFICATION_COLORS) => {
        return NOTIFICATION_COLORS[type || 'general'];
    };

    // Get icon based on notification type
    const getNotificationIcon = (item: NotificationItem) => {
        const type = getNotificationType(item);
        const color = getNotificationColor(type);

        switch (type) {
            case 'game':
                return <PlayCircleOutlined style={{ color }} />;
            case 'security':
                return <SafetyCertificateOutlined style={{ color }} />;
            case 'social':
                return <VideoCameraOutlined style={{ color }} />;
            case 'friend':
                return <UserOutlined style={{ color }} />;
            default:
                return <BellOutlined style={{ color: token.colorTextSecondary }} />;
        }
    };

    // Get avatar background color with opacity
    const getAvatarBgColor = (item: NotificationItem) => {
        const type = getNotificationType(item);
        const color = getNotificationColor(type);
        return `${color}15`;
    };

    const handleNotificationClick = async (item: NotificationItem) => {
        // Mark as read when clicked only if it's unread
        if (!item.read && item._id) {
            try {
                await markAsReadSingle(item._id).unwrap();
                message.success('Marked as read');
                refetch();
            } catch (error) {
                console.error('Failed to mark notification as read:', error);
                message.error('Failed to mark as read');
            }
        }

        // Handle specific notification types
        if (item.title.includes('Booking')) {
            navigate('/dashboard/booking');
        }

        // Close drawer on mobile after click
        if (!screens.md) {
            setDrawerVisible(false);
        }
    };

    // Fixed: Properly implement mark as unread
    const handleMarkAsUnread = async (item: NotificationItem) => {
        if (!item._id) {
            message.error('Notification ID is missing');
            return;
        }

        try {
            // Call the markAsUnread mutation with the notification ID
            await markAsUnread(item._id).unwrap();
            message.success('Marked as unread');
            refetch();
        } catch (error: any) {
            console.error('Failed to mark notification as unread:', error);
            // Check if the error is because the notification is already unread
            if (error.data?.message?.includes('already unread') || !item.read) {
                message.warning('Notification is already unread');
            } else {
                message.error('Failed to mark as unread');
            }
        }
    };

    const handleDeleteNotification = async (item: NotificationItem) => {
        if (!item._id) return;

        try {
            await deleteNotification({ id: item._id }).unwrap();
            message.success('Notification deleted');
            refetch();
        } catch (error) {
            console.error('Failed to delete notification:', error);
            message.error('Failed to delete notification');
        }
    };

    const handleViewAll = () => {
        navigate('/dashboard/notifications');
        if (!screens.md) {
            setDrawerVisible(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAsRead().unwrap();
            message.success('All notifications marked as read');
            refetch();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            message.error('Failed to mark all as read');
        }
    };

    // Create action menu for each notification
    const getActionMenu = (item: NotificationItem): MenuProps => ({
        items: [
            {
                key: 'mark-unread',
                label: (
                    <div className="flex items-center gap-2">
                        <EyeOutlined style={{ color: token.colorPrimary }} />
                        <span>Mark as unread</span>
                    </div>
                ),
                onClick: () => handleMarkAsUnread(item),
                disabled: !item.read // Only enabled if already read
            },
            {
                key: 'delete',
                label: (
                    <div className="flex items-center gap-2">
                        <DeleteOutlined style={{ color: token.colorError }} />
                        <span style={{ color: token.colorError }}>Delete</span>
                    </div>
                ),
                onClick: () => handleDeleteNotification(item._id ? item : { ...item, _id: '' }), // Ensure _id is defined   
            }
        ]
    });

    // Render notification item for both desktop and mobile
    const renderNotificationItem = (item: NotificationItem, isMobile = false) => (
        <div
            className={`${isMobile ? 'px-4' : 'px-4'} py-3 transition-all duration-200 hover:bg-gray-50 group`}
            style={{
                backgroundColor: !item.read ? token.colorFillAlter : 'transparent'
            }}
        >
            <div className="flex items-start gap-3">
                <div
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => handleNotificationClick(item)}
                >
                    <Avatar
                        size={isMobile ? 48 : 40}
                        icon={getNotificationIcon(item)}
                        style={{
                            backgroundColor: getAvatarBgColor(item),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                </div>
                <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleNotificationClick(item)}
                >
                    <div className="flex items-start justify-between gap-2">
                        <Text
                            strong
                            className={`${isMobile ? 'text-base' : 'text-sm'} mb-1 line-clamp-1`}
                            style={{
                                color: token.colorTextHeading,
                                fontWeight: !item.read ? 600 : 400
                            }}
                        >
                            {item.title}
                        </Text>
                        <Text type="secondary" className={`${isMobile ? 'text-sm' : 'text-xs'} whitespace-nowrap`}>
                            {getTimeLabel(item.createdAt)}
                        </Text>
                    </div>
                    <Text
                        className={`${isMobile ? 'text-base' : 'text-sm'} mt-1 line-clamp-2`}
                        style={{
                            color: token.colorTextSecondary,
                            lineHeight: '1.4'
                        }}
                    >
                        {item.message}
                    </Text>
                </div>
                {!isMobile && (
                    <div className="flex items-start gap-2">
                        {!item.read && (
                            <div
                                className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                                style={{ backgroundColor: token.colorPrimary }}
                            />
                        )}
                        <ActionDropdown
                            menu={getActionMenu(item)}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <Button
                                type="text"
                                size="small"
                                icon={<MoreOutlined style={{ fontSize: '18px' }} />}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    color: token.colorTextSecondary,
                                    width: '30px',
                                    height: '30px',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            />
                        </ActionDropdown>
                    </div>
                )}
            </div>

            {/* Mobile action buttons */}
            {isMobile && (
                <div className="flex items-center gap-2 mt-3">
                    {!item.read ? (
                        <Button
                            size="small"
                            icon={<CheckCircleOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(item);
                            }}
                            className="text-xs"
                        >
                            Mark as read
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsUnread(item);
                            }}
                            className="text-xs"
                        >
                            Mark as unread
                        </Button>
                    )}
                    <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(item);
                        }}
                        className="text-xs"
                    >
                        Delete
                    </Button>
                </div>
            )}
        </div>
    );

    // Desktop Dropdown Menu
    const desktopMenu: MenuProps = {
        items: [
            {
                key: 'header',
                label: (
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Text strong className="text-lg m-0" style={{ color: token.colorTextHeading }}>
                                Notifications
                            </Text>
                            <div className="flex gap-1">
                                <Button
                                    type="text"
                                    size="small"
                                    className="px-2 py-0 h-6 text-sm font-medium"
                                    style={{
                                        color: token.colorPrimary,
                                        backgroundColor: token.colorPrimaryBg
                                    }}
                                >
                                    All ({notifications.length})
                                </Button>
                                {unreadCount > 0 && (
                                    <Button
                                        type="text"
                                        size="small"
                                        className="px-2 py-0 h-6 text-sm font-medium"
                                        style={{
                                            color: token.colorError,
                                            backgroundColor: token.colorErrorBg
                                        }}
                                    >
                                        Unread ({unreadCount})
                                    </Button>
                                )}
                            </div>
                        </div>
                        {hasNotifications && unreadCount > 0 && (
                            <Button
                                type="link"
                                size="small"
                                className="p-0 text-xs flex items-center gap-1"
                                style={{ color: token.colorPrimary }}
                                onClick={handleMarkAllAsRead}
                            >
                                <CheckCircleOutlined />
                                Mark all as read
                            </Button>
                        )}
                    </div>
                ),
                disabled: true,
                style: {
                    cursor: 'default',
                    backgroundColor: 'transparent',
                    padding: 0
                }
            },
            ...(isLoading ? [{
                key: 'loading',
                label: (
                    <div className="flex justify-center items-center p-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2"
                            style={{ borderColor: token.colorPrimary }}></div>
                    </div>
                ),
                disabled: true
            }] : hasNotifications ? [
                // Today Section Header - only show if there are today's notifications
                ...(todayNotifications.length > 0 ? [{
                    key: 'today-header',
                    label: (
                        <div className="px-4 py-2" style={{ backgroundColor: token.colorFillAlter }}>
                            <Text strong className="text-sm" style={{ color: token.colorTextSecondary }}>
                                Today
                            </Text>
                        </div>
                    ),
                    disabled: true,
                    style: { padding: '0' }
                }] : []),
                // Today's Notifications
                ...todayNotifications.map((item) => ({
                    key: item._id || `today-${Math.random()}`,
                    label: renderNotificationItem(item, false)
                })),
                // Divider - only if we have both today and earlier notifications
                ...(todayNotifications.length > 0 && earlierNotifications.length > 0 ? [{
                    key: 'divider',
                    label: <Divider className="my-2" />,
                    disabled: true,
                    style: { padding: 0 }
                }] : []),
                // Earlier Section Header - only show if there are earlier notifications
                ...(earlierNotifications.length > 0 ? [{
                    key: 'earlier-header',
                    label: (
                        <div
                            className="flex items-center justify-between px-4 py-2"
                            style={{ backgroundColor: token.colorFillAlter }}
                        >
                            <Text strong className="text-sm" style={{ color: token.colorTextSecondary }}>
                                Earlier
                            </Text>
                            <Button
                                type="link"
                                size="small"
                                className="p-0 text-xs flex items-center gap-1"
                                style={{ color: token.colorPrimary }}
                                onClick={handleViewAll}
                            >
                                See all
                            </Button>
                        </div>
                    ),
                    disabled: true,
                    style: { padding: '0' }
                }] : []),
                // Earlier Notifications
                ...earlierNotifications.map((item) => ({
                    key: item._id || `earlier-${Math.random()}`,
                    label: renderNotificationItem(item, false)
                }))
            ] : [{
                key: 'empty',
                label: (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <Text type="secondary" className="text-sm">
                                No notifications yet
                            </Text>
                        }
                        className="py-8"
                        imageStyle={{ height: 60 }}
                    />
                ),
                disabled: true
            }]),
            // Footer with View All button
            {
                key: 'footer',
                label: (
                    <div className="px-4 py-3 text-center" style={{ backgroundColor: token.colorFillAlter }}>
                        <Button
                            type="default"
                            size="middle"
                            onClick={handleViewAll}
                            style={{
                                width: '100%',
                                borderColor: token.colorBorder,
                                color: token.colorText
                            }}
                            className="hover:bg-gray-100"
                        >
                            View all notifications
                        </Button>
                    </div>
                ),
                disabled: true,
                style: { padding: 0 }
            }
        ]
    };

    // Mobile Drawer Content
    const renderMobileDrawer = () => (
        <Drawer
            title={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BellOutlined style={{ fontSize: '20px', color: token.colorPrimary }} />
                        <Text strong className="text-lg m-0" style={{ color: token.colorTextHeading }}>
                            Notifications
                        </Text>
                        {unreadCount > 0 && (
                            <Badge
                                count={unreadCount}
                                size="small"
                                style={{
                                    backgroundColor: token.colorError,
                                    fontSize: '10px'
                                }}
                            />
                        )}
                    </div>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => setDrawerVisible(false)}
                        className="p-0"
                    />
                </div>
            }
            placement="right"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width="100%"
            style={{ maxWidth: 400 }}
            styles={{ body: { padding: 0 } }}
        >
            <div className="h-full flex flex-col">
                {/* Header with stats and actions */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Button
                                type="text"
                                size="small"
                                className="px-3 py-1 text-sm"
                                style={{
                                    color: token.colorPrimary,
                                    backgroundColor: token.colorPrimaryBg
                                }}
                            >
                                All ({notifications.length})
                            </Button>
                            {unreadCount > 0 && (
                                <Button
                                    type="text"
                                    size="small"
                                    className="px-3 py-1 text-sm"
                                    style={{
                                        color: token.colorError,
                                        backgroundColor: token.colorErrorBg
                                    }}
                                >
                                    Unread ({unreadCount})
                                </Button>
                            )}
                        </div>
                        {hasNotifications && unreadCount > 0 && (
                            <Button
                                type="link"
                                size="small"
                                className="text-xs"
                                style={{ color: token.colorPrimary }}
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all as read
                            </Button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center p-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2"
                                style={{ borderColor: token.colorPrimary }}></div>
                        </div>
                    ) : hasNotifications ? (
                        <>
                            {/* Today's Notifications */}
                            {todayNotifications.length > 0 && (
                                <>
                                    <div className="px-4 py-3 bg-gray-50">
                                        <Text strong className="text-sm" style={{ color: token.colorTextSecondary }}>
                                            Today
                                        </Text>
                                    </div>
                                    {todayNotifications.map((item) => (
                                        <div key={item._id}>
                                            {renderNotificationItem(item, true)}
                                            <Divider className="my-0" />
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Earlier Notifications */}
                            {earlierNotifications.length > 0 && (
                                <>
                                    <div className="px-4 py-3 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <Text strong className="text-sm" style={{ color: token.colorTextSecondary }}>
                                                Earlier
                                            </Text>
                                            <Button
                                                type="link"
                                                size="small"
                                                className="p-0 text-xs"
                                                style={{ color: token.colorPrimary }}
                                                onClick={handleViewAll}
                                            >
                                                See all
                                            </Button>
                                        </div>
                                    </div>
                                    {earlierNotifications.map((item) => (
                                        <div key={item._id}>
                                            {renderNotificationItem(item, true)}
                                            <Divider className="my-0" />
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-10">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <Text type="secondary" className="text-sm text-center">
                                        No notifications yet
                                    </Text>
                                }
                                imageStyle={{ height: 80 }}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                    <Button
                        type="default"
                        size="large"
                        block
                        onClick={handleViewAll}
                        style={{
                            borderColor: token.colorBorder,
                            color: token.colorText
                        }}
                    >
                        View all notifications
                    </Button>
                </div>
            </div>
        </Drawer>
    );

    // Notification trigger button
    const notificationButton = (
        <Button
            type="text"
            shape="circle"
            icon={
                <Badge
                    count={unreadCount}
                    size="small"
                    overflowCount={9}
                    style={{
                        backgroundColor: unreadCount > 0 ? token.colorError : 'transparent',
                        boxShadow: unreadCount > 0 ? `0 0 0 2px ${token.colorBgContainer}` : 'none',
                        fontSize: "10px",
                        height: "18px",
                        minWidth: "18px",
                        lineHeight: "18px",
                    }}
                >
                    <BellOutlined
                        style={{
                            fontSize: "20px",
                            color: unreadCount > 0 ? token.colorPrimary : token.colorTextSecondary,
                        }}
                    />
                </Badge>
            }
            className="hover:bg-gray-100 flex items-center justify-center"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
            style={{
                width: screens.xs ? "36px" : "42px",
                height: screens.xs ? "36px" : "42px",
                transition: "all 0.2s",
            }}
        />
    );

    return (
        <>

            {/* Desktop: Dropdown */}
            {screens.md ? (
                <Dropdown
                    menu={desktopMenu}
                    placement="bottomRight"
                    trigger={["click"]}
                    dropdownRender={(menu) => (
                        <div style={{
                            width: screens.lg ? '450px' : screens.md ? '400px' : '350px',
                            maxHeight: '500px',
                            overflowY: 'auto',
                            boxShadow: token.boxShadowSecondary,
                            borderRadius: token.borderRadiusLG,
                            backgroundColor: token.colorBgContainer
                        }}>
                            {React.cloneElement(menu as React.ReactElement)}
                        </div>
                    )}
                    getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
                >
                    {notificationButton}
                </Dropdown>
            ) : (
                /* Mobile: Drawer Trigger */
                <>
                    <div onClick={() => setDrawerVisible(true)}>
                        {notificationButton}
                    </div>
                    {renderMobileDrawer()}
                </>
            )}

            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .notification-drawer .ant-drawer-body {
                        padding: 0 !important;
                    }
                    
                    .notification-drawer .ant-drawer-header {
                        padding: 16px !important;
                    }
                    
                    .notification-drawer .ant-drawer-header-title {
                        flex-direction: row-reverse;
                    }
                    
                    .notification-drawer .ant-drawer-close {
                        margin-right: 0;
                        margin-left: auto;
                    }
                }
                
                /* Scrollbar styling */
                .ant-dropdown-menu::-webkit-scrollbar,
                .ant-drawer-body::-webkit-scrollbar {
                    width: 4px;
                }
                
                .ant-dropdown-menu::-webkit-scrollbar-track,
                .ant-drawer-body::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                
                .ant-dropdown-menu::-webkit-scrollbar-thumb,
                .ant-drawer-body::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                
                .ant-dropdown-menu::-webkit-scrollbar-thumb:hover,
                .ant-drawer-body::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
                }
            `}</style>
        </>
    );
};

export default NotificationDropdown;