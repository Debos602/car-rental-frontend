import React, { useState, useEffect, useRef } from "react";
import {
    BookOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoneyCollectOutlined,
    UserOutlined,
    CarOutlined,
    SettingOutlined,
    BellOutlined,
    SearchOutlined,
    PieChartOutlined,
    TeamOutlined,
    FileTextOutlined,
    HomeOutlined,
    AppstoreOutlined,
    SafetyOutlined,
    GlobalOutlined,
    CloseOutlined,
    MenuOutlined,
    DeleteFilled,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Layout,
    Menu,
    Input,
    Badge,
    Dropdown,
    Typography,
    Spin,
    Empty,
    Drawer,
    Grid,
    Modal,
    message,
} from "antd";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import logo from "@/assets/car_lgo.png";
import { RootState } from "@/redux/store";
import { TUser } from "@/types/global";
import type { MenuProps } from 'antd';
import { useGetAllNotificationsQuery } from "@/redux/feature/notification/notificationApi";
import { useDeleteNotificationAdminMutation } from "@/redux/feature/notification/notificationApi";
import { logout } from "@/redux/feature/auth/authSlice";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

// Notification type interface
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

const AdminDashboard: React.FC = () => {
    const user = useAppSelector(
        (state: RootState) => state.auth.user as TUser | null
    );
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const screens = useBreakpoint();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAllNotifications, setShowAllNotifications] = useState(false);
    const menuContainerRef = useRef<HTMLDivElement>(null);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const isMobile = !screens.lg;

    useEffect(() => {
        if (!isMobile) {
            setMobileMenuVisible(false);
        }
        if (isMobile) {
            setCollapsed(false);
        }
    }, [isMobile]);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(logout());
        navigate("/login");
    };

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path.includes("dashboard-overview")) return "1";
        if (path.includes("manage-car")) return "2";
        if (path.includes("manage-booking")) return "3";
        if (path.includes("manage-return-car")) return "4";
        if (path.includes("user-management")) return "5";
        if (path.includes("reports")) return "6";
        if (path.includes("settings")) return "7";
        if (path.includes("documentation")) return "8";
        return "1";
    };

    const { data: notificationsData, isLoading, refetch } = useGetAllNotificationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 30000,
    });
    const [deleteNotificationAdmin] = useDeleteNotificationAdminMutation();
    const notifications: NotificationItem[] = notificationsData?.data ?? [];
    const unreadCount = notifications.filter((n) => !n.read).length;

    // Helper to extract a usable notification id for API calls
    const getNotificationId = (item: NotificationItem): string | undefined => {
        const anyItem: any = item as any;
        if (anyItem._id && typeof anyItem._id === 'string') return anyItem._id;
        if (anyItem.id && typeof anyItem.id === 'string') return anyItem.id;
        if (anyItem.notificationId && typeof anyItem.notificationId === 'string') return anyItem.notificationId;
        if (anyItem.notification_id && typeof anyItem.notification_id === 'string') return anyItem.notification_id;
        if (anyItem._id && anyItem._id.$oid && typeof anyItem._id.$oid === 'string') return anyItem._id.$oid;
        return undefined;
    };

    // Format time label
    const getTimeLabel = (createdAt?: string): string => {
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
    };

    const handleNotificationClick = async (item: NotificationItem) => {
        // Navigate based on notification type
        if (item.title.includes('Booking')) {
            navigate('/admin-dashboard/manage-booking');
        } else if (item.title.includes('Car')) {
            navigate('/admin-dashboard/manage-car');
        } else if (item.title.includes('User')) {
            navigate('/admin-dashboard/user-management');
        } else if (item.title.includes('Payment')) {
            navigate('/admin-dashboard/manage-return-car');
        }
        setShowAllNotifications(false);

    };


    // Notification dropdown menu items
    const notificationMenuItems: MenuProps['items'] = [
        {
            key: 'header',
            label: (
                <div className="px-4 py-3 border-b" style={{ background: 'linear-gradient(90deg, #FBFBFF 0%, #FFFFFF 100%)' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-[#4335A7] to-[#6b45d9] text-white shadow-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BellOutlined style={{ fontSize: 18 }} />
                            </div>
                            <div>
                                <Text strong className="text-base text-gray-900">Notifications</Text>

                            </div>
                        </div>
                    </div>
                </div>
            ),
            disabled: true,
        },
        ...(isLoading ? [{
            key: 'loading',
            label: (
                <div className="flex justify-center items-center py-8">
                    <Spin size="small" />
                    <Text type="secondary" className="ml-2">Loading notifications...</Text>
                </div>
            ),
            disabled: true,
        }] : notifications.length > 0 ? [
            ...notifications.slice(0, showAllNotifications ? 10 : 5).map((item, index) => ({
                key: item._id || `notification-${index}`,
                label: (
                    <div
                        className={`notification-list-item px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${!item.read ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(item)}
                    >
                        <div className="flex items-start">
                            <div className="mr-3 mt-1 flex-shrink-0">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${!item.read ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                    <BellOutlined />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                {/* Title and time on same line */}
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <Text
                                        strong
                                        className={`text-sm ${!item.read ? 'text-gray-900' : 'text-gray-600'}`}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text type="secondary" className="text-xs whitespace-nowrap">
                                        {getTimeLabel(item.createdAt)}
                                    </Text>
                                </div>

                                {/* Notification message */}
                                <Text
                                    className="text-sm text-gray-600 mb-2"
                                    style={{ lineHeight: '1.4' }}
                                >
                                    {item.message}
                                </Text>
                            </div>
                            <div className="ml-3 flex-shrink-0 notification-delete-btn">
                                <Button
                                    type="text"
                                    size="small"
                                    className="text-red-900"
                                    icon={<DeleteFilled className="text-red-700" />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const id = getNotificationId(item);
                                        if (!id) {
                                            message.error('Unable to delete: invalid id');
                                            return;
                                        }
                                        Modal.confirm({
                                            title: 'Delete notification',
                                            content: 'Are you sure you want to delete this notification? This action cannot be undone.',
                                            okText: 'Delete',
                                            okType: 'danger',
                                            onOk: async () => {
                                                try {
                                                    await deleteNotificationAdmin({ id }).unwrap();
                                                    message.success('Notification deleted');
                                                    refetch();
                                                } catch (err: any) {
                                                    const msg = err?.data?.message || err?.message || 'Failed to delete notification';
                                                    message.error(msg);
                                                }
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ),
            })),
            ...(notifications.length > 5 && !showAllNotifications ? [{
                key: 'show-more',
                label: (
                    <div className="px-4 py-3 text-center border-t border-gray-200 bg-gray-50">
                        <Button
                            type="link"
                            size="small"
                            className="text-[#4335A7] font-medium"
                            onClick={() => setShowAllNotifications(true)}
                        >
                            Show {notifications.length - 5} more notifications
                        </Button>
                    </div>
                ),
                disabled: true,
            }] : []),
        ] : [{
            key: 'empty',
            label: (
                <div className="px-4 py-8 text-center">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div>
                                <Text type="secondary" className="text-sm">
                                    No notifications yet
                                </Text>
                                <Text className="block mt-2 text-xs text-gray-500">
                                    New notifications will appear here
                                </Text>
                            </div>
                        }
                        imageStyle={{ height: 60 }}
                    />
                </div>
            ),
            disabled: true,
        }])
    ];

    const menuItems: MenuProps['items'] = [
        {
            key: "1",
            icon: <DashboardOutlined />,
            label: <Link to="dashboard-overview" onClick={() => isMobile && setMobileMenuVisible(false)}>Dashboard Overview</Link>,
        },
        {
            key: "2",
            icon: <CarOutlined />,
            label: <Link to="manage-car" onClick={() => isMobile && setMobileMenuVisible(false)}>Manage Cars</Link>,
        },
        {
            key: "3",
            icon: <BookOutlined />,
            label: <Link to="manage-booking" onClick={() => isMobile && setMobileMenuVisible(false)}>Manage Bookings</Link>,
        },
        {
            key: "4",
            icon: <MoneyCollectOutlined />,
            label: <Link to="manage-return-car" onClick={() => isMobile && setMobileMenuVisible(false)}>Return & Payments</Link>,
        },
        {
            key: "5",
            icon: <TeamOutlined />,
            label: <Link to="user-management" onClick={() => isMobile && setMobileMenuVisible(false)}>User Management</Link>,
        },
        {
            key: "6",
            icon: <PieChartOutlined />,
            label: <Link to="reports" onClick={() => isMobile && setMobileMenuVisible(false)}>Reports & Analytics</Link>,
        },
        {
            key: "7",
            icon: <SettingOutlined />,
            label: <Link to="settings" onClick={() => isMobile && setMobileMenuVisible(false)}>Settings</Link>,
        },
        {
            type: 'divider',
            key: 'divider-1',
        },
        {
            key: "8",
            icon: <FileTextOutlined />,
            label: <Link to="documentation" onClick={() => isMobile && setMobileMenuVisible(false)}>Documentation</Link>,
        },
    ];

    const userMenuItems: MenuProps['items'] = [
        {
            key: '0',
            label: (
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #e5e7eb',
                    background: 'linear-gradient(to right, rgba(67, 53, 167, 0.05), transparent)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar
                            size={48}
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=${encodeURIComponent('#D2691E')}&color=fff&size=128&bold=true`}
                            style={{
                                border: '3px solid rgba(210, 105, 30, 0.3)',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                        />
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                                {user?.name}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '4px'
                            }}>
                                <SafetyOutlined style={{ color: '#10B981' }} />
                                <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            disabled: true,
            style: { padding: 0, cursor: 'default' }
        },
        {
            type: 'divider',
            key: 'divider-1',
            style: { margin: '0' }
        },
        {
            key: '1',
            icon: <DashboardOutlined style={{ fontSize: '18px' }} />,
            label: (
                <Link
                    to="/admin-dashboard"
                    style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        display: 'block'
                    }}
                >
                    Admin Dashboard
                </Link>
            ),
            style: {
                padding: '8px 16px',
                height: 'auto',
                lineHeight: '1.5'
            }
        },
        {
            key: '2',
            icon: <HomeOutlined style={{ fontSize: '18px' }} />,
            label: (
                <Link
                    to="/"
                    style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        display: 'block'
                    }}
                >
                    Return to Home
                </Link>
            ),
            style: {
                padding: '8px 16px',
                height: 'auto',
                lineHeight: '1.5'
            }
        },
        {
            key: '3',
            icon: <SettingOutlined style={{ fontSize: '18px' }} />,
            label: (
                <Link
                    to="/admin-dashboard/settings"
                    style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        display: 'block'
                    }}
                >
                    Account Settings
                </Link>
            ),
            style: {
                padding: '8px 16px',
                height: 'auto',
                lineHeight: '1.5'
            }
        },
        {
            type: 'divider',
            key: 'divider-2',
            style: { margin: '0' }
        },
        {
            key: '4',
            icon: <LogoutOutlined style={{ fontSize: '18px', color: '#EF4444' }} />,
            label: (
                <button
                    onClick={handleLogout}
                    style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#EF4444',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left'
                    }}
                >
                    Logout
                </button>
            ),
            style: {
                padding: '8px 16px',
                height: 'auto',
                lineHeight: '1.5'
            }
        },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Fixed Logo Section - Modified for collapsed state */}
            <div className={`${collapsed && !isMobile ? 'h-20' : 'h-28'} flex-shrink-0 border-b border-white/15 bg-gradient-to-r from-[#4335A7] to-[#3a2c95]`}>
                <div className="flex items-center justify-center h-full px-4">
                    {!collapsed || isMobile ? (
                        <div className="flex items-center gap-4 w-full">
                            <div className="bg-white/10 p-3 rounded-2xl border border-white/20 shadow-lg">
                                <img
                                    src={logo}
                                    className="h-12 object-contain"
                                    alt="logo"
                                />
                            </div>
                            <div className="flex-1">
                                <Title level={3} className="hidden md:block !m-0 !text-white !font-bold tracking-tight">
                                    Car Rental
                                </Title>
                                <Text className="text-white/80 text-sm font-medium">
                                    Admin Panel
                                </Text>
                            </div>
                            {isMobile && (
                                <Button
                                    type="text"
                                    icon={<CloseOutlined className="text-white" />}
                                    onClick={() => setMobileMenuVisible(false)}
                                    className="ml-auto"
                                />
                            )}
                        </div>
                    ) : (
                        // Show only logo/icon in collapsed state
                        <div className="flex items-center justify-center w-full">
                            <div className="bg-white/10 p-3 rounded-2xl border border-white/20 shadow-lg">
                                <img
                                    src={logo}
                                    className="h-10 w-10 object-contain"
                                    alt="logo"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Navigation Menu */}
            <div
                ref={menuContainerRef}
                className="flex-1 overflow-y-auto"
                style={{
                    minHeight: '0',
                }}
            >
                <div className="px-4 py-4">
                    <Menu
                        mode="inline"
                        selectedKeys={[getSelectedKey()]}
                        items={menuItems}
                        className="admin-menu bg-transparent border-none"
                        theme="dark"
                        inlineCollapsed={collapsed && !isMobile} // Important: Enable collapsed mode
                        style={{
                            background: 'transparent',
                            border: 'none',
                        }}
                    />
                </div>
            </div>

            {/* Fixed User Info Section at Bottom - Hide when collapsed on desktop */}
            {((!collapsed && !isMobile) || isMobile) && (
                <div className="flex-shrink-0 p-5 border-t border-white/15 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Avatar
                            size={50}
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=${encodeURIComponent('#D2691E')}&color=fff&size=128&bold=true`}
                            className="border-3 border-white/30 shadow-lg"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-white truncate">
                                {user?.name}
                            </p>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                <p className="text-xs text-white/70 truncate">
                                    {user?.role === 'admin' ? 'Administrator' : 'User Manager'}
                                </p>
                            </div>
                        </div>
                        <GlobalOutlined className="text-white/60 text-lg" />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={280}
                    collapsedWidth={80} // Keep this at 80px for icon-only mode
                    className="shadow-2xl admin-sidebar hidden lg:block"
                    style={{
                        background: 'linear-gradient(180deg, #4335A7 0%, #2D1B69 100%)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.15)',
                        overflow: 'hidden',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 100,
                    }}
                >
                    {sidebarContent}
                </Sider>
            )}

            {/* Mobile Drawer Menu */}
            <Drawer
                title={null}
                placement="left"
                closable={false}
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                width={280}
                className="lg:hidden"
                style={{ zIndex: 1001, padding: 0 }}
            >
                {sidebarContent}
            </Drawer>

            {/* Main Content Area */}
            <Layout
                className={`transition-all duration-300 ${isMobile
                    ? 'ml-0'
                    : collapsed
                        ? 'ml-[80px]'
                        : 'ml-[280px]'
                    }`}
                style={{ minHeight: '100vh' }}
            >
                {/* Header */}
                <Header
                    className="sticky top-0 z-50 h-20 md:h-24 px-4 md:px-8 shadow-lg bg-gradient-to-r from-white to-gray-50 border-b border-gray-200/80"
                    style={{
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.98)'
                    }}
                >
                    <div className="flex items-center justify-between h-full">
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            {isMobile ? (
                                <Button
                                    type="text"
                                    icon={<MenuOutlined className="text-2xl" />}
                                    onClick={() => setMobileMenuVisible(true)}
                                    className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100/80 text-gray-700 hover:text-[#4335A7] transition-all duration-300"
                                />
                            ) : (
                                <Button
                                    type="text"
                                    icon={
                                        collapsed ? (
                                            <MenuUnfoldOutlined className="text-2xl" />
                                        ) : (
                                            <MenuFoldOutlined className="text-2xl" />
                                        )
                                    }
                                    onClick={() => setCollapsed(!collapsed)}
                                    className="flex items-center justify-center w-12 h-12 rounded-xl hover:bg-gray-100/80 text-gray-700 hover:text-[#4335A7] transition-all duration-300"
                                />
                            )}

                            {/* Search - Different behavior for mobile */}
                            <div className="flex items-center gap-2">
                                {isSearchVisible ? (
                                    <div className="flex items-center gap-2 w-full">
                                        <Search
                                            placeholder="Search..."
                                            allowClear
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full"
                                            size="middle"
                                            prefix={<SearchOutlined className="text-gray-500" />}
                                            autoFocus
                                            onBlur={() => !searchTerm && setIsSearchVisible(false)}
                                            style={{
                                                borderRadius: '12px',
                                            }}
                                        />
                                        <Button
                                            type="text"
                                            icon={<CloseOutlined />}
                                            onClick={() => {
                                                setIsSearchVisible(false);
                                                setSearchTerm('');
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {isMobile ? (
                                            <Button
                                                type="text"
                                                icon={<SearchOutlined className="text-xl" />}
                                                onClick={() => setIsSearchVisible(true)}
                                                className="md:hidden"
                                            />
                                        ) : (
                                            <Search
                                                placeholder="Search cars, bookings, users..."
                                                allowClear
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-60 lg:w-80 xl:w-96"
                                                size="large"
                                                prefix={<SearchOutlined className="text-gray-500 text-lg" />}
                                                style={{
                                                    borderRadius: '12px',
                                                    fontSize: '16px',
                                                    height: '48px'
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3 md:gap-5">
                            {/* Quick Stats - Hide on mobile */}
                            {!isMobile && (
                                <div className="hidden md:flex items-center gap-4 lg:gap-6">
                                    <div className="text-center px-3 lg:px-4">
                                        <div className="text-base lg:text-lg font-bold text-[#4335A7]">24</div>
                                        <div className="text-xs text-gray-500 font-medium">Active Bookings</div>
                                    </div>
                                    <div className="text-center px-3 lg:px-4">
                                        <div className="text-base lg:text-lg font-bold text-[#D2691E]">12</div>
                                        <div className="text-xs text-gray-500 font-medium">Cars Available</div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications */}
                            <div className="relative">
                                <Dropdown
                                    menu={{
                                        items: notificationMenuItems,
                                        onClick: ({ key }) => {
                                            if (key === 'show-more') {
                                                setShowAllNotifications(true);
                                            }
                                        }
                                    }}
                                    trigger={['click']}
                                    placement="bottomRight"
                                    overlayClassName="notification-dropdown"
                                    overlayStyle={{
                                        width: isMobile ? 'calc(100vw - 32px)' : '480px',
                                        maxHeight: '560px',
                                        overflow: 'hidden',
                                    }}
                                    onOpenChange={(open) => {
                                        if (!open) {
                                            setShowAllNotifications(false);
                                            refetch();
                                        }
                                    }}
                                >
                                    <Button
                                        type="text"
                                        className="relative"
                                    >
                                        <Badge
                                            count={unreadCount}
                                            offset={isMobile ? [-5, -2] : [1, -2]}
                                            overflowCount={99}
                                            style={{
                                                backgroundColor: unreadCount > 0 ? '#ff4d4f' : '#d9d9d9',
                                                boxShadow: '0 0 0 2px #fff'
                                            }}
                                        >
                                            <div className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                                <BellOutlined style={{ fontSize: isMobile ? "20px" : "24px" }} className="text-bold text-gray-600 hover:text-[#4335A7]" />
                                            </div>
                                        </Badge>
                                    </Button>
                                </Dropdown>
                            </div>

                            {/* Divider - Hide on mobile */}
                            {!isMobile && (
                                <div className="h-8 w-px bg-gray-300"></div>
                            )}

                            {/* User Dropdown */}
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                trigger={["click"]}
                                placement="bottomRight"
                                overlayClassName="custom-user-dropdown"

                            >
                                <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-gray-50/80 px-2 md:px-4 py-2 rounded-xl transition-all duration-300 group">
                                    {/* Text - Hide on mobile */}
                                    {!isMobile && (
                                        <div className="hidden lg:flex flex-col leading-tight">
                                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[140px] group-hover:text-[#4335A7] transition-colors">
                                                {user?.name}
                                            </p>
                                            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                                                <AppstoreOutlined className="text-[10px]" />
                                                <span className="font-medium capitalize tracking-wide">
                                                    {user?.role}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <Avatar
                                        size={isMobile ? 36 : 40}
                                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=${encodeURIComponent(
                                            "#D2691E"
                                        )}&color=fff&size=128&bold=true`}
                                        className="border border-[#D2691E]/40 shadow-sm group-hover:scale-105 transition-transform duration-300"
                                        icon={!user?.name ? <UserOutlined /> : undefined}
                                    />
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Header>

                {/* Main Content */}
                <Content className="mt-4 md:mt-6">
                    <div
                        className="min-h-[calc(100vh-180px)] md:min-h-[calc(100vh-220px)] bg-white"
                        style={{
                            background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
                            margin: isMobile ? '0 12px 16px' : '0 24px 24px',
                            borderRadius: isMobile ? '12px' : '16px',

                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>

            {/* Add custom CSS for admin menu styling */}
            <style>{`
                /* Admin Sidebar Menu - White Text Always */
                .admin-menu.ant-menu-dark {
                    background: transparent !important;
                }
                
                .admin-menu.ant-menu-dark .ant-menu-item,
                .admin-menu.ant-menu-dark .ant-menu-submenu-title {
                    color: white !important;
                    font-weight: 500;
                    font-size: 15px;
                    min-height: 50px; /* allow internal padding to work */
                    margin: 2px 0 !important;
                    border-radius: 10px !important;
                    padding: 0 16px !important;
                    transition: all 0.3s ease;
                }
                
                /* Hover State - Keep white text */
                .admin-menu.ant-menu-dark .ant-menu-item:hover,
                .admin-menu.ant-menu-dark .ant-menu-submenu-title:hover {
                    background: rgba(255, 255, 255, 0.15) !important;
                    color: white !important;
                }
                
                /* Selected State - Keep white text */
                .admin-menu.ant-menu-dark .ant-menu-item-selected {
                    background: rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                    font-weight: 600;
                }
                
                /* Icons - Always white */
                .admin-menu.ant-menu-dark .ant-menu-item .ant-menu-item-icon,
                .admin-menu.ant-menu-dark .ant-menu-submenu-title .ant-menu-item-icon,
                .admin-menu.ant-menu-dark .ant-menu-item .anticon,
                .admin-menu.ant-menu-dark .ant-menu-submenu-title .anticon {
                    color: white !important;
                    font-size: 18px !important;
                    transition: all 0.3s ease;
                }
                
                /* Hover icon color */
                .admin-menu.ant-menu-dark .ant-menu-item:hover .ant-menu-item-icon,
                .admin-menu.ant-menu-dark .ant-menu-submenu-title:hover .ant-menu-item-icon,
                .admin-menu.ant-menu-dark .ant-menu-item:hover .anticon,
                .admin-menu.ant-menu-dark .ant-menu-submenu-title:hover .anticon {
                    color: white !important;
                }
                
                /* Selected icon color */
                .admin-menu.ant-menu-dark .ant-menu-item-selected .ant-menu-item-icon,
                .admin-menu.ant-menu-dark .ant-menu-item-selected .anticon {
                    color: white !important;
                }
                
                /* Links - Always white */
                .admin-menu.ant-menu-dark .ant-menu-item a,
                .admin-menu.ant-menu-dark .ant-menu-submenu-title a {
                    color: white !important;
                    transition: all 0.3s ease;
                }
                
                /* Hover link color */
                .admin-menu.ant-menu-dark .ant-menu-item:hover a,
                .admin-menu.ant-menu-dark .ant-menu-submenu-title:hover a {
                    color: white !important;
                }
                
                /* Selected link color */
                .admin-menu.ant-menu-dark .ant-menu-item-selected a {
                    color: white !important;
                }
                
                /* Divider styling */
                .admin-menu.ant-menu-dark .ant-menu-item-divider {
                    background-color: rgba(255, 255, 255, 0.15) !important;
                    margin: 16px 0 !important;
                }
                
                /* For collapsed state */
                .admin-menu.ant-menu-inline-collapsed .ant-menu-item,
                .admin-menu.ant-menu-inline-collapsed .ant-menu-submenu-title {
                    padding: 0 32px !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* Collapsed state icons */
                .admin-menu.ant-menu-inline-collapsed .ant-menu-item .ant-menu-item-icon,
                .admin-menu.ant-menu-inline-collapsed .ant-menu-item .anticon {
                    font-size: 20px !important;
                    margin-right: 0 !important;
                }
                
                /* Custom scrollbar for admin sidebar */
                .admin-sidebar .overflow-y-auto::-webkit-scrollbar {
                    width: 4px;
                }
                
                .admin-sidebar .overflow-y-auto::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .admin-sidebar .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                }
                
                .admin-sidebar .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
                
                /* Remove Ant Design's default selected indicator */
                .admin-menu.ant-menu-dark .ant-menu-item-selected::after {
                    display: none !important;
                }
                
                /* Mobile optimizations */
                @media (max-width: 768px) {
                    .ant-dropdown-menu {
                        max-width: calc(100vw - 32px) !important;
                    }
                    
                    .ant-layout-header {
                        padding: 0 16px !important;
                    }
                    
                    .ant-menu-item,
                    .ant-menu-submenu-title {
                        height: 48px !important;
                        line-height: 48px !important;
                    }
                }
                
                /* Tablet optimizations */
                @media (min-width: 768px) and (max-width: 1024px) {
                    .ant-layout-header {
                        padding: 0 24px !important;
                    }
                    
                    .ant-search-input {
                        width: 200px !important;
                    }
                }
                
                /* Animation for new notifications */
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 77, 79, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
                }
                
                .notification-badge-pulse {
                    animation: pulse-glow 2s infinite;
                }
                
                /* Mobile drawer styles */
                .ant-drawer-body {
                    padding: 0 !important;
                    background: linear-gradient(180deg, #4335A7 0%, #2D1B69 100%);
                }

                /* Add to the existing CSS */
                /* Ensure icons are visible in collapsed mode */
                .admin-menu.ant-menu-inline-collapsed .ant-menu-item,
                .admin-menu.ant-menu-inline-collapsed .ant-menu-submenu-title {
                    padding: 0 calc(50% - 12px) !important; /* Center the icons */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                }

                /* Collapsed state icons - larger and centered */
                .admin-menu.ant-menu-inline-collapsed .ant-menu-item .ant-menu-item-icon,
                .admin-menu.ant-menu-inline-collapsed .ant-menu-item .anticon {
                    font-size: 22px !important;
                    margin-right: 0 !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Remove text but keep icons in collapsed mode */
                .admin-menu.ant-menu-inline-collapsed .ant-menu-item span,
                .admin-menu.ant-menu-inline-collapsed .ant-menu-submenu-title span:not(.anticon) {
                    display: none;
                }

                /* Tooltip for collapsed menu items */
                .admin-menu.ant-menu-inline-collapsed .ant-menu-item {
                    position: relative;
                }

                /* Ensure tooltip shows menu item title */
                .ant-tooltip-inner {
                    font-size: 14px;
                    font-weight: 500;
                }

                /* ===== DROPDOWN MENU FIXES ===== */
                /* General dropdown fixes */
                .ant-dropdown-menu {
                    border-radius: 12px !important;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
                    padding: 8px 0 !important;
                    width: 256px !important;
                    overflow: hidden !important;
                }

                .ant-dropdown-menu-item {
                    padding: 8px 16px !important;
                    height: auto !important;
                    line-height: 1.5 !important;
                    margin: 0 !important;
                    min-height: 44px !important;
                }

                .ant-dropdown-menu-item:hover {
                    background-color: #f3f4f6 !important;
                }

                .ant-dropdown-menu-item-disabled {
                    opacity: 1 !important;
                    cursor: default !important;
                    padding: 0 !important;
                    background: transparent !important;
                }

                .ant-dropdown-menu-item-disabled:hover {
                    background-color: transparent !important;
                }

                .ant-dropdown-menu-item .ant-dropdown-menu-title-content {
                    width: 100% !important;
                }

                .ant-dropdown-menu-item .ant-dropdown-menu-item-icon {
                    margin-right: 12px !important;
                    font-size: 18px !important;
                }

                /* Fix for disabled item */
                .ant-dropdown-menu-item-disabled .ant-avatar {
                    border: 3px solid rgba(210, 105, 30, 0.3) !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                }

                /* Override any conflicting styles */
                .ant-dropdown-menu-item-selected,
                .ant-dropdown-menu-submenu-title-selected {
                    background-color: transparent !important;
                }

                /* Fix for button inside dropdown */
                .ant-dropdown-menu-item button {
                    width: 100% !important;
                    text-align: left !important;
                    background: none !important;
                    border: none !important;
                    padding: inherit !important; /* allow parent padding (or utility classes) to apply */
                    cursor: pointer !important;
                    font-size: 16px !important;
                    font-weight: 500 !important;
                    color: inherit !important;
                }

                .ant-dropdown-menu-item button:hover {
                    background: none !important;
                }

                /* Ensure links are properly styled */
                .ant-dropdown-menu-item a {
                    color: inherit !important;
                    text-decoration: none !important;
                    display: block !important;
                    font-size: 16px !important;
                    font-weight: 500 !important;
                }

                .ant-dropdown-menu-item a:hover {
                    color: inherit !important;
                }

                /* Divider styling */
                .ant-dropdown-menu-item-divider {
                    margin: 4px 0 !important;
                    background-color: #e5e7eb !important;
                }

                /* Responsive dropdown */
                @media (max-width: 768px) {
                    .ant-dropdown-menu {
                        width: 240px !important;
                        max-width: calc(100vw - 32px) !important;
                    }
                    
                    .ant-dropdown-menu-item {
                        padding: 8px 14px !important;
                    }
                }

                /* User dropdown specific styles */
                .custom-user-dropdown .ant-dropdown-menu {
                    border-radius: 12px !important;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
                    padding: 0 !important;
                    overflow: hidden !important;
                }

                .custom-user-dropdown .ant-dropdown-menu-item {
                    padding: 12px 16px !important;
                }

                .custom-user-dropdown .ant-dropdown-menu-item-disabled {
                    padding: 16px !important;
                    margin: 0 !important;
                }

                /* Notification dropdown specific fixes */
                .ant-dropdown-menu-item-group-title {
                    padding: 12px 16px !important;
                    font-weight: 600 !important;
                    color: #111827 !important;
                    background: #f9fafb !important;
                    border-bottom: 1px solid #e5e7eb !important;
                }

                /* Fix for notification badge positioning */
                .ant-badge-count {
                    transform: translate(50%, -50%) !important;
                }

                /* Fix dropdown z-index issues */
                .ant-dropdown {
                    z-index: 1050 !important;
                }

                /* Ensure dropdown arrows are visible */
                .ant-dropdown-arrow {
                    background: white !important;
                    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.05) !important;
                }

                /* Custom scrollbar for dropdowns */
                .ant-dropdown-menu::-webkit-scrollbar {
                    width: 6px;
                }

                .ant-dropdown-menu::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }

                .ant-dropdown-menu::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }

                .ant-dropdown-menu::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }

                /* Fix for ant-design icon alignment */
                .ant-dropdown-menu-item .anticon {
                    vertical-align: middle !important;
                }

                /* Fix for notification dropdown items */
                .notification-item .ant-dropdown-menu-item {
                    padding: 0 !important;
                }

                .notification-item .ant-dropdown-menu-item .ant-dropdown-menu-title-content {
                    padding: 12px 16px !important;
                }

                /* Notification dropdown specific sizing & style */
                .notification-dropdown .ant-dropdown-menu {
                    width: 480px !important;
                    padding: 0 !important;
                    max-height: 560px !important;
                }

                .notification-dropdown .ant-dropdown-menu-item {
                    padding: 0 !important;
                    background: transparent !important;
                }

                .notification-dropdown .ant-dropdown-menu-item-disabled {
                    padding: 12px 16px !important;
                }

                .notification-dropdown .ant-dropdown-menu-item .ant-dropdown-menu-title-content {
                    width: 100% !important;
                    padding: 0 !important;
                }

                /* Ensure notification header (disabled item) lays out horizontally */
                .notification-dropdown .ant-dropdown-menu-item-disabled > div {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important;
                    gap: 12px !important;
                    padding: 12px 16px !important;
                    white-space: normal !important;
                }

                .notification-dropdown .ant-dropdown-menu-item-disabled .flex {
                    display: flex !important;
                    align-items: center !important;
                    gap: 12px !important;
                }

                .notification-dropdown .ant-dropdown-menu-item-disabled .ml-2,
                .notification-dropdown .ant-dropdown-menu-item-disabled .mt-1 {
                    margin: 0 !important;
                }

                /* Ensure badges and counters align horizontally */
                .notification-dropdown .ant-badge,
                .notification-dropdown .ant-badge-count {
                    display: inline-flex !important;
                    transform: none !important;
                    vertical-align: middle !important;
                }

                /* Ensure dropdown menu items don't inherit unwanted styles */
                .ant-dropdown-menu-item-group-list {
                    margin: 0 !important;
                    padding: 0 !important;
                }

                /* Fix for mobile dropdowns */
                @media (max-width: 768px) {
                    .ant-dropdown {
                        position: fixed !important;
                        top: 80px !important;
                        right: 16px !important;
                    }
                    
                    .ant-dropdown-menu {
                        max-height: 70vh !important;
                        overflow-y: auto !important;
                    }
                }

                /* Notification dropdown specific styles */
                .notification-dropdown .ant-dropdown-menu {
                    max-height: 500px !important;
                    overflow-y: auto !important;
                }

                .notification-dropdown .ant-dropdown-menu-item-disabled {
                    cursor: default !important;
                    background: transparent !important;
                }

                .notification-dropdown .ant-dropdown-menu-item-disabled:hover {
                    background: transparent !important;
                }

                /* Global styling for notification items in admin */
                .notification-list-item {
                    display: block !important;
                    background: transparent;
                    padding: 12px 16px !important;
                }

                .notification-list-item .text-sm {
                    display: block;
                }

                .notification-list-item.unread {
                    background: linear-gradient(90deg, rgba(67,53,167,0.04), rgba(106,90,205,0.02)) !important;
                }

                .notification-list-item .w-2.h-2.rounded-full {
                    width: 8px !important;
                    height: 8px !important;
                }

                .notification-list-item:hover {
                    background: #ffffff !important;
                }
                /* Delete button visibility on hover */
                .notification-delete-btn {
                    display: none;
                }

                .notification-list-item:hover .notification-delete-btn {
                    display: inline-flex !important;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </Layout>
    );
};

export default AdminDashboard;