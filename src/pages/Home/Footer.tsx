import {
    FacebookFilled,
    InstagramFilled,
    TwitterSquareFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import image from "../../assets/footer-bg.jpg";

const Footer = () => {
    const bgImage = {
        backgroundImage: `url(${image})`,
    };

    return (
        <footer
            className="bg-[#000] text-[#FFF6E9] py-8 bg-cover bg-center bg-no-repeat relative z-10"
            style={bgImage}
        >
            {/* Background overlay */}
            <div className="absolute inset-0 w-full h-full bg-[#000] opacity-95 -z-10"></div>

            <div className="container mx-auto px-4">
                {/* Footer content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Social Media Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Follow Us
                        </h4>
                        <div className="flex space-x-4 text-2xl">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#FF7F3E]"
                            >
                                <FacebookFilled />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#FF7F3E]"
                            >
                                <TwitterSquareFilled />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#FF7F3E]"
                            >
                                <InstagramFilled />
                            </a>
                        </div>
                    </div>

                    {/* Top Brands */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Top Brands
                        </h4>
                        <ul className="space-y-2">
                            <li>Alfa Romeo</li>
                            <li>Ferrari</li>
                            <li>BMW Series</li>
                            <li>Mercedes</li>
                            <li>Aston Martin</li>
                            <li>Toyota</li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Categories
                        </h4>
                        <ul className="space-y-2">
                            <li>Trucks</li>
                            <li>Sports Cars</li>
                            <li>Crossovers</li>
                            <li>Hybrid Cars</li>
                            <li>Hybrid SUVs</li>
                            <li>Future Cars</li>
                        </ul>
                    </div>

                    {/* Additional Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Additional Info
                        </h4>
                        <ul className="space-y-2">
                            <li>Call us: (042) 789 35490</li>
                            <li>Email: support@Carena.com</li>
                            <li>Address: Fairview Ave, El Monte, CA, 91732</li>
                            <li>Mon - Fri: 09:00 AM to 06:00 PM</li>
                        </ul>
                    </div>
                </div>

                {/* Footer Links and Bottom */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    {/* Footer Links */}
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                        <Link to="/" className="hover:text-[#FF7F3E]">
                            Privacy Policy
                        </Link>
                        <Link to="/" className="hover:text-[#FF7F3E]">
                            Terms of Service
                        </Link>
                        <Link to="/" className="hover:text-[#FF7F3E]">
                            Contact Us
                        </Link>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-4 md:mt-0 text-center">
                        &copy; {new Date().getFullYear()} Your Company Name. All
                        rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
