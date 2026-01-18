import {
    FacebookFilled,
    InstagramFilled,
    TwitterSquareFilled,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import image from "@/assets/footer-bg.jpg";
import logo from "@/assets/car_lgo.png";

const Footer = () => {
    const bgImage = {
        backgroundImage: `url(${image})`,
    };

    return (
        <footer
            className="bg-[#0A0A0A] text-gray-100 py-12 bg-cover bg-center bg-no-repeat relative z-10"
            style={bgImage}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/90 to-[#0A0A0A]/80 -z-10"></div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(#2A2A2A_1px,transparent_1px)] [background-size:16px_16px] opacity-10 -z-10"></div>

            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Social Media & Logo Section */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex flex-col">
                                <img src={logo} alt="Car Rental Logo" className="w-24 h-auto mb-2" />
                                <h3 className="text-2xl font-bold text-white mb-2">Car Rental</h3>
                            </div>

                            <p className="text-gray-400 text-sm leading-relaxed">
                                Your trusted partner in finding the perfect vehicle. Quality, reliability, and excellence in every car.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">
                                Connect With Us
                            </h4>
                            <div className="flex space-x-4">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF6B35] transition-all duration-300 transform hover:-translate-y-1"
                                    aria-label="Visit our Facebook page"
                                >
                                    <FacebookFilled className="text-lg text-gray-300 hover:text-white" />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF6B35] transition-all duration-300 transform hover:-translate-y-1"
                                    aria-label="Visit our Twitter page"
                                >
                                    <TwitterSquareFilled className="text-lg text-gray-300 hover:text-white" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#FF6B35] transition-all duration-300 transform hover:-translate-y-1"
                                    aria-label="Visit our Instagram page"
                                >
                                    <InstagramFilled className="text-lg text-gray-300 hover:text-white" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Top Brands */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">
                            Top Brands
                        </h4>
                        <ul className="space-y-3">
                            {["Alfa Romeo", "Ferrari", "BMW Series", "Mercedes", "Aston Martin", "Toyota"].map((brand) => (
                                <li key={brand}>
                                    <Link
                                        to={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="text-gray-400 hover:text-[#FF6B35] transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-3 group-hover:bg-[#FF6B35] transition-colors"></span>
                                        {brand}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">
                            Categories
                        </h4>
                        <ul className="space-y-3">
                            {["Trucks", "Sports Cars", "Crossovers", "Hybrid Cars", "Hybrid SUVs", "Future Cars"].map((category) => (
                                <li key={category}>
                                    <Link
                                        to={`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="text-gray-400 hover:text-[#FF6B35] transition-colors duration-200 flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-3 group-hover:bg-[#FF6B35] transition-colors"></span>
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6 pb-2 border-b border-gray-800">
                            Contact Information
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <PhoneOutlined className="text-[#FF6B35] mr-3 mt-1" />
                                <span className="text-gray-400">(042) 789 35490</span>
                            </li>
                            <li className="flex items-start">
                                <MailOutlined className="text-[#FF6B35] mr-3 mt-1" />
                                <a
                                    href="mailto:support@Carena.com"
                                    className="text-gray-400 hover:text-[#FF6B35] transition-colors duration-200"
                                >
                                    support@Carena.com
                                </a>
                            </li>
                            <li className="flex items-start">
                                <EnvironmentOutlined className="text-[#FF6B35] mr-3 mt-1" />
                                <span className="text-gray-400">Fairview Ave, El Monte, CA, 91732</span>
                            </li>
                            <li className="flex items-start">
                                <ClockCircleOutlined className="text-[#FF6B35] mr-3 mt-1" />
                                <span className="text-gray-400">Mon - Fri: 09:00 AM to 06:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-8 border-t border-gray-800"></div>

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    {/* Copyright */}
                    <div className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Car Rental. All rights reserved.
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                        <Link
                            to="/privacy-policy"
                            className="text-gray-400 hover:text-[#FF6B35] transition-colors duration-200 text-sm"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms-of-service"
                            className="text-gray-400 hover:text-[#FF6B35] transition-colors duration-200 text-sm"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            to="/contact-us"
                            className="text-gray-400 hover:text-[#FF6B35] transition-colors duration-200 text-sm"
                        >
                            Contact Us
                        </Link>
                        <Link
                            to="/about-us"
                            className="text-gray-400 hover:text-[#FF6B35] transition-colors duration-200 text-sm"
                        >
                            About Us
                        </Link>
                    </div>

                    {/* Payment Methods */}
                    <div className="text-gray-500 text-sm">
                        Secure Payment Methods Available
                    </div>
                </div>

                {/* Back to Top Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-gray-400 hover:text-[#FF6B35] transition-colors duration-200 text-sm flex items-center justify-center mx-auto group"
                    >
                        <svg
                            className="w-4 h-4 mr-2 transform group-hover:-translate-y-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        Back to Top
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;