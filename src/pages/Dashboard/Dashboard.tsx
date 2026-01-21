import React, { useState, useEffect } from "react";
import {
    BookOutlined,
    DashboardOutlined,
    LogoutOutlined,
    UserOutlined,
    CarOutlined,
    CreditCardOutlined,
    HomeOutlined,
    RightOutlined,
    LeftOutlined,
    SafetyOutlined,
    NotificationFilled,
    MenuOutlined,
    CloseOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Dropdown,
    Layout,
    Menu,
    Spin,
    Tag,
    Drawer,
    Input,
    Grid
} from "antd";
import { useLocation } from "react-router-dom";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/feature/auth/authSlice";
import logo from "@/assets/car_lgo.png";
import { useGetNotificationsQuery } from "@/redux/feature/notification/notificationApi";
import NotificationDropdown from "./components/NotificationDropdown";
import { useGetUserQuery } from "@/redux/feature/auth/authApi";

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { useBreakpoint } = Grid;

const Dashboard: React.FC = () => {
    const {
        data: user,
        isLoading,
    } = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const screens = useBreakpoint();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(!screens.md); // Collapse by default on mobile
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);
    const location = useLocation();

    const { data: notifications = [] } = useGetNotificationsQuery(undefined);

    const isMobile = !screens.md;
    const isTablet = screens.md && !screens.lg;

    const getSelectedKey = () => {
        const path = location.pathname;

        if (path.startsWith("/dashboard/booking")) return ["booking"];
        if (path.startsWith("/dashboard/notifications")) return ["notifications"];
        if (path.startsWith("/dashboard/payment")) return ["payment"];
        if (path.startsWith("/dashboard/cars")) return ["cars"];
        if (path.startsWith("/dashboard/profile")) return ["profile"];

        return ["dashboard"];
    };

    useEffect(() => {
        // Handle sidebar collapse based on screen size
        if (isMobile) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [isMobile]);

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
            label: <Link to="/dashboard" onClick={() => isMobile && setMobileMenuVisible(false)}>Dashboard</Link>,
        },
        {
            key: "booking",
            icon: <BookOutlined />,
            label: <Link to="/dashboard/booking" onClick={() => isMobile && setMobileMenuVisible(false)}>My Bookings</Link>,
        },
        {
            key: "notifications",
            icon: <NotificationFilled />,
            label: <Link to="/dashboard/notifications" onClick={() => isMobile && setMobileMenuVisible(false)}>Notifications</Link>,
        },
        {
            key: "payment",
            icon: <CreditCardOutlined />,
            label: <Link to="/dashboard/payment" onClick={() => isMobile && setMobileMenuVisible(false)}>Payments</Link>,
        },
        {
            key: "cars",
            icon: <CarOutlined />,
            label: <Link to="/dashboard/cars" onClick={() => isMobile && setMobileMenuVisible(false)}>Cars</Link>,
        },
        {
            key: "profile",
            icon: <UserOutlined />,
            label: <Link to="/dashboard/profile" onClick={() => isMobile && setMobileMenuVisible(false)}>Profile</Link>,
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

        },
        {
            icon: <HomeOutlined className="text-lg" />,
            label: (
                <Link to="/" className="text-base font-medium">
                    Home
                </Link>
            ),
            key: "2",

        },
        {
            icon: <UserOutlined className="text-lg" />,
            label: (
                <Link to="/dashboard/profile" className="text-base font-medium">
                    Profile
                </Link>
            ),
            key: "3",

        },
        {
            icon: <LogoutOutlined className="text-lg" />,
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

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-4 md:p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img
                            src={logo}
                            className={`transition-all duration-300 ${collapsed && !isMobile ? 'h-10 w-10' : 'h-12 w-auto'}`}
                            alt="Car Rental Logo"
                        />
                        {(!collapsed || isMobile) && (
                            <div className="ml-3">
                                <h1 className="text-xl font-bold text-white m-0">Car Rental</h1>
                                <p className="text-xs text-white/80 m-0">User Dashboard</p>
                            </div>
                        )}
                    </div>
                    {isMobile && (
                        <Button
                            type="text"
                            icon={<CloseOutlined className="text-white" />}
                            onClick={() => setMobileMenuVisible(false)}
                        />
                    )}
                </div>
            </div>

            {/* Navigation Menu with Custom Styling */}
            <div className="flex-1 overflow-y-auto py-4">
                <Menu
                    mode="inline"
                    selectedKeys={getSelectedKey()}
                    items={menuItems}
                    className="sidebar-menu border-none bg-transparent px-2 md:px-3"
                    theme="dark"
                />

            </div>

            {/* Bottom Section */}
            {(!collapsed || isMobile) && user?.data && (
                <div className="p-4 border-b border-white/20">
                    <div className="flex items-center p-3 bg-white/10 rounded-lg">
                        <Avatar
                            size="large"
                            icon={<UserOutlined />}
                            className="bg-white/20 text-white"
                            src={user?.data?.image || undefined}
                        />
                        <div className="ml-3 flex-1 min-w-0">
                            <p className="font-semibold text-white m-0 truncate">{user?.data?.name}</p>
                            <p className="text-xs text-white/80 m-0 truncate">{user?.data?.email}</p>
                            <Tag color="blue" className="text-xs mt-1">
                                Member
                            </Tag>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Layout className="min-h-screen bg-[#4335A7]">
            {/* Desktop Sidebar */}
            {!isMobile && (
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
                    {/* Floating Collapse Button - Desktop */}
                    <Button
                        type="text"
                        icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="absolute -right-3 top-6 z-50 bg-white border border-gray-300 shadow-md hover:shadow-lg w-6 h-10 flex items-center justify-center rounded-r-lg"
                        style={{ zIndex: 101 }}
                    />
                    {sidebarContent}
                </Sider>
            )}

            {/* Mobile Drawer */}
            <Drawer
                title={null}
                placement="left"
                closable={false}
                onClose={() => setMobileMenuVisible(false)}
                open={mobileMenuVisible}
                width={280}

                className="md:hidden"
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
                <Header
                    className="flex justify-between items-center px-4 md:px-6 bg-white shadow-sm"
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 50,
                        height: isMobile ? '70px' : '80px',
                    }}
                >
                    <div className="flex items-center gap-3 md:gap-4">
                        {isMobile && (
                            <Button
                                type="text"
                                icon={<MenuOutlined className="text-xl" />}
                                onClick={() => setMobileMenuVisible(true)}
                                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100"
                            />
                        )}

                        <div className="flex items-center gap-2">
                            {searchVisible ? (
                                <div className="flex items-center gap-2 w-full">
                                    <Search
                                        placeholder="Search..."
                                        allowClear
                                        size="middle"
                                        prefix={<SearchOutlined className="text-gray-500" />}
                                        autoFocus
                                        onBlur={() => setSearchVisible(false)}
                                        style={{
                                            borderRadius: '8px',
                                            width: isMobile ? '180px' : '250px',
                                        }}
                                    />
                                    <Button
                                        type="text"
                                        icon={<CloseOutlined />}
                                        onClick={() => setSearchVisible(false)}
                                        size="small"
                                    />
                                </div>
                            ) : (
                                <>
                                    {isMobile ? (
                                        <Button
                                            type="text"
                                            icon={<SearchOutlined className="text-lg" />}
                                            onClick={() => setSearchVisible(true)}
                                        />
                                    ) : (
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 m-0">
                                            Dashboard
                                        </h1>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <NotificationDropdown />

                        <Dropdown
                            menu={{ items: dropdownItems }}
                            placement="bottomRight"
                            trigger={['click']}
                            overlayClassName="custom-dropdown w-64"
                        >
                            <Button
                                type="text"
                                className="flex items-center gap-2 md:gap-3 hover:bg-gray-100 px-2 md:px-3 py-2 rounded-lg"
                            >
                                {!isMobile && (
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-medium text-gray-800 m-0 truncate max-w-[120px]">
                                            {user?.data?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 m-0">
                                            Premium Member
                                        </p>
                                    </div>
                                )}
                                <Avatar
                                    size={isMobile ? 32 : 40}
                                    icon={<UserOutlined />}
                                    className="bg-[#4335A7] text-white border-2 border-[#4335A7]/20"
                                    src={user?.data?.image || undefined}
                                />
                            </Button>
                        </Dropdown>
                    </div>
                </Header>

                <Content className="p-3 md:p-6">
                    {/* Outlet for nested routes */}
                    <div className="min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-160px)] rounded-lg shadow-sm">
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
                    font-size: 14px;
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
                
                /* Mobile optimizations */
                @media (max-width: 768px) {
                    .ant-layout-header {
                        padding: 0 16px !important;
                    }
                    
                    .sidebar-menu.ant-menu-dark .ant-menu-item,
                    .sidebar-menu.ant-menu-dark .ant-menu-submenu-title {
                        height: 44px;
                        line-height: 44px;
                        font-size: 13px;
                    }
                    
                    .ant-menu-item-icon,
                    .anticon {
                        font-size: 16px !important;
                    }
                }
                
                /* Tablet optimizations */
                @media (min-width: 768px) and (max-width: 1024px) {
                    .ant-layout-header {
                        padding: 0 20px !important;
                    }
                    
                    h1 {
                        font-size: 1.5rem !important;
                    }
                }
                
                /* Mobile drawer styles */
                .ant-drawer-body {
                    padding: 0 !important;
                    background: linear-gradient(180deg, #4335A7 0%, #2D1B69 100%);
                }
                
                /* Content area responsive padding */
                @media (max-width: 768px) {
                    .ant-layout-content {
                        padding: 12px !important;
                    }
                }

                .custom-dropdown .ant-dropdown-menu-item {
                    padding: 8px 16px !important;
                    height: auto !important;
                    line-height: 1.5 !important;
                }

                /* Keep padding for disabled items (headers) so px/py classes apply */
                .custom-dropdown .ant-dropdown-menu-item-disabled {
                    padding: 12px 16px !important;
                }

                /* Allow buttons inside dropdown items to inherit their parent padding */
                .custom-dropdown .ant-dropdown-menu-item button {
                    width: 100% !important;
                    text-align: left !important;
                    background: none !important;
                    border: none !important;
                    padding: inherit !important;
                    cursor: pointer !important;
                    font-size: 16px !important;
                    font-weight: 500 !important;
                    color: inherit !important;
                }
            `}</style>
        </Layout>
    );
};

export default Dashboard;