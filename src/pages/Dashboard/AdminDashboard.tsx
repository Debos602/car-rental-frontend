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
import { Avatar, Button, Dropdown, Layout, Menu, Space } from "antd";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/feature/authSlice";
import logo from "@/assets/car_lgo.png";
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


    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(logout());
        navigate("/login");
    };

    const menuItems = [
        {
            key: "1",
            icon: <UserOutlined className="font-extrabold text-[#4335A7]" />,
            label: <Link className="font-extrabold" to="dashboard-overview">Dashboard</Link>,
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
                className="min-h-screen"
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
                    className="sticky top-24 z-30 h-[505px]"
                />
            </Sider>
            <Layout>
                <Header className="flex justify-between items-center sticky top-0 z-30  h-24 border-b-2 bg-[#FFF6E9] mb-4">
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
                        className="text-[#4335A7]  transition-all duration-300"
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
                                            className="text-[#4335A7]"
                                        />
                                        <p className="text-lg font-bold uppercase m-0 text-[#4335A7]">
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
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;
