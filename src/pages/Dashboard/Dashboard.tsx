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
import { Avatar, Button, Dropdown, Layout, Menu, Space } from "antd";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/feature/authSlice";
import logo from "@/assets/car_lgo.png";
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
                className="min-h-screen bg-[#FFF6E9]"
            >
                <div className="sticky top-0 z-30 h-24 bg-[#FFF6E9] p-2">
                    <img
                        src={logo}
                        className="h-24 max-h-full  object-cover "
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
                <Header className="flex justify-between items-center bg-[#FFF6E9]  h-24 ">
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
                        className="text-[#4335A7]"

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
                                            className="text-[#4335A7]"
                                        />
                                        <p className="text-md font-semibold uppercase m-0 text-[#4335A7]">
                                            {user?.name}
                                        </p>
                                    </Space>
                                </a>
                            </Dropdown>

                        </div>
                    ) : null}
                </Header>
                <Content
                >
                    <Outlet /> {/* This renders the current route's content */}
                </Content>
            </Layout>
        </Layout>
    );
};

export default Dashboard;
