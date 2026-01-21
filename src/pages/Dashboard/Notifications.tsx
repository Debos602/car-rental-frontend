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
    Modal,
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
    useMarkAsReadSingleMutation,
    useDeleteNotificationMutation,
    useMarkAsUnreadMutation
} from "@/redux/feature/notification/notificationApi";

// Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";
import {
    fadeIn,
    staggerContainer,
    slideIn,
    scaleHover,
    listItemVariants,
    cardHover
} from "@/lib/animations";

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

// Animation variants
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3
        }
    }
};

const statCardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: (index: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.1 * index,
            duration: 0.5,
            type: "spring",
            stiffness: 100
        }
    }),
    hover: {
        y: -5,
        scale: 1.02,
        transition: {
            duration: 0.2,
            type: "spring",
            stiffness: 300
        }
    }
};

// Using shared animation variants from `@/lib/animations` for list items

const filterCardVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            type: "spring",
            stiffness: 120
        }
    }
};

const emptyStateVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            type: "spring",
            stiffness: 100
        }
    }
};

// Use `scaleHover` from `@/lib/animations` for button interactions

const loadingVariants = {
    initial: { opacity: 0.5 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse" as const
        }
    }
};

const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchText, setSearchText] = useState<string>("");
    const [dateRange, setDateRange] = useState<any>(null);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // API hooks
    const {
        data: notificationsResponse,
        isLoading,
        refetch
    } = useGetNotificationsQuery(undefined);

    const [markAsRead] = useMarkAsReadMutation();
    const [markAsReadSingle] = useMarkAsReadSingleMutation();
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
                await markAsReadSingle(item._id).unwrap();
                message.success('Marked as read');
                refetch();
            } catch (error) {
                message.error('Failed to mark as read');
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
            message.success('Marked as unread');
            refetch();
        } catch (error) {
            message.error('Failed to mark as unread');
        }
    };

    // Handle delete notification with animation
    const handleDeleteNotification = async (id: string) => {
        setIsDeleting(id);
        try {
            await deleteNotification({ id }).unwrap();
            message.success('Notification deleted');
            // Add a small delay to show the exit animation
            setTimeout(() => {
                refetch();
                setSelectedNotifications(prev => prev.filter(itemId => itemId !== id));
                setIsDeleting(null);
            }, 300);
        } catch (error) {
            message.error('Failed to delete notification');
            setIsDeleting(null);
        }
    };

    const showDeleteConfirm = (id?: string) => {
        if (!id) return;
        Modal.confirm({
            title: 'Delete this notification?',
            content: 'This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                await handleDeleteNotification(id);
            }
        });
    };

    // Handle mark all as read
    const handleMarkAllAsRead = async () => {
        try {
            await markAsRead().unwrap();
            message.success('All notifications marked as read');
            refetch();
        } catch (error) {
            message.error('Failed to mark all as read');
        }
    };

    // Handle bulk actions
    const handleBulkMarkAsRead = async () => {
        try {
            await markAsRead().unwrap();
            message.success('Selected notifications marked as read');
            refetch();
            setSelectedNotifications([]);
        } catch (error) {
            message.error('Failed to mark as read');
        }
    };

    const handleBulkDelete = async () => {
        try {
            for (const id of selectedNotifications) {
                await deleteNotification({ id }).unwrap();
            }
            message.success('Selected notifications deleted');
            refetch();
            setSelectedNotifications([]);
        } catch (error) {
            message.error('Failed to delete notifications');
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
            <motion.div
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}
                variants={loadingVariants}
                initial="initial"
                animate="animate"
            >
                <Spin size="large" />
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {/* Header Section */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Title level={2} className="!mb-2">
                                <BellOutlined className="mr-3" />
                                Notifications
                            </Title>
                            <Text type="secondary">
                                Stay updated with your latest activities and alerts
                            </Text>
                        </motion.div>
                    </div>
                    <Space>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                            >
                                Mark all as read
                            </Button>
                        </motion.div>
                    </Space>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} className="mb-6">
                    {[
                        { title: "Total Notifications", value: totalCount, prefix: <BellOutlined />, color: '#1890ff' },
                        { title: "Unread", value: unreadCount, prefix: <EyeOutlined />, color: '#ff4d4f' },
                        { title: "Read", value: readCount, prefix: <CheckCircleOutlined />, color: '#52c41a' }
                    ].map((stat, index) => (
                        <Col key={stat.title} xs={24} sm={8}>
                            <motion.div
                                variants={statCardVariants}
                                initial="initial"
                                animate="animate"
                                custom={index}
                                whileHover="hover"
                            >
                                <Card
                                    bordered={false}
                                    className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <Statistic
                                        title={stat.title}
                                        value={stat.value}
                                        prefix={stat.prefix}
                                        valueStyle={{ color: stat.color }}
                                    />
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </motion.div>

            {/* Filters and Bulk Actions */}
            <motion.div
                variants={filterCardVariants}
                initial="initial"
                animate="animate"
            >
                <Card className="mb-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        {/* Search and Filters */}
                        <Space wrap className="w-full lg:w-auto">
                            <motion.div whileHover={{ scale: 1.02 }}>
                                <Search
                                    placeholder="Search notifications..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{ width: 250 }}
                                    allowClear
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }}>
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
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }}>
                                <RangePicker
                                    value={dateRange}
                                    onChange={setDateRange}
                                    style={{ width: 250 }}
                                    placeholder={['Start Date', 'End Date']}
                                />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button onClick={handleClearFilters} type="text">
                                    Clear Filters
                                </Button>
                            </motion.div>
                        </Space>

                        {/* Bulk Actions */}
                        <AnimatePresence>
                            {selectedNotifications.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Space>
                                        <Text type="secondary">
                                            {selectedNotifications.length} selected
                                        </Text>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button onClick={clearSelection} size="small">
                                                Clear
                                            </Button>
                                        </motion.div>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                onClick={selectAllFiltered}
                                                size="small"
                                            >
                                                Select all ({filteredNotifications.length})
                                            </Button>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            variants={scaleHover}
                                        >
                                            <Button
                                                icon={<CheckOutlined />}
                                                onClick={handleBulkMarkAsRead}
                                                size="small"
                                            >
                                                Mark as read
                                            </Button>
                                        </motion.div>
                                        <Popconfirm
                                            title="Delete selected notifications?"
                                            description="This action cannot be undone."
                                            onConfirm={handleBulkDelete}
                                            okText="Delete"
                                            okType="danger"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                variants={scaleHover}
                                            >
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                >
                                                    Delete
                                                </Button>
                                            </motion.div>
                                        </Popconfirm>
                                    </Space>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>

            {/* Notifications List */}
            <AnimatePresence mode="wait">
                {filteredNotifications.length === 0 ? (
                    <motion.div
                        key="empty"
                        variants={emptyStateVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <Card className="shadow-sm">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div>
                                        <Paragraph className="!mb-2">
                                            No notifications found
                                        </Paragraph>
                                        {searchText || filterStatus !== 'all' || dateRange ? (
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button onClick={handleClearFilters} type="link">
                                                    Clear filters to see all notifications
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <Text type="secondary">
                                                You're all caught up! New notifications will appear here.
                                            </Text>
                                        )}
                                    </div>
                                }
                            />
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="shadow-sm">
                            <AnimatePresence>
                                {filteredNotifications.map((item, index) => {
                                    const type = getNotificationType(item);
                                    const theme = NOTIFICATION_THEME[type];
                                    const isSelected = selectedNotifications.includes(item._id || '');
                                    const isBeingDeleted = isDeleting === item._id;

                                    return (
                                        <motion.div
                                            key={item._id}
                                            layout
                                            variants={listItemVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            whileHover="hover"
                                            whileTap="tap"
                                            className={`p-4 mb-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${isSelected ? 'border-primary bg-blue-50' : 'border-gray-200'
                                                } ${!item.read ? 'bg-blue-50' : ''}`}
                                            onClick={() => !isBeingDeleted && handleNotificationClick(item)}
                                            style={isBeingDeleted ? { opacity: 0.5 } : {}}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Checkbox for selection */}
                                                <motion.div
                                                    className="pt-1"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
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
                                                </motion.div>

                                                {/* Notification Icon with Animation */}
                                                <motion.div
                                                    className="flex-shrink-0"
                                                    whileHover={{ rotate: 5 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
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
                                                </motion.div>

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
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: "spring", stiffness: 200 }}
                                                            >
                                                                <Tag color={theme.tagColor} className="!m-0">
                                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                                </Tag>
                                                            </motion.div>
                                                            {!item.read && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ delay: 0.2 }}
                                                                >
                                                                    <Badge
                                                                        status="processing"
                                                                        text="Unread"
                                                                        color={theme.color}
                                                                    />
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                        <motion.div
                                                            className="flex items-center gap-3"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.3 }}
                                                        >
                                                            <Text type="secondary" className="text-sm whitespace-nowrap">
                                                                <ClockCircleOutlined className="mr-1" />
                                                                {getTimeLabel(item.createdAt)}
                                                            </Text>
                                                        </motion.div>
                                                    </div>

                                                    <Paragraph
                                                        className="mb-3 text-gray-600"
                                                        ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
                                                    >
                                                        {item.message}
                                                    </Paragraph>

                                                    {/* Action Buttons */}
                                                    <motion.div
                                                        className="flex items-center gap-2"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.4 }}
                                                    >
                                                        {item.read ? (
                                                            <Tooltip title="Mark as unread">
                                                                <motion.div
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
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
                                                                </motion.div>
                                                            </Tooltip>
                                                        ) : (
                                                            <Tooltip title="Mark as read">
                                                                <motion.div
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
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
                                                                </motion.div>
                                                            </Tooltip>
                                                        )}
                                                        <Tooltip title="Delete">
                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <Button
                                                                    danger
                                                                    size="small"
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (item._id) showDeleteConfirm(item._id);
                                                                    }}
                                                                    loading={isBeingDeleted}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </motion.div>
                                                        </Tooltip>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Info */}
            <AnimatePresence>
                {filteredNotifications.length > 0 && (
                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Text type="secondary">
                            Showing {filteredNotifications.length} of {notifications.length} notifications
                        </Text>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Notifications;