import Buttons from "@/components/Buttons";
import { navPaths } from "@/routes/navRoutes";
import {
    CloseCircleOutlined,
    EnvironmentOutlined,
    FacebookOutlined,
    MailOutlined,
    TwitterOutlined,
    LogoutOutlined,
    DashboardOutlined,
    UserOutlined,
    YoutubeOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import logo from '../assets/car_lgo.png';
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/feature/authSlice";
import { clearBookings } from "@/redux/feature/booking/bookingSlice";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { TUser } from "@/types/global";
import { FaBars } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { MdRoundaboutRight } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";
import { IoMdAppstore } from "react-icons/io";
import { MdContactPhone } from "react-icons/md";

const Header = () => {
    const user = useAppSelector((state) => state.auth.user) as TUser | null;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const headerRef = useRef<HTMLDivElement>(null);
    const topBarWrapperRef = useRef<HTMLDivElement>(null);
    const topBarRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(logout());
        dispatch(clearBookings());
        navigate("/login");
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
            const wrapper = topBarWrapperRef.current;
            const inner = topBarRef.current;
            if (wrapper && inner) {
                wrapper.style.height = scrolled ? '' : `${inner.offsetHeight}px`;
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [scrolled]);

    useLayoutEffect(() => {
        const wrapper = topBarWrapperRef.current;
        const inner = topBarRef.current;
        if (wrapper && inner) {
            wrapper.style.height = scrolled ? '' : `${inner.offsetHeight}px`;
        }
    }, [scrolled]);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, [scrolled]);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 20);

            const delta = currentY - lastScrollY.current;
            if (Math.abs(delta) < 10) {
                lastScrollY.current = currentY;
                return;
            }

            if (currentY > lastScrollY.current && currentY > 100) {
                setShowHeader(false);
            } else {
                setShowHeader(true);
            }

            lastScrollY.current = currentY;
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    let userMenuItems: any[] = [];

    if (isMobile) {
        userMenuItems = [
            {
                key: "Home",
                label: (
                    <Link to="/">
                        <span className="flex items-center py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 text-black">
                            <IoIosHome className="text-xl text-black" />
                            <span className="pl-2">Home</span>
                        </span>
                    </Link>
                ),
            },
            {
                key: "Carlist",
                label: (
                    <Link to="/cars">
                        <span className="flex items-center py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 text-black">
                            <FaCarSide className="text-xl text-black" />
                            <span className="pl-2">Carlist</span>
                        </span>
                    </Link>
                ),
            },
            {
                key: "About",
                label: (
                    <Link to="/about">
                        <span className="flex items-center py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 text-black">
                            <MdRoundaboutRight className="text-xl text-black" />
                            <span className="pl-2">About</span>
                        </span>
                    </Link>
                ),
            },
            {
                key: "Booking",
                label: (
                    <Link to="/bookings">
                        <span className="flex items-center py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 text-black">
                            <IoMdAppstore className="text-xl text-black" />
                            <span className="pl-2">Booking</span>
                        </span>
                    </Link>
                ),
            },
            {
                key: "Contact",
                label: (
                    <Link to="/contact">
                        <span className="flex items-center py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 text-black">
                            <MdContactPhone className="text-xl text-black" />
                            <span className="pl-2">Contact</span>
                        </span>
                    </Link>
                ),
            },
        ];
    }

    if (user?.role) {
        userMenuItems.push({
            key: "user-info",
            disabled: true,
            label: (
                <Space direction="vertical" size={0} className="py-2 px-4">
                    <span className="text-black font-bold">{user?.name}</span>
                    <span className="text-black text-sm opacity-80">{user?.email}</span>
                </Space>
            ),
        });
        userMenuItems.push({ key: "div1", type: "divider" });
        userMenuItems.push({
            key: "dashboard",
            label: (
                <Link
                    to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                    className="py-2 inline-block hover:text-amber-500 transition-colors duration-300"
                >
                    <span className="flex items-center gap-3">
                        <DashboardOutlined className="text-lg text-current" />
                        <span>{user.role === "admin" ? "Admin Dashboard" : "Dashboard"}</span>
                    </span>
                </Link>
            ),
        });
        userMenuItems.push({
            key: "logout",
            label: (
                <Link onClick={handleLogout} to="/login" className="py-2 inline-block hover:text-amber-500 transition-colors duration-300 logout-action">
                    <span className="flex items-center gap-3">
                        <LogoutOutlined className="text-lg text-current" />
                        <span>Logout</span>
                    </span>
                </Link>
            ),
        });
    } else {
        userMenuItems.push({
            key: "login",
            label: (
                <Link to="/login" className="py-2 inline-block hover:text-amber-500 transition-colors duration-300">
                    <span className="flex items-center gap-3">
                        <LogoutOutlined className="text-lg rotate-180 text-current" />
                        <span>Login</span>
                    </span>
                </Link>
            ),
        });
    }

    const navItems = navPaths.map((navItem, index) => ({
        key: index,
        label: (() => {
            const name = (navItem.name || "").toString().toLowerCase();
            const iconClass = "text-xl text-amber-600";
            let Icon: any = IoIosHome;
            if (name.includes("car") || name.includes("cars")) Icon = FaCarSide;
            else if (name.includes("about")) Icon = MdRoundaboutRight;
            else if (name.includes("book") || name.includes("booking")) Icon = IoMdAppstore;
            else if (name.includes("contact")) Icon = MdContactPhone;

            return (
                <Link to={navItem.path} className="uppercase hover:text-amber-500 transition-colors duration-300 flex items-center gap-2">
                    <Icon className={iconClass} />
                    <span>{navItem.name}</span>
                </Link>
            );
        })(),
    }));

    const mobileMenuItems = userMenuItems;

    return (
        <div ref={headerRef} className="sticky inset-x-0 top-0 z-50">
            <div className={`transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                {/* Top info bar - smooth collapse, no jump */}
                <div ref={topBarWrapperRef} className={`bg-black transition-all duration-300 ease-in-out`}>
                    <div ref={topBarRef} className="container mx-auto hidden md:flex justify-between items-center px-6 py-1">
                        <div className="text-white opacity-95 text-sm font-light tracking-wide flex items-center gap-4">
                            <MailOutlined className="mr-1" />
                            <span>Debos.das.02@gmail.com</span>
                            <EnvironmentOutlined className="ml-4 mr-1" />
                            <span>Chittagong, Bangladesh</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <FacebookOutlined className="bg-white p-1 text-base rounded-full text-black hover:bg-gray-200 transition-colors duration-300" />
                            <YoutubeOutlined className="bg-white p-1 text-base rounded-full text-black hover:bg-gray-200 transition-colors duration-300" />
                            <TwitterOutlined className="bg-white p-1 text-base rounded-full text-black hover:bg-gray-200 transition-colors duration-300" />
                        </div>
                    </div>
                </div>

                {/* Main header */}
                <div className="bg-white border-b-2 border-black shadow-md">
                    <div className="container mx-auto flex justify-between items-center py-2 px-6">
                        <div className="flex-shrink-0">
                            <Link to="/">
                                <img src={logo} className="h-14 object-contain hover:scale-105 transition-transform duration-300" alt="Logo" />
                            </Link>
                        </div>

                        <Menu
                            className="max-lg:hidden w-full justify-center items-center text-sm font-semibold text-black"
                            mode="horizontal"
                            items={navItems}
                        />

                        {user?.role === "admin" || user?.role === "user" ? (
                            <Dropdown trigger={["click"]} menu={{ items: userMenuItems }} overlayClassName="global-dropdown">
                                <button className="cursor-pointer focus:outline-none" onClick={(e) => e.preventDefault()}>
                                    <UserOutlined className={`p-3 text-2xl text-current hover:scale-105 transition-transform duration-300 ${scrolled ? "bg-white text-amber-600 ring-white" : "bg-white text-amber-600 ring-white"}`} />
                                </button>
                            </Dropdown>
                        ) : (
                            <div className="flex items-center">
                                <div className="max-lg:hidden">
                                    <Buttons to="/login" className={`${scrolled ? "bg-white text-amber-600 hover:bg-gray-100" : "bg-amber-600 text-white hover:bg-amber-700"} px-4 py-2 rounded-md transition-colors duration-300`}>
                                        Login
                                    </Buttons>
                                </div>

                                <div
                                    className="h-12 w-12 lg:hidden flex justify-end items-center cursor-pointer ml-4"
                                    onClick={() => setOpen(!open)}
                                    aria-label="toggle menu"
                                >
                                    {open ? (
                                        <CloseCircleOutlined className="text-3xl text-black hover:text-gray-600 transition-colors duration-300" />
                                    ) : (
                                        <FaBars className="text-3xl text-black hover:text-gray-600 transition-colors duration-300" />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mobile menu - dynamic position, no gap when top bar is collapsed */}
                        <div
                            className={`lg:hidden w-full absolute inset-x-0 px-4 transform origin-top transition-transform duration-300 ease-out ${open ? "scale-y-100" : "scale-y-0 pointer-events-none"}`}
                            style={{ top: `${headerHeight}px` }}
                        >
                            <div className="bg-white border-2 border-black rounded-b-xl shadow-2xl overflow-hidden">
                                <Menu className="text-black w-full" mode="vertical" items={mobileMenuItems} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header; 