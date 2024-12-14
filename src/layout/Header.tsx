import Buttons from "@/components/Buttons";
import { navPaths } from "@/routes/navRoutes";
import {
    CloseCircleOutlined,
    DashboardOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    LoginOutlined,
    LogoutOutlined,
    MailOutlined,

    TwitterOutlined,
    UserSwitchOutlined,
    YoutubeOutlined,

} from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import logo from '../assets/car_lgo.png';
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/feature/authSlice";
import { clearBookings } from "@/redux/feature/booking/bookingSlice";
import { useEffect, useState } from "react";
import { TUser } from "@/types/global";
import { FaBars } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { MdRoundaboutRight } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";
import { IoMdAppstore } from "react-icons/io";
import { MdContactPhone } from "react-icons/md";




const Header = () => {
    const user = useAppSelector((state) => state.auth.user) as TUser | null;
    console.log(user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);


    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(logout());
        dispatch(clearBookings());
        navigate("/login");
    };

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {

        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Apply theme to the document



    const navItems = navPaths.map((navItem, index) => ({
        key: index,
        label: (
            <Link to={navItem.path} className="uppercase">
                {navItem.name}
            </Link>
        ),
    }));

    const userMenuItems = [
        {
            key: "Home",
            label: (
                <Link to="/">
                    <span className="flex items-center md:hidden py-2">
                        <IoIosHome className="text-xl" />
                        <span className="pl-2">Home</span>
                    </span>
                </Link>
            ),
        },

        {
            key: "Carlist",
            label: (
                <Link to="/cars">
                    <span className="flex items-center md:hidden py-2">
                        <FaCarSide className="text-xl" />
                        <span className="pl-2">Carlist</span>
                    </span>
                </Link>
            ),
        },
        {
            key: "About",
            label: (
                <Link to="/about">
                    <span className="flex items-center md:hidden py-2">
                        <MdRoundaboutRight className="text-xl" />
                        <span className="pl-2">About</span>
                    </span>
                </Link>
            ),
        },
        {
            key: "Booking",
            label: (
                <Link to="/bookings">
                    <span className="flex items-center md:hidden py-2">
                        <IoMdAppstore className="text-xl" />
                        <span className="pl-2">Booking</span>
                    </span>
                </Link>
            ),
        },
        {
            key: "Contact",
            label: (
                <Link to="/contact">
                    <span className="flex items-center md:hidden py-2">
                        <MdContactPhone className="text-xl" />
                        <span className="pl-2">Contact</span>
                    </span>
                </Link>
            ),
        },
    ];

    // Add user-specific menu items dynamically
    if (user?.role) {
        userMenuItems.push({
            key: "dashboard",
            label: (
                <Link
                    to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                    className="py-2 inline-block"
                >
                    <DashboardOutlined className="pr-2" />
                    {user.role === "admin" ? "Admin Dashboard" : "Dashboard"}
                </Link>
            ),
        });

        userMenuItems.push({
            key: "logout",
            label: (
                <Link onClick={handleLogout} to="/login" className="py-2 inline-block">
                    <LogoutOutlined className="pr-2" />
                    Logout
                </Link>
            ),
        });
    } else {
        userMenuItems.push({
            key: "login",
            label: (
                <Link to="/login" className="py-2 inline-block hover:text-[#FFF6E9]">
                    <LoginOutlined className="pr-2" />
                    Login
                </Link>
            ),
        });
    }


    return (
        <>
            <div className="bg-[#4335A7]">
                <div className="hidden  container mx-auto md:flex justify-between items-center py-1 ">
                    <div className="text-white opacity-80 text-xs">
                        <MailOutlined />
                        <span className="mx-2">Debos.das.02@gmail.com</span>
                        <EnvironmentOutlined className="ml-4" />
                        <span className="ml-2">Chittagong, Bangladesh</span>
                    </div>
                    <div className="flex items-center">
                        <FacebookOutlined className="mr-2 bg-amber-400 p-1 text-xs rounded-full" />
                        <YoutubeOutlined className="mr-2 bg-amber-400 p-1 text-xs rounded-full" />
                        <TwitterOutlined className="bg-amber-400 p-1 text-xs rounded-full" />
                    </div>
                </div>
            </div>

            <div className="bg-[#FFF6E9] border-b-2 border-[#4335A7] sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center py-2">
                    <div className="">
                        <Link to="/">
                            <img src={logo} className="max-h-full h-[60px] object-fill" alt="Logo" />
                        </Link>
                    </div>
                    <Menu
                        className="max-lg:hidden w-full justify-center items-center text-md font-bold text-[#4335A7] bg-[#FFF6E9] "
                        mode="horizontal"
                        items={navItems}
                    />
                    {user?.role === "admin" || user?.role === "user" ? (
                        <Dropdown trigger={["click"]} menu={{ items: userMenuItems }}>
                            <div className="cursor-pointer" onClick={(e) => e.preventDefault()}>
                                <Space className="flex items-center justify-between">

                                    <div className="flex flex-col items-start justify-center">
                                        <p className="text-[#4335A7]  md:font-bold m-0 inline-block">{user?.name}</p>
                                        <p className="m-0 font-medium text-xs text-[#4335A7]">{user?.email}</p>
                                    </div>
                                    <UserSwitchOutlined className="mr-2 p-4 text-xl bg-[#4335A7] rounded-full text-[#FFF6E9]" />
                                </Space>
                            </div >
                        </Dropdown>
                    ) : (
                        <div className="flex items-center">
                            <div className="max-lg:hidden ">
                                <Buttons to="/login">Login</Buttons>
                            </div>
                            <div
                                className="h-20 w-20 lg:hidden flex justify-end items-center"
                                onClick={() => setOpen(!open)}
                            >
                                {open ? (
                                    <CloseCircleOutlined className="text-3xl" />
                                ) : (
                                    <FaBars className="text-3xl" />
                                )}
                            </div>
                            {open && (
                                <Menu
                                    className="lg:hidden text-[#4335A7] w-full absolute right-0 top-[82px] md:top-[137px] border-2 bg-[#FFF6E9]"
                                    mode="vertical"
                                    items={userMenuItems}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ >
    );
};

export default Header;
