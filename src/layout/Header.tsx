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
    MenuOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import logo from '../assets/car_lgo.png';
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { logout } from "@/redux/feature/authSlice";
import { clearBookings } from "@/redux/feature/booking/bookingSlice";
import { useEffect, useState, useRef } from "react";
import { TUser } from "@/types/global";

const Header = () => {
    const user = useAppSelector((state: any) => state.auth.user) as TUser | null;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const topBarRef = useRef<HTMLDivElement>(null);
    const mainNavRef = useRef<HTMLDivElement>(null);
    const lastScrollRef = useRef(0);

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(logout());
        dispatch(clearBookings());
        navigate("/login");
    };

    // Check screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) setOpen(false);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Vanilla JS scroll handling
    useEffect(() => {
        let ticking = false;
        let topBarHeight = 0;

        // Get initial top bar height
        if (topBarRef.current) {
            topBarHeight = topBarRef.current.offsetHeight;
        }

        const handleScroll = () => {
            const currentScroll = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const topBar = topBarRef.current;
                    const mainNav = mainNavRef.current;

                    if (topBar && mainNav) {
                        const isScrollingDown = currentScroll > lastScrollRef.current;

                        // 🔹 TOP BAR
                        if (currentScroll > 20 && isScrollingDown) {
                            // scrolling down → hide
                            topBar.style.transform = 'translateY(-100%)';
                            topBar.style.opacity = '0';
                            topBar.style.height = '32px';
                        } else {
                            // scrolling up OR near top → show
                            topBar.style.transform = 'translateY(0)';
                            topBar.style.opacity = '1';
                            topBar.style.height = '32px';
                        }

                        // 🔹 MAIN NAV
                        if (currentScroll > 100 && isScrollingDown) {
                            mainNav.style.transform = 'translateY(-32px)';
                        } else {
                            mainNav.style.transform = 'translateY(0)';
                        }
                    }


                    lastScrollRef.current = currentScroll;
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initialize styles
        if (topBarRef.current && mainNavRef.current) {
            topBarRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
            mainNavRef.current.style.transition = 'transform 0.3s ease-out';
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial call to set correct state
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close menu when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (open && headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    // User menu items
    const getUserMenuItems = () => {
        const items: any[] = [];

        // Add navigation items for mobile
        if (isMobile) {
            items.push({
                key: 'mobile-nav-header',
                disabled: true,
                label: (
                    <div className="px-4 py-3">
                        <h3 className="font-lora text-lg font-semibold text-gray-900">Navigation</h3>
                    </div>
                ),
            });

            navPaths.forEach((item, index) => {
                items.push({
                    key: `mobile-nav-${index}`,
                    label: (
                        <Link
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-chocolate hover:bg-gray-50 transition-colors rounded-lg"
                            onClick={() => setOpen(false)}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ),
                });
            });

            items.push({ type: 'divider' });
        }

        // Add user info if logged in
        if (user) {
            items.push({
                key: 'user-info',
                disabled: true,
                label: (
                    <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-bold text-xl">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">{user.name}</h4>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${user.role === 'admin'
                                    ? 'bg-chocolate text-white'
                                    : 'bg-gray-200 text-gray-800'
                                    }`}>
                                    {user.role === 'admin' ? 'Administrator' : 'Premium Member'}
                                </span>
                            </div>
                        </div>
                    </div>
                ),
            });

            items.push({
                key: 'dashboard',
                label: (
                    <Link
                        to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-chocolate hover:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setOpen(false)}
                    >
                        <DashboardOutlined className="text-lg" />
                        <span className="font-medium">{user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}</span>
                    </Link>
                ),
            });

            items.push({ type: 'divider' });

            items.push({
                key: 'logout',
                label: (
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg"
                    >
                        <LogoutOutlined className="text-lg" />
                        <span className="font-medium">Logout</span>
                    </button>
                ),
            });
        } else {
            items.push({
                key: 'login',
                label: (
                    <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-chocolate hover:bg-gray-50 transition-colors rounded-lg"
                        onClick={() => setOpen(false)}
                    >
                        <UserOutlined className="text-lg" />
                        <span className="font-medium">Login / Register</span>
                    </Link>
                ),
            });
        }

        return items;
    };

    const userMenuItems = getUserMenuItems();

    return (
        <header
            ref={headerRef}
            className=" sticky top-0 z-50"
            style={{
                // Prevent any header container transforms
                transform: 'none !important'
            }}
        >
            {/* Top Info Bar - Direct style control */}
            <div
                ref={topBarRef}
                className="hidden md:block bg-gradient-to-r from-gray-900 to-black text-white"
                style={{
                    // Initial styles set by JS
                    transform: 'translateY(0)',
                    opacity: '1',
                    position: 'relative',
                    zIndex: 20,
                    willChange: 'transform, opacity'
                }}
            >
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6 text-sm">
                            <div className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                                <PhoneOutlined />
                                <span>+880 1234 567890</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                                <MailOutlined />
                                <span>Debos.das.02@gmail.com</span>
                            </div>
                            <div className="hidden lg:flex items-center gap-2 hover:text-gray-200 transition-colors">
                                <ClockCircleOutlined />
                                <span>Mon - Sun: 8:00 AM - 10:00 PM</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-chocolate flex items-center justify-center transition-colors duration-300">
                                <FacebookOutlined className="text-white" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-chocolate flex items-center justify-center transition-colors duration-300">
                                <YoutubeOutlined className="text-white" />
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white/20 hover:bg-chocolate flex items-center justify-center transition-colors duration-300">
                                <TwitterOutlined className="text-white" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div
                ref={mainNavRef}
                className="bg-white border-b border-gray-200 shadow-sm"
                style={{
                    // Initial styles set by JS
                    transform: 'translateY(0)',
                    position: 'relative',
                    zIndex: 10,
                    willChange: 'transform'
                }}
            >
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <img
                                src={logo}
                                className="h-12 lg:h-14 object-contain group-hover:scale-105 transition-transform duration-300"
                                alt="Car Rental Logo"
                            />
                            <div className="hidden lg:block">
                                <h1 className="text-xl font-lora font-bold text-gray-900">Car Rental</h1>
                                <p className="text-xs text-gray-600">Premium Car Rentals</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-2">
                            {navPaths.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className="relative px-4 py-2 text-gray-700 hover:text-chocolate transition-colors duration-300 group font-medium"
                                >
                                    <span className="font-sans text-lg uppercase">{item.name}</span>
                                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-chocolate transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            {user ? (
                                <Dropdown
                                    menu={{ items: userMenuItems }}
                                    placement="bottomRight"
                                    trigger={['click']}
                                    overlayClassName="global-dropdown"
                                >
                                    <button className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 border border-gray-200">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white font-bold">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                                        </div>
                                    </button>
                                </Dropdown>
                            ) : (
                                <>
                                    <div onClick={() => setOpen(false)}>
                                        <Buttons
                                            to="/login"
                                            className="px-6 py-2.5 border-2 border-gray-800 text-gray-800 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-300 font-sans"
                                        >
                                            Sign In
                                        </Buttons>
                                    </div>
                                    <div onClick={() => setOpen(false)}>
                                        <Buttons
                                            to="/register"
                                            className="px-6 py-2.5 bg-gradient-to-r from-chocolate to-chocolate/90 text-white hover:opacity-90 font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-sans"
                                        >
                                            Get Started
                                        </Buttons>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-4">
                            {user && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <button
                                onClick={() => setOpen(!open)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                                aria-label="Toggle menu"
                            >
                                {open ? (
                                    <CloseCircleOutlined className="text-2xl text-gray-700" />
                                ) : (
                                    <MenuOutlined className="text-2xl text-gray-700" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`lg:hidden absolute left-0 right-0 bg-white transition-all duration-300 ease-in-out ${open
                    ? 'top-full opacity-100 visible translate-y-0'
                    : 'top-full opacity-0 invisible -translate-y-4'
                    }`}>
                    <div className="container mx-auto px-4 py-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
                        {/* Navigation Links */}
                        <div className="mb-6">
                            <h3 className="font-lora text-lg font-semibold text-gray-900 mb-3 px-2">Menu</h3>
                            <div className="space-y-1">
                                {navPaths.map((item, index) => (
                                    <Link
                                        key={index}
                                        to={item.path}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-chocolate transition-colors duration-200 font-medium font-sans"
                                        onClick={() => setOpen(false)}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* User Section */}
                        {user ? (
                            <>
                                <div className="border-t border-gray-200 pt-6 mb-4">
                                    <div className=" hidden  md:flex items-center gap-3 mb-4 px-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white font-bold text-xl">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{user.name}</h4>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Link
                                            to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-chocolate transition-colors font-sans"
                                            onClick={() => setOpen(false)}
                                        >
                                            <DashboardOutlined />
                                            <span>{user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors font-sans"
                                        >
                                            <LogoutOutlined />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-gray-200 pt-6">
                                <div className="mb-4">
                                    <h3 className="font-lora text-lg font-semibold text-gray-900 mb-3 px-2">Account</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div onClick={() => setOpen(false)}>
                                            <Buttons
                                                to="/login"
                                                className="w-full py-3 border-2 border-gray-800 text-gray-800 hover:bg-gray-50 font-medium rounded-lg transition-colors font-sans"
                                            >
                                                Login
                                            </Buttons>
                                        </div>
                                        <div onClick={() => setOpen(false)}>
                                            <Buttons
                                                to="/register"
                                                className="w-full py-3 bg-gradient-to-r from-chocolate to-chocolate/90 text-white hover:opacity-90 font-medium rounded-lg transition-colors shadow-md font-sans"
                                            >
                                                Register
                                            </Buttons>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Info */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="font-lora text-lg font-semibold text-gray-900 mb-3 px-2">Contact Info</h3>
                            <div className="space-y-3 px-2">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <PhoneOutlined className="text-chocolate" />
                                    <span className="font-sans">+880 1234 567890</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MailOutlined className="text-chocolate" />
                                    <span className="font-sans">support@driveease.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <EnvironmentOutlined className="text-chocolate" />
                                    <span className="font-sans">Chittagong, Bangladesh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;