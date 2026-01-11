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
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Input, Badge, Dropdown, Tooltip, Typography, Spin, Empty } from "antd";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/feature/authSlice";
import logo from "@/assets/car_lgo.png";
import { RootState } from "@/redux/store";
import { TUser } from "@/types/global";
import type { MenuProps } from 'antd';
import { useGetAllNotificationsQuery } from "@/redux/feature/notification/notificationApi";
// Adjust path as needed

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

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
    const [collapsed, setCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAllNotifications, setShowAllNotifications] = useState(false);
    const menuContainerRef = useRef<HTMLDivElement>(null);

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
        pollingInterval: 30000, // Poll every 30 seconds for new notifications
    });

    // console.log("Notifications Data:", notificationsData);

    const notifications: NotificationItem[] = notificationsData?.data ?? [];
    const unreadCount = notifications.filter((n) => !n.read).length;
    console.log("Notifications Data:", notifications.length);
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

    // Get notification icon based on type
    const getNotificationIcon = (item: NotificationItem) => {
        const title = item.title?.toLowerCase() || '';
        const message = item.message?.toLowerCase() || '';

        if (title.includes('booking') || message.includes('booking')) {
            return <BookOutlined className="text-blue-500" />;
        }
        if (title.includes('payment') || message.includes('payment')) {
            return <MoneyCollectOutlined className="text-green-500" />;
        }
        if (title.includes('car') || message.includes('car')) {
            return <CarOutlined className="text-amber-500" />;
        }
        if (title.includes('user') || message.includes('user')) {
            return <TeamOutlined className="text-purple-500" />;
        }
        if (title.includes('system') || message.includes('system')) {
            return <SettingOutlined className="text-gray-500" />;
        }
        if (title.includes('alert') || title.includes('warning')) {
            return <SafetyOutlined className="text-red-500" />;
        }
        return <BellOutlined className="text-gray-500" />;
    };

    // Get notification color based on urgency
    const getNotificationColor = (item: NotificationItem) => {
        const title = item.title?.toLowerCase() || '';

        if (title.includes('urgent') || title.includes('critical')) {
            return 'bg-red-50 border-red-200';
        }
        if (title.includes('warning') || title.includes('alert')) {
            return 'bg-amber-50 border-amber-200';
        }
        if (title.includes('payment') || title.includes('completed')) {
            return 'bg-green-50 border-green-200';
        }
        if (!item.read) {
            return 'bg-blue-50 border-blue-200';
        }
        return 'bg-gray-50 border-gray-200';
    };

    const handleNotificationClick = (item: NotificationItem) => {
        // Handle notification click based on type
        if (item.title.includes('Booking')) {
            navigate('/admin-dashboard/manage-booking');
        } else if (item.title.includes('Car')) {
            navigate('/admin-dashboard/manage-car');
        } else if (item.title.includes('User')) {
            navigate('/admin-dashboard/user-management');
        } else if (item.title.includes('Payment')) {
            navigate('/admin-dashboard/manage-return-car');
        }
    };

    const handleMarkAllAsRead = async () => {
        // Implement mark all as read functionality
        // You'll need to add this mutation to your API
        console.log('Mark all as read');
    };

    const handleViewAllNotifications = () => {
        navigate('/admin-dashboard/notifications');
    };

    // Notification dropdown menu items
    const notificationMenuItems: MenuProps['items'] = [
        {
            key: 'header',
            label: (
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BellOutlined className="text-xl text-blue-600" />
                            <div>
                                <Text strong className="text-base text-gray-900">
                                    Notifications
                                </Text>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                        count={notifications.length}
                                        style={{ backgroundColor: '#4335A7' }}
                                        size="small"
                                    />
                                    <Text type="secondary" className="text-xs">
                                        Total
                                    </Text>
                                    {unreadCount > 0 && (
                                        <>
                                            <Badge
                                                count={unreadCount}
                                                style={{ backgroundColor: '#ff4d4f' }}
                                                size="small"
                                            />
                                            <Text type="secondary" className="text-xs">
                                                Unread
                                            </Text>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                type="link"
                                size="small"
                                className="text-blue-600 text-xs"
                                onClick={handleMarkAllAsRead}
                            >
                                Mark all read
                            </Button>
                        )}
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
                        className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${getNotificationColor(item)} border-l-4`}
                        onClick={() => handleNotificationClick(item)}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center">
                                    {getNotificationIcon(item)}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <Text
                                        strong
                                        className={`text-sm mb-1 line-clamp-1 ${!item.read ? 'text-gray-900' : 'text-gray-700'}`}
                                    >
                                        {item.title}
                                        {!item.read && (
                                            <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                        )}
                                    </Text>
                                    <Text type="secondary" className="text-xs whitespace-nowrap">
                                        {getTimeLabel(item.createdAt)}
                                    </Text>
                                </div>
                                <Text
                                    className="text-sm text-gray-600 line-clamp-2"
                                    style={{ lineHeight: '1.4' }}
                                >
                                    {item.message}
                                </Text>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                        dot={!item.read}
                                        color={item.read ? 'default' : 'blue'}
                                        size="small"
                                    />
                                    <Text type="secondary" className="text-xs">
                                        {item.read ? 'Read' : 'Unread'}
                                    </Text>
                                </div>
                            </div>
                        </div>
                    </div>
                ),
            })),
            ...(notifications.length > 5 && !showAllNotifications ? [{
                key: 'show-more',
                label: (
                    <div className="px-4 py-2 text-center border-t border-gray-200">
                        <Button
                            type="link"
                            size="small"
                            className="text-blue-600"
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
        }]),
        {
            key: 'footer',
            label: (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <Button
                        type="default"
                        block
                        onClick={handleViewAllNotifications}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                        View all notifications
                    </Button>
                </div>
            ),
            disabled: true,
        },
    ];

    const menuItems: MenuProps['items'] = [
        {
            key: "1",
            icon: <DashboardOutlined />,
            label: <Link to="dashboard-overview">Dashboard Overview</Link>,
        },
        {
            key: "2",
            icon: <CarOutlined />,
            label: <Link to="manage-car">Manage Cars</Link>,
        },
        {
            key: "3",
            icon: <BookOutlined />,
            label: <Link to="manage-booking">Manage Bookings</Link>,
        },
        {
            key: "4",
            icon: <MoneyCollectOutlined />,
            label: <Link to="manage-return-car">Return & Payments</Link>,
        },
        {
            key: "5",
            icon: <TeamOutlined />,
            label: <Link to="user-management">User Management</Link>,
        },
        {
            key: "6",
            icon: <PieChartOutlined />,
            label: <Link to="reports">Reports & Analytics</Link>,
        },
        {
            key: "7",
            icon: <SettingOutlined />,
            label: <Link to="settings">Settings</Link>,
        },
        {
            type: 'divider',
            key: 'divider-1',
        },
        {
            key: "8",
            icon: <FileTextOutlined />,
            label: <Link to="documentation">Documentation</Link>,
        },
    ];

    const userMenuItems: MenuProps['items'] = [
        {
            key: '0',
            label: (
                <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-[#4335A7]/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <Avatar
                            size={48}
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=${encodeURIComponent('#D2691E')}&color=fff&size=128&bold=true`}
                            className="border-3 border-[#D2691E]/30 shadow-md"
                        />
                        <div>
                            <div className="text-base font-bold text-gray-900">{user?.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <SafetyOutlined className="text-green-500" />
                                <span className="capitalize font-medium">{user?.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            disabled: true,
        },
        {
            type: 'divider',
            key: 'divider-1',
        },
        {
            key: '1',
            icon: <DashboardOutlined className="text-lg" />,
            label: <Link to="/admin-dashboard" className="text-base font-medium">Admin Dashboard</Link>,
            className: "py-3",
        },
        {
            key: '2',
            icon: <HomeOutlined className="text-lg" />,
            label: <Link to="/" className="text-base font-medium">Return to Home</Link>,
            className: "py-3",
        },
        {
            key: '3',
            icon: <SettingOutlined className="text-lg" />,
            label: <Link to="/admin-dashboard/settings" className="text-base font-medium">Account Settings</Link>,
            className: "py-3",
        },
        {
            type: 'divider',
            key: 'divider-2',
        },
        {
            key: '4',
            icon: <LogoutOutlined className="text-lg" />,
            label: (
                <button onClick={handleLogout} className="w-full text-left text-base font-medium text-red-500">
                    Logout
                </button>
            ),
            className: "py-3",
        },
    ];

    return (
        <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar with fixed logo */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={280}
                collapsedWidth={80}
                className="shadow-2xl admin-sidebar"
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
                <div className="flex flex-col h-full">
                    {/* Fixed Logo Section */}
                    <div className="h-28 flex-shrink-0 border-b border-white/15 bg-gradient-to-r from-[#4335A7] to-[#3a2c95]">
                        <div className="flex items-center justify-center h-full px-4">
                            {!collapsed ? (
                                <div className="flex items-center gap-4 w-full">
                                    <div className="bg-white/10 p-3 rounded-2xl border border-white/20 shadow-lg">
                                        <img
                                            src={logo}
                                            className="h-12 object-contain"
                                            alt="logo"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Title level={3} className="!m-0 !text-white !font-bold tracking-tight">
                                            Car Rental
                                        </Title>
                                        <Text className="text-white/80 text-sm font-medium">
                                            Admin Panel
                                        </Text>
                                    </div>
                                </div>
                            ) : (
                                <Tooltip title="Car Rental Admin" placement="right">
                                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20 shadow-lg">
                                        <img
                                            src={logo}
                                            className="h-10 object-contain"
                                            alt="logo"
                                        />
                                    </div>
                                </Tooltip>
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
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                }}
                            />
                        </div>
                    </div>

                    {/* Fixed User Info Section at Bottom */}
                    {!collapsed && (
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
            </Sider>

            {/* Main Content Area */}
            <Layout className={`transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[280px]'}`}
                style={{ minHeight: '100vh' }}>
                {/* Header */}
                <Header
                    className="sticky top-0 z-50 h-24 px-8 shadow-lg bg-gradient-to-r from-white to-gray-50 border-b border-gray-200/80"
                    style={{
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.98)'
                    }}
                >
                    <div className="flex items-center justify-between h-full">
                        {/* Left Side */}
                        <div className="flex items-center gap-6">
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

                            <div className="relative">
                                <Search
                                    placeholder="Search cars, bookings, users..."
                                    allowClear
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-80 lg:w-96 hidden lg:block"
                                    size="large"
                                    prefix={<SearchOutlined className="text-gray-500 text-lg" />}
                                    style={{
                                        borderRadius: '12px',
                                        fontSize: '16px',
                                        height: '48px'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-5">
                            {/* Quick Stats */}
                            <div className="hidden lg:flex items-center gap-6">
                                <div className="text-center px-4">
                                    <div className="text-lg font-bold text-[#4335A7]">24</div>
                                    <div className="text-xs text-gray-500 font-medium">Active Bookings</div>
                                </div>
                                <div className="text-center px-4">
                                    <div className="text-lg font-bold text-[#D2691E]">12</div>
                                    <div className="text-xs text-gray-500 font-medium">Cars Available</div>
                                </div>
                            </div>

                            {/* Notifications - Using Custom Notification Dropdown */}
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
                                    overlayStyle={{
                                        width: '400px',
                                        maxHeight: '500px',
                                        overflow: 'hidden',
                                    }}
                                    onOpenChange={(open) => {
                                        if (!open) {
                                            setShowAllNotifications(false);
                                            refetch(); // Refresh notifications when dropdown closes
                                        }
                                    }}
                                >
                                    <Button
                                        type="text"
                                        className="relative"
                                    >
                                        <Badge
                                            count={unreadCount}
                                            offset={[1, -2]}
                                            overflowCount={99}
                                            style={{
                                                backgroundColor: unreadCount > 0 ? '#ff4d4f' : '#d9d9d9',
                                                boxShadow: '0 0 0 2px #fff'
                                            }}
                                        >
                                            <div className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                                <BellOutlined style={{ fontSize: "24px" }} className="text-bold text-gray-600 hover:text-[#4335A7]" />
                                            </div>
                                        </Badge>
                                    </Button>
                                </Dropdown>
                            </div>

                            {/* Divider */}
                            <div className="h-8 w-px bg-gray-300"></div>

                            {/* User Dropdown */}
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                trigger={["click"]}
                                placement="bottomRight"
                                overlayClassName="w-64"
                            >
                                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50/80 px-4 py-2 rounded-xl transition-all duration-300 group">
                                    {/* Text */}
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
                                    <Avatar
                                        size={40}
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
                <Content className="mt-6">
                    <div
                        className="min-h-[calc(100vh-220px)] bg-white overflow-y-auto"
                        style={{
                            background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
                            margin: '0 24px 24px',
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
                    height: 50px !important;
                    line-height: 50px !important;
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
                
                /* Notification dropdown custom styling */
                .ant-dropdown-menu.notification-dropdown {
                    padding: 0 !important;
                    border-radius: 12px !important;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
                    overflow: hidden;
                }
                
                .ant-dropdown-menu-item.notification-item:hover {
                    background-color: transparent !important;
                }
                
                /* Scrollbar for notification dropdown */
                .ant-dropdown-menu::-webkit-scrollbar {
                    width: 6px;
                }
                
                .ant-dropdown-menu::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                
                .ant-dropdown-menu::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                
                .ant-dropdown-menu::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a1;
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
            `}</style>
        </Layout>
    );
};

export default AdminDashboard;