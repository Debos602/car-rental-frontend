import React, { useState } from "react";
import {
    BookOutlined,
    DashboardOutlined,
    // DownOutlined,
    FundOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoneyCollectOutlined,
    RollbackOutlined,
    UserOutlined,
    UserSwitchOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space, theme } from "antd";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/feature/authSlice";
import logo from "@/assets/car-lgo.png";
import { RootState } from "@/redux/store";
import { TUser } from "@/types/global";

const { Header, Sider, Content } = Layout;

const AdminDashboard: React.FC = () => {
    const user = useAppSelector(
        (state: RootState) => state.auth.user as TUser | null
    );
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(logout());
        navigate("/login");
    };

    const menuItems = [
        {
            key: "1",
            icon: <UserOutlined className="font-extrabold text-[#4335A7]" />,
            label: <Link className="font-extrabold" to="dashboard-overview">Dashboard Overview</Link>,
        },
        {
            key: "2",
            icon: <BookOutlined className="font-extrabold text-[#4335A7]" />,
            label: <Link className="font-extrabold" to="manage-car">Manage car</Link>,
        },
        {
            key: "3",
            icon: <MoneyCollectOutlined className="font-extrabold text-[#4335A7]" />,
            label: <Link className="font-extrabold" to="manage-booking">Manage booking</Link>,
        },
        {
            key: "4",
            icon: <FundOutlined className="font-extrabold text-[#4335A7]" />,
            label: <Link className="font-extrabold" to="manage-return-car">Manage return car</Link>,
        },
        {
            key: "5",
            icon: <UserSwitchOutlined className="font-extrabold text-[#4335A7]" />,
            label: <Link className="font-extrabold" to="user-management">User Management</Link>,
        },
    ];

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ backgroundColor: "var(--bg-color)" }}
                className="min-h-screen bg-gradient-to-r from-[#4335A7] to-[#6A4BAA]"
            >
                <div className="sticky top-0 z-30">
                    <img
                        src={logo}
                        className="h-24 w-full object-cover"
                        alt="logo"
                    />
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={menuItems}
                    className="sticky top-24 z-30 text-[#FFF6E9] h-[500px]"
                />
            </Sider>
            <Layout>
                <Header className="flex justify-between items-center bg-gradient-to-b from-[#4335A7] to-[#FFF6E9] h-24 sticky top-0 z-30 border-b-2 border-[#4335A7]">
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: "16px", width: 64, height: 64 }}
                        className="text-[#FFF6E9] hover:text-[#4335A7] transition-all duration-300"
                    />
                    {user?.role === "admin" || user?.role === "user" ? (
                        <div>
                            <Dropdown
                                trigger={["click"]}
                                menu={{
                                    items: [
                                        {
                                            label: (
                                                <Link to="/admin-dashboard" className="text-[#4335A7]">
                                                    <DashboardOutlined className="pr-2 text-[#4335A7] py-2 font-bold" />{" "}
                                                    Admin Dashboard
                                                </Link>
                                            ),
                                            key: "1",
                                        },
                                        {
                                            label: (
                                                <Link to="/" className="text-[#4335A7]">
                                                    <RollbackOutlined className="pr-2 text-[#4335A7] py-2 font-bold" />
                                                    Return Home
                                                </Link>
                                            ),
                                            key: "2",
                                        },
                                        {
                                            label: (
                                                <Link
                                                    className="text-[#4335A7]"
                                                    onClick={handleLogout}
                                                    to="/login"
                                                >
                                                    <LogoutOutlined className="pr-2 text-[#4335A7] py-2 font-bold" />
                                                    Logout
                                                </Link>
                                            ),
                                            key: "3",
                                        },
                                    ],
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space className="flex items-center justify-between">
                                        <Avatar
                                            size="large"
                                            icon={<UserOutlined />}
                                        />
                                        <p className="text-lg font-bold uppercase m-0 text-[#FFF6E9]">
                                            {user?.name}
                                        </p>
                                    </Space>
                                </a>
                            </Dropdown>

                        </div>
                    ) : null}
                </Header>
                <Content
                    style={{
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;
