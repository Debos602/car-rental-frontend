import React, { useState } from "react";
import {
    BookOutlined,
    DashboardOutlined,
    LogoutOutlined,
    UserOutlined,
    CarOutlined,
    HistoryOutlined,
    CreditCardOutlined,
    HomeOutlined,
    RightOutlined,
    LeftOutlined,
    SafetyOutlined,
    NotificationFilled
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Dropdown,
    Layout,
    Menu,
    Tag
} from "antd";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/feature/authSlice";
import logo from "@/assets/car_lgo.png";
import { useGetNotificationsQuery } from "@/redux/feature/notification/notificationApi";
import NotificationDropdown from "./components/NotificationDropdown";
import { useGetUserQuery } from "@/redux/feature/authApi";

const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
    const {
        data: user,
        isLoading,

    } = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    console.log("Current User:", user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const { data: notifications = [] } = useGetNotificationsQuery(undefined);



    console.log("Notifications:", notifications);

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(logout());
        navigate("/login");
    };

    // User-specific menu items with white text
    const menuItems = [
        {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
            key: "booking",
            icon: <BookOutlined />,
            label: <Link to="/dashboard/booking">My Bookings</Link>,
        },
        {
            key: "notifications",
            icon: <NotificationFilled />,
            label: <Link to="/dashboard/notifications">Notifications</Link>,
        },
        {
            key: "payment",
            icon: <CreditCardOutlined />,
            label: <Link to="/dashboard/payment">Payments</Link>,
        },
        {
            key: "cars",
            icon: <CarOutlined />,
            label: <Link to="/dashboard/cars">Cars</Link>,
        },
        {
            key: "profile",
            icon: <UserOutlined />,
            label: <Link to="/dashboard/profile">Profile</Link>,
        },
    ];

    const dropdownItems = [
        {
            key: '0',
            label: (
                <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-[#4335A7]/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <Avatar
                            size={48}
                            src={
                                user?.data?.image ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.data?.name || '')}&background=${encodeURIComponent('#D2691E')}&color=fff&size=128&bold=true`
                            }
                            className="border-3 border-[#D2691E]/30 shadow-md"
                        />
                        <div>
                            <div className="text-base font-bold text-gray-900">{user?.data?.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <SafetyOutlined className="text-green-500" />
                                <span className="capitalize font-medium">{user?.data?.role}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            disabled: true,
        },
        {
            key: "1",
            icon: <DashboardOutlined className="text-lg" />,
            label: (
                <Link to="/dashboard" className="text-base font-medium">
                    Dashboard
                </Link>
            ),
            className: "py-3",
        },
        {
            icon: <HomeOutlined className="text-lg" />,
            label: (
                <Link to="/" className="text-base font-medium">
                    Home
                </Link>
            ),
            key: "2",
            className: "py-3"
        },
        {
            icon: <UserOutlined className="text-lg" />,
            label: (
                <Link to="/dashboard/profile" className="text-base font-medium">
                    Profile
                </Link>
            ),
            key: "3",
            className: "py-3"
        },
        {
            icon: <LogoutOutlined className="text-lg" />,
            className: "py-3",
            label: (
                <div
                    onClick={handleLogout}
                    className="w-full text-left text-base font-medium text-red-500"
                >
                    Logout
                </div>
            ),
            key: "4",
        },
    ];

    if (isLoading) {
        return <div>Loading...</div>;
    }


    return (
        <Layout className="min-h-screen bg-[#4335A7]">
            {/* Sidebar with floating collapse button */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="relative"
                width={280}
                collapsedWidth={80}
                style={{
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100,
                    borderRight: '1px solid #e5e7eb',
                    background: 'linear-gradient(180deg, #4335A7 0%, #2D1B69 100%)',
                }}
            >
                {/* Floating Collapse Button */}
                <Button
                    type="text"
                    icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-6 z-50 bg-white border border-gray-300 shadow-md hover:shadow-lg w-6 h-10 flex items-center justify-center rounded-r-lg"
                    style={{ zIndex: 101 }}
                />

                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-white/20">
                        <div className="flex items-center justify-center">
                            <img
                                src={logo}
                                className={`transition-all duration-300 ${collapsed ? 'h-10 w-10' : 'h-12 w-auto'}`}
                                alt="Car Rental Logo"
                            />
                            {!collapsed && (
                                <div className="ml-3">
                                    <h1 className="text-xl font-bold text-white m-0">Car Rental</h1>
                                    <p className="text-xs text-white/80 m-0">User Dashboard</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Menu with Custom Styling */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={["dashboard"]}
                            items={menuItems}
                            className="sidebar-menu border-none bg-transparent px-3"
                            theme="dark"
                        />
                    </div>

                    {/* Bottom Section */}
                    {!collapsed && user?.data && (
                        <div className="p-4 border-b border-white/20">
                            <div className="flex items-center p-3 bg-white/10 rounded-lg">
                                <Avatar
                                    size="large"
                                    icon={<UserOutlined />}
                                    className="bg-white/20 text-white"
                                    src={user?.data?.image || undefined}
                                />
                                <div className="ml-3">
                                    <p className="font-semibold text-white m-0">{user?.data?.name}</p>
                                    <p className="text-xs text-white/80 m-0">{user?.data?.email}</p>
                                    <Tag color="blue" className="text-xs mt-1">
                                        Member
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Sider>

            {/* Main Content Area */}
            <Layout
                className={`transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[280px]'}`}
                style={{ minHeight: '100vh' }}
            >
                <Header
                    className="flex justify-between items-center px-6 bg-white shadow-sm"
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 50,
                        height: '80px',
                    }}
                >
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 m-0">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationDropdown />

                        <Dropdown
                            menu={{ items: dropdownItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                type="text"
                                className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg"
                            >
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-medium text-gray-800 m-0">
                                        {user?.data?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 m-0">
                                        Premium Member
                                    </p>
                                </div>
                                <Avatar
                                    size="default"
                                    icon={<UserOutlined />}
                                    className="bg-[#4335A7] text-white"
                                    src={user?.data?.image || undefined}
                                />
                            </Button>
                        </Dropdown>
                    </div>
                </Header>

                <Content>
                    {/* Outlet for nested routes */}
                    <div>
                        <Outlet />
                    </div>
                </Content>
            </Layout>

            {/* Add custom CSS for menu styling */}
            <style>{`
                /* Custom sidebar menu styling */
                .sidebar-menu.ant-menu-dark {
                    background: transparent;
                }
                
                .sidebar-menu.ant-menu-dark .ant-menu-item,
                .sidebar-menu.ant-menu-dark .ant-menu-submenu-title {
                    color: white !important;
                    font-weight: 500;
                    height: 48px;
                    line-height: 48px;
                    margin: 4px 0;
                    border-radius: 8px;
                    padding: 0 12px !important;
                }
                
                .sidebar-menu.ant-menu-dark .ant-menu-item:hover,
                .sidebar-menu.ant-menu-dark .ant-menu-submenu-title:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                }
                
                .sidebar-menu.ant-menu-dark .ant-menu-item-selected {
                    background: rgba(255, 255, 255, 0.3) !important;
                    color: white !important;
                }
                
                .sidebar-menu.ant-menu-dark .ant-menu-item .ant-menu-item-icon,
                .sidebar-menu.ant-menu-dark .ant-menu-submenu-title .ant-menu-item-icon,
                .sidebar-menu.ant-menu-dark .ant-menu-item .anticon,
                .sidebar-menu.ant-menu-dark .ant-menu-submenu-title .anticon {
                    color: white !important;
                    font-size: 18px;
                }
                
                .sidebar-menu.ant-menu-dark .ant-menu-item:hover .ant-menu-item-icon,
                .sidebar-menu.ant-menu-dark .ant-menu-submenu-title:hover .ant-menu-item-icon,
                .sidebar-menu.ant-menu-dark .ant-menu-item:hover .anticon,
                .sidebar-menu.ant-menu-dark .ant-menu-submenu-title:hover .anticon {
                    color: white !important;
                }
                
                .sidebar-menu.ant-menu-dark .ant-menu-item-selected .ant-menu-item-icon,
                .sidebar-menu.ant-menu-dark .ant-menu-item-selected .anticon {
                    color: white !important;
                }
                
                .sidebar-menu.ant-menu-dark .ant-menu-item a,
                .sidebar-menu.ant-menu-dark .ant-menu-submenu-title a {
                    color: white !important;
                }
                
                .sidebar-menu.ant-menu-dark .ant-menu-item:hover a,
                .sidebar-menu.ant-menu-dark .ant-menu-submenu-title:hover a {
                    color: white !important;
                }
                
                .sidebar-menu.ant-menu-dark .ant-menu-item-selected a {
                    color: white !important;
                }
                
                /* For collapsed state */
                .sidebar-menu.ant-menu-inline-collapsed .ant-menu-item,
                .sidebar-menu.ant-menu-inline-collapsed .ant-menu-submenu-title {
                    padding: 0 24px !important;
                }
            `}</style>
        </Layout>
    );
};

export default Dashboard;