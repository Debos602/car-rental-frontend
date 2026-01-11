import React, { useState } from "react";
import {
    BellOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
    PlayCircleOutlined,
    VideoCameraOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    FilterOutlined,
    CheckOutlined,
    ClockCircleOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import {
    Card,
    Row,
    Col,
    Button,
    Typography,
    Avatar,
    Badge,
    Divider,
    Space,
    Dropdown,
    MenuProps,
    Tag,
    List,
    Spin,
    Empty,
    message,
    Popconfirm,
    Input,
    Select,
    DatePicker,
    Tooltip,
    Statistic
} from "antd";
import { useNavigate } from "react-router-dom";
import {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useDeleteNotificationMutation,
    useMarkAsUnreadMutation
} from "@/redux/feature/notification/notificationApi";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

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

// Color scheme for different notification types
const NOTIFICATION_THEME = {
    booking: {
        color: "#1890ff",
        bgColor: "#e6f7ff",
        icon: <CalendarOutlined />,
        tagColor: "blue"
    },
    security: {
        color: "#ff4d4f",
        bgColor: "#fff1f0",
        icon: <SafetyCertificateOutlined />,
        tagColor: "red"
    },
    payment: {
        color: "#52c41a",
        bgColor: "#f6ffed",
        icon: <CheckCircleOutlined />,
        tagColor: "green"
    },
    system: {
        color: "#722ed1",
        bgColor: "#f9f0ff",
        icon: <BellOutlined />,
        tagColor: "purple"
    },
    general: {
        color: "#8c8c8c",
        bgColor: "#fafafa",
        icon: <BellOutlined />,
        tagColor: "default"
    }
};

const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchText, setSearchText] = useState<string>("");
    const [dateRange, setDateRange] = useState<any>(null);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

    // API hooks
    const {
        data: notificationsResponse,
        isLoading,
        refetch
    } = useGetNotificationsQuery(undefined);

    const [markAsRead] = useMarkAsReadMutation();
    const [markAsUnread] = useMarkAsUnreadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();

    // Process notifications data
    const notifications: NotificationItem[] = (notificationsResponse?.data?.result || []).map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? String(item.createdAt) : undefined,
        updatedAt: item.updatedAt ? String(item.updatedAt) : undefined
    }));

    // Statistics
    const unreadCount = notifications.filter(item => !item.read).length;
    const totalCount = notifications.length;
    const readCount = totalCount - unreadCount;

    // Filter notifications based on status, search, and date
    const filteredNotifications = notifications.filter(notification => {
        // Filter by status
        if (filterStatus === "unread" && notification.read) return false;
        if (filterStatus === "read" && !notification.read) return false;

        // Filter by search text
        if (searchText) {
            const searchLower = searchText.toLowerCase();
            const titleMatch = notification.title?.toLowerCase().includes(searchLower);
            const messageMatch = notification.message?.toLowerCase().includes(searchLower);
            if (!titleMatch && !messageMatch) return false;
        }

        // Filter by date range
        if (dateRange && dateRange[0] && dateRange[1] && notification.createdAt) {
            const notificationDate = new Date(notification.createdAt);
            const startDate = new Date(dateRange[0]);
            const endDate = new Date(dateRange[1]);
            endDate.setHours(23, 59, 59, 999); // Include entire end day

            if (notificationDate < startDate || notificationDate > endDate) {
                return false;
            }
        }

        return true;
    });

    // Determine notification type based on content
    const getNotificationType = (item: NotificationItem): keyof typeof NOTIFICATION_THEME => {
        const title = item.title?.toLowerCase() || '';
        const message = item.message?.toLowerCase() || '';

        if (title.includes('booking') || message.includes('booking')) {
            return 'booking';
        }
        if (title.includes('payment') || message.includes('payment') || title.includes('invoice')) {
            return 'payment';
        }
        if (title.includes('security') || title.includes('alert') || title.includes('warning')) {
            return 'security';
        }
        if (title.includes('system') || title.includes('maintenance')) {
            return 'system';
        }
        return 'general';
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
            return createdDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Some time ago';
        }
    };

    // Handle single notification click
    const handleNotificationClick = async (item: NotificationItem) => {
        if (!item.read && item._id) {
            try {
                await markAsRead().unwrap();
                messageApi.success('Marked as read');
            } catch (error) {
                messageApi.error('Failed to mark as read');
            }
        }

        // Navigate based on notification type
        if (item.title.includes('Booking')) {
            navigate('/dashboard/booking');
        }
    };

    // Handle mark as unread
    const handleMarkAsUnread = async (id: string) => {
        try {
            await markAsUnread(id).unwrap();
            messageApi.success('Marked as unread');
            refetch();
        } catch (error) {
            messageApi.error('Failed to mark as unread');
        }
    };

    // Handle delete notification
    const handleDeleteNotification = async (id: string) => {
        try {
            await deleteNotification({ id }).unwrap();
            messageApi.success('Notification deleted');
            refetch();
            // Remove from selected if it was selected
            setSelectedNotifications(prev => prev.filter(itemId => itemId !== id));
        } catch (error) {
            messageApi.error('Failed to delete notification');
        }
    };

    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            await markAsRead().unwrap();
            messageApi.success('All notifications marked as read');
            refetch();
        } catch (error) {
            messageApi.error('Failed to mark all as read');
        }
    };

    // Handle bulk actions
    const handleBulkMarkAsRead = async () => {
        try {
            await markAsRead().unwrap();
            messageApi.success('Selected notifications marked as read');
            refetch();
            setSelectedNotifications([]);
        } catch (error) {
            messageApi.error('Failed to mark as read');
        }
    };

    const handleBulkDelete = async () => {
        try {
            for (const id of selectedNotifications) {
                await deleteNotification({ id }).unwrap();
            }
            messageApi.success('Selected notifications deleted');
            refetch();
            setSelectedNotifications([]);
        } catch (error) {
            messageApi.error('Failed to delete notifications');
        }
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilterStatus("all");
        setSearchText("");
        setDateRange(null);
        setSelectedNotifications([]);
    };

    // Toggle selection
    const toggleNotificationSelection = (id: string) => {
        setSelectedNotifications(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    // Select all filtered notifications
    const selectAllFiltered = () => {
        const filteredIds = filteredNotifications
            .filter(item => item._id)
            .map(item => item._id as string);
        setSelectedNotifications(filteredIds);
    };

    // Clear selection
    const clearSelection = () => {
        setSelectedNotifications([]);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {contextHolder}

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <Title level={2} className="!mb-2">
                            <BellOutlined className="mr-3" />
                            Notifications
                        </Title>
                        <Text type="secondary">
                            Stay updated with your latest activities and alerts
                        </Text>
                    </div>
                    <Space>
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                        >
                            Mark all as read
                        </Button>
                    </Space>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={8}>
                        <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title="Total Notifications"
                                value={totalCount}
                                prefix={<BellOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title="Unread"
                                value={unreadCount}
                                prefix={<EyeOutlined />}
                                valueStyle={{ color: '#ff4d4f' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
                            <Statistic
                                title="Read"
                                value={readCount}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Filters and Bulk Actions */}
            <Card className="mb-6 shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {/* Search and Filters */}
                    <Space wrap className="w-full lg:w-auto">
                        <Search
                            placeholder="Search notifications..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 250 }}
                            allowClear
                        />
                        <Select
                            value={filterStatus}
                            onChange={setFilterStatus}
                            style={{ width: 150 }}
                            suffixIcon={<FilterOutlined />}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="unread">Unread Only</Option>
                            <Option value="read">Read Only</Option>
                        </Select>
                        <RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            style={{ width: 250 }}
                            placeholder={['Start Date', 'End Date']}
                        />
                        <Button onClick={handleClearFilters} type="text">
                            Clear Filters
                        </Button>
                    </Space>

                    {/* Bulk Actions */}
                    {selectedNotifications.length > 0 && (
                        <Space>
                            <Text type="secondary">
                                {selectedNotifications.length} selected
                            </Text>
                            <Button onClick={clearSelection} size="small">
                                Clear
                            </Button>
                            <Button
                                onClick={selectAllFiltered}
                                size="small"
                            >
                                Select all ({filteredNotifications.length})
                            </Button>
                            <Button
                                icon={<CheckOutlined />}
                                onClick={handleBulkMarkAsRead}
                                size="small"
                            >
                                Mark as read
                            </Button>
                            <Popconfirm
                                title="Delete selected notifications?"
                                description="This action cannot be undone."
                                onConfirm={handleBulkDelete}
                                okText="Delete"
                                okType="danger"
                            >
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    size="small"
                                >
                                    Delete
                                </Button>
                            </Popconfirm>
                        </Space>
                    )}
                </div>
            </Card>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
                <Card className="shadow-sm">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div>
                                <Paragraph className="!mb-2">
                                    No notifications found
                                </Paragraph>
                                {searchText || filterStatus !== 'all' || dateRange ? (
                                    <Button onClick={handleClearFilters} type="link">
                                        Clear filters to see all notifications
                                    </Button>
                                ) : (
                                    <Text type="secondary">
                                        You're all caught up! New notifications will appear here.
                                    </Text>
                                )}
                            </div>
                        }
                    />
                </Card>
            ) : (
                <Card className="shadow-sm">
                    <List
                        dataSource={filteredNotifications}
                        renderItem={(item) => {
                            const type = getNotificationType(item);
                            const theme = NOTIFICATION_THEME[type];
                            const isSelected = selectedNotifications.includes(item._id || '');

                            return (
                                <div
                                    className={`p-4 mb-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${isSelected ? 'border-primary bg-blue-50' : 'border-gray-200'
                                        } ${!item.read ? 'bg-blue-50' : ''}`}
                                    onClick={() => handleNotificationClick(item)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Checkbox for selection */}
                                        <div className="pt-1">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    if (item._id) {
                                                        toggleNotificationSelection(item._id);
                                                    }
                                                }}
                                                className="w-4 h-4 cursor-pointer"
                                            />
                                        </div>

                                        {/* Notification Icon */}
                                        <div className="flex-shrink-0">
                                            <Avatar
                                                size={48}
                                                icon={theme.icon}
                                                style={{
                                                    backgroundColor: theme.bgColor,
                                                    color: theme.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            />
                                        </div>

                                        {/* Notification Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Text
                                                        strong
                                                        className={`text-base ${!item.read ? 'font-semibold' : 'font-normal'
                                                            }`}
                                                        style={{
                                                            color: !item.read ? theme.color : undefined
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Text>
                                                    <Tag color={theme.tagColor} className="!m-0">
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </Tag>
                                                    {!item.read && (
                                                        <Badge
                                                            status="processing"
                                                            text="Unread"
                                                            color={theme.color}
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Text type="secondary" className="text-sm whitespace-nowrap">
                                                        <ClockCircleOutlined className="mr-1" />
                                                        {getTimeLabel(item.createdAt)}
                                                    </Text>
                                                </div>
                                            </div>

                                            <Paragraph
                                                className="mb-3 text-gray-600"
                                                ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                                            >
                                                {item.message}
                                            </Paragraph>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                {item.read ? (
                                                    <Tooltip title="Mark as unread">
                                                        <Button
                                                            size="small"
                                                            icon={<EyeOutlined />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (item._id) handleMarkAsUnread(item._id);
                                                            }}
                                                        >
                                                            Mark as unread
                                                        </Button>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Mark as read">
                                                        <Button
                                                            size="small"
                                                            icon={<CheckOutlined />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleNotificationClick(item);
                                                            }}
                                                        >
                                                            Mark as read
                                                        </Button>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Delete">
                                                    <Popconfirm
                                                        title="Delete this notification?"
                                                        description="This action cannot be undone."
                                                        onConfirm={(e) => {
                                                            e?.stopPropagation();
                                                            if (item._id) handleDeleteNotification(item._id);
                                                        }}
                                                        onCancel={(e) => e?.stopPropagation()}
                                                        okText="Delete"
                                                        okType="danger"
                                                    >
                                                        <Button
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </Popconfirm>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </Card>
            )}

            {/* Footer Info */}
            {filteredNotifications.length > 0 && (
                <div className="mt-6 text-center">
                    <Text type="secondary">
                        Showing {filteredNotifications.length} of {notifications.length} notifications
                    </Text>
                </div>
            )}
        </div>
    );
};

export default Notifications;