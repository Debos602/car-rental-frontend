import React, { useState } from "react";
import {
    BookOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoneyCollectOutlined,
    RollbackOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Space, theme } from "antd";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/feature/authSlice";
import logo from "@/assets/car-lgo.png";
import { RootState } from "@/redux/store";
import { TUser } from "@/types/global";

const { Header, Sider, Content } = Layout;

const Dashboard: React.FC = () => {
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
            icon: <UserOutlined className="font-bold" />,
            label: <Link className="font-bold" to="/dashboard/profile">Profile</Link>,
        },
        {
            key: "2",
            icon: <BookOutlined className="font-bold" />,
            label: <Link className="font-bold" to="/dashboard/booking">Booking Management</Link>,
        },
        {
            key: "3",
            icon: <MoneyCollectOutlined className="font-bold" />,
            label: <Link className="font-bold" to="/dashboard/payment">Payment Management</Link>,
        },
    ];

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ backgroundColor: "var(--bg-color)" }}
            >
                <div className="sticky top-0 z-30">
                    <img
                        src={logo}
                        className="h-24 w-full object-cover "
                        alt="logo"
                    />
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={menuItems}
                    className="sticky top-24 z-30 bg-[#FFF6E9] h-[500px]"
                />
            </Sider>
            <Layout>
                <Header className="flex justify-between items-center bg-gradient-to-b from-[#4335A7] to-[#FFF6E9] text-[#FFF6E9] h-24 sticky top-0  z-10 ">
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
                        className="text-[#FFF6E9]"
                        style={{ fontSize: "16px", width: 64, height: 64 }}
                    />
                    {user?.role === "admin" || user?.role === "user" ? (
                        <div className="flex items-center justify-center">
                            <Dropdown
                                trigger={["click"]}
                                menu={{
                                    items: [
                                        {
                                            label: (
                                                <Link to="/dashboard">
                                                    <DashboardOutlined className="pr-2 py-2" />
                                                    Dashboard
                                                </Link>
                                            ),
                                            key: "1",
                                        },
                                        {
                                            label: (
                                                <Link to="/">
                                                    <RollbackOutlined className="pr-2  py-2" />
                                                    Home page
                                                </Link>
                                            ),
                                            key: "2",
                                        },
                                        {
                                            label: (
                                                <Link
                                                    onClick={handleLogout}
                                                    to="/login"
                                                >
                                                    <LogoutOutlined className="pr-2  py-2" />
                                                    Logout
                                                </Link>
                                            ),
                                            key: "3",
                                        },
                                    ],
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space className="flex justify-center items-center">
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
                    <Outlet /> {/* This renders the current route's content */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
