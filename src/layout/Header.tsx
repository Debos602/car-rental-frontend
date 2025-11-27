// Buttons component not used in header; removed to avoid unused import
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
import { Dropdown, Menu, Space, Avatar } from "antd";
import { SettingOutlined } from "@ant-design/icons";
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
                            <IoIosHome className="text-xl text-[#7B3F00]" />
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
                            <FaCarSide className="text-xl text-[#7B3F00]" />
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
                            <MdRoundaboutRight className="text-xl text-[#7B3F00]" />
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
                            <IoMdAppstore className="text-xl text-[#7B3F00]" />
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
                            <MdContactPhone className="text-xl text-[#7B3F00]" />
                            <span className="pl-2">Contact</span>
                        </span>
                    </Link>
                ),
            },
        ];
    }

    if (user?.role) {
        const initials = (user?.name || "").split(" ").map(n => n?.[0]).slice(0, 2).join("") || "U";

        userMenuItems.push({
            key: "user-info",
            disabled: true,
            label: (
                <div className="flex items-center gap-3 py-2 px-3">
                    <Avatar size={48} style={{ backgroundColor: '#ffffff', border: '2px solid #7B3F00', color: '#7B3F00', fontWeight: 700 }}>
                        {initials}
                    </Avatar>
                    <div>
                        <div className="text-black font-bold">{user?.name}</div>
                        <div className="text-black text-sm opacity-80">{user?.email}</div>
                    </div>
                </div>
            ),
        });

        // quick links: Profile and Settings
        userMenuItems.push({
            key: "profile",
            label: (
                <Link to="/profile" className="py-2 inline-block text-black hover:text-[#A0522D] transition-colors duration-200">
                    <span className="flex items-center gap-3">
                        <UserOutlined className="text-lg text-current" />
                        <span>Profile</span>
                    </span>
                </Link>
            ),
        });

        userMenuItems.push({
            key: "settings",
            label: (
                <Link to="/settings" className="py-2 inline-block text-black hover:text-[#A0522D] transition-colors duration-200">
                    <span className="flex items-center gap-3">
                        <SettingOutlined className="text-lg text-current" />
                        <span>Settings</span>
                    </span>
                </Link>
            ),
        });

        userMenuItems.push({ key: "div1", type: "divider" });

        userMenuItems.push({
            key: "dashboard",
            label: (
                <Link
                    to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                    className="py-2 inline-block hover:text-[#A0522D] transition-colors duration-300"
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
                <button onClick={handleLogout} className="w-full text-left py-2 inline-block text-black hover:text-[#A0522D] transition-colors duration-200 logout-action">
                    <span className="flex items-center gap-3">
                        <LogoutOutlined className="text-lg text-current" />
                        <span>Logout</span>
                    </span>
                </button>
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
            const iconClass = "text-xl text-[#000]";
            let Icon: any = IoIosHome;
            if (name.includes("car") || name.includes("cars")) Icon = FaCarSide;
            else if (name.includes("about")) Icon = MdRoundaboutRight;
            else if (name.includes("book") || name.includes("booking")) Icon = IoMdAppstore;
            else if (name.includes("contact")) Icon = MdContactPhone;

            return (
                <Link to={navItem.path} className="uppercase duration-300 flex items-center gap-2 text-[#000]">
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
                        <div className="hidden lg:flex flex-1 justify-center">
                            <Menu
                                className="header-menu bg-transparent text-[#7B3F00] !border-transparent text-sm font-semibold"
                                mode="horizontal"
                                items={navItems}
                            />
                        </div>

                        {user?.role === "admin" || user?.role === "user" ? (
                            <Dropdown trigger={["click"]} menu={{ items: userMenuItems }} overlayClassName="global-dropdown">
                                <button className="cursor-pointer focus:outline-none" onClick={(e) => e.preventDefault()}>
                                    <UserOutlined className={`p-3 text-2xl text-[#000] hover:scale-105 transition-transform duration-300`} />
                                </button>
                            </Dropdown>
                        ) : (
                            <div className="flex items-center">
                                <div className="hidden lg:block">
                                    <Link to="/login" className="px-4 py-2 rounded-md bg-white text-[#7B3F00] border-2 border-[#7B3F00] font-semibold hover:bg-[#f7f7f7] transition-colors duration-200">
                                        Login
                                    </Link>
                                </div>

                                <div
                                    className="h-12 w-12 lg:hidden flex justify-end items-center cursor-pointer ml-4"
                                    onClick={() => setOpen(!open)}
                                    aria-label="toggle menu"
                                >
                                    {open ? (
                                        <CloseCircleOutlined className="text-3xl text-[#7B3F00] hover:text-gray-600 transition-colors duration-300" />
                                    ) : (
                                        <FaBars className="text-3xl text-[#7B3F00] hover:text-gray-600 transition-colors duration-300" />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mobile menu - dynamic position, no gap when top bar is collapsed */}
                        <div
                            className={`lg:hidden w-full absolute inset-x-0 px-4 transform origin-top transition-transform duration-300 ease-out ${open ? "scale-y-100" : "scale-y-0 pointer-events-none"}`}
                            style={{ top: `${headerHeight}px` }}
                        >
                            <div className="bg-white border-t-2 border-[#7B3F00] rounded-b-xl shadow-2xl overflow-hidden">
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