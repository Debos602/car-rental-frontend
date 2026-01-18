import { Select, Button, DatePicker } from "antd";
import Slider from "react-slick";
import img1 from "../assets/img-1.jpg";
import img2 from "../assets/img-2.jpg";
import img3 from "../assets/img-3.jpg";
import img4 from "../assets/img-4.jpg";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CustomArrowProps } from "react-slick";

const { Option } = Select;

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
            ease: "easeInOut",
        },
    },
};

const itemVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const NextArrow = (props: CustomArrowProps) => {
    const { onClick } = props;

    return (
        <motion.button
            className="absolute right-0 top-1/2 mt-[-26.5px] bg-black text-white p-4 hover:scale-105 transition-transform z-30 "
            onClick={onClick}
            aria-label="Next"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
        >
            <ArrowRightOutlined className="text-xs sm:text-sm md:text-base" />
        </motion.button>
    );
};

const PrevArrow = (props: CustomArrowProps) => {
    const { onClick } = props;

    return (
        <motion.button
            className="absolute left-0 top-1/2 mt-[-26.5px] bg-black text-white p-4 hover:scale-105 transition-transform z-30"
            onClick={onClick}
            aria-label="Previous"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
        >
            <ArrowLeftOutlined className="text-xs sm:text-sm md:text-base" />
        </motion.button>
    );
};

const HeroSection = () => {
    const [location, setLocation] = useState("");
    const locations = [
        "Dhaka",
        "Chittagong",
        "Comilla",
        "Barisal",
        "Rajshahi",
        "Rangpur",
        "Cox's Bazar",
        "Sylhet",
    ];

    const handleChange = (value: string) => {
        setLocation(value);
    };

    const sliderItems = [
        { src: img1, alt: "Image 1" },
        { src: img2, alt: "Image 2" },
        { src: img3, alt: "Image 3" },
        { src: img4, alt: "Image 4" },
    ];

    const [pickUpDate, setPickUpDate] = useState<Dayjs | null>(null);
    const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
    const navigate = useNavigate();

    const settings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 4000,
        fade: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const handleSearch = () => {
        const startD = pickUpDate ? pickUpDate.format("YYYY-MM-DD") : "";
        const endD = returnDate ? returnDate.format("YYYY-MM-DD") : "";
        navigate(`/cars?location=${location}&startDate=${startD}&endDate=${endD}`);
    };

    return (
        <div className="relative">
            {/* Main Background with Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-chocolate/40 via-gray-900/60 to-black/70 z-0"></div>

            {/* Carousel */}
            <Slider {...settings}>
                {sliderItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-chocolate/60 via-amber-900/50 to-black/40 z-10 backdrop-blur-[2px]"></div>
                            <img
                                src={item.src}
                                className="w-full h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-[700px] object-cover object-center filter brightness-[0.7] contrast-110"
                                alt={item.alt}
                            />
                        </div>
                    </motion.div>
                ))}
            </Slider>

            {/* Content Overlay */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center z-20 px-4 sm:px-6 md:px-8"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <div className="w-full max-w-6xl mx-auto">

                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                        {/* Left Content - Visible on medium and larger screens */}
                        <motion.div
                            className="hidden lg:block w-full lg:w-1/2 text-center lg:text-left py-4 sm:py-6 md:py-8 lg:py-12"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="flex justify-center lg:justify-start items-center space-x-2 mb-4"
                                variants={itemVariant}
                            >
                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"></div>
                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-300"></div>
                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-chocolate"></div>
                            </motion.div>

                            <motion.h1
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-2xl leading-tight"
                                variants={itemVariant}
                            >
                                FIND YOUR
                                <br />
                                <span className="text-chocolate-light bg-white/10 px-2 sm:px-3 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl inline-block mt-2">
                                    PERFECT RIDE
                                </span>
                            </motion.h1>

                            <motion.div
                                className="mt-4 sm:mt-6 bg-white/10 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-xl border border-white/20 shadow-2xl max-w-xl mx-auto lg:mx-0"
                                variants={itemVariant}
                            >
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed font-medium">
                                    Clean cars • Transparent pricing • Easy booking — get on the road today.
                                    Our fleet is ready across major cities.
                                </p>
                            </motion.div>

                            <motion.div
                                className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4"
                                variants={itemVariant}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="hidden lg:block"
                                >
                                    <Button
                                        size="large"
                                        className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 border-0 text-white font-bold rounded-xl shadow-2xl hover:shadow-3xl px-6 py-4 text-lg lg:text-xl flex items-center"
                                        onClick={() => navigate("/cars")}
                                        icon={
                                            <svg className="w-5 sm:w-6 h-5 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                            </svg>
                                        }
                                    >
                                        Browse Cars
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link
                                        to="/about"
                                        className="hidden md:inline-block px-4 sm:px-5 md:px-6 py-2 sm:py-3 md:py-4 border-2 border-white bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-chocolate transition-all duration-300 rounded-xl font-bold text-sm sm:text-base md:text-lg w-full sm:w-auto text-center shadow-xl hover:shadow-2xl"
                                    >
                                        Learn About Us
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Features */}
                            <motion.div
                                className="mt-6 sm:mt-8 lg:mt-10 bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-white/10 max-w-md mx-auto lg:mx-0"
                                variants={itemVariant}
                            >
                                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-5 h-5 sm:w-6 md:w-8 sm:h-6 md:h-8 rounded-full bg-chocolate flex items-center justify-center mb-1 sm:mb-2">
                                            <svg className="w-3 h-3 sm:w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-white text-xs sm:text-sm font-semibold">Luxury Cars</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-5 h-5 sm:w-6 md:w-8 sm:h-6 md:h-8 rounded-full bg-amber-600 flex items-center justify-center mb-1 sm:mb-2">
                                            <svg className="w-3 h-3 sm:w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-white text-xs sm:text-sm font-semibold">Best Rates</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-5 h-5 sm:w-6 md:w-8 sm:h-6 md:h-8 rounded-full bg-gray-900 flex items-center justify-center mb-1 sm:mb-2">
                                            <span className="text-white text-xs sm:text-sm font-bold">24/7</span>
                                        </div>
                                        <span className="text-white text-xs sm:text-sm font-semibold">Support</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Search Card */}
                        <motion.div
                            className="w-full max-w-sm sm:max-w-md lg:w-5/12 xl:w-4/12 lg:max-w-none mx-auto lg:mx-0"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border-2 border-gray-900"
                                variants={itemVariant}
                            >
                                <motion.div
                                    className="flex items-center mb-3 sm:mb-5"
                                    variants={itemVariant}
                                >
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-chocolate mr-3"></div>
                                    <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                                        Quick Search
                                    </div>
                                    <div className="ml-auto flex space-x-1">
                                        <div className="w-2 h-2 rounded-full bg-chocolate"></div>
                                        <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                                        <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="grid grid-cols-1 gap-3 sm:gap-5"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.div variants={itemVariant}>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1 sm:mb-2">
                                            Location
                                        </label>
                                        <Select
                                            placeholder="Select your location"
                                            size="large"
                                            className="w-full border-2 border-gray-900 hover:border-chocolate focus:border-chocolate rounded-lg [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!h-10 sm:!h-12 [&_.ant-select-selection-placeholder]:text-gray-600 bg-white"
                                            onChange={handleChange}
                                            value={location}
                                            dropdownStyle={{
                                                border: '2px solid #27272a',
                                                borderRadius: '8px',
                                                padding: '6px',
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            {locations.map((loc) => (
                                                <Option
                                                    key={loc}
                                                    value={loc}
                                                    className="hover:bg-amber-50 py-2 sm:py-3 px-4 rounded-md"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-chocolate mr-3"></div>
                                                        <span className="text-gray-900 font-medium">{loc}</span>
                                                    </div>
                                                </Option>
                                            ))}
                                        </Select>
                                    </motion.div>

                                    <motion.div variants={itemVariant}>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1 sm:mb-2">
                                            Rental Period
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                            <div>
                                                <DatePicker
                                                    size="large"
                                                    placeholder="Pick-up"
                                                    className="w-full border-2 border-gray-900 hover:border-chocolate focus:border-chocolate rounded-lg text-gray-900 [&_.ant-picker-input>input]:text-gray-900 bg-white"
                                                    format="YYYY-MM-DD"
                                                    onChange={(date) => setPickUpDate(date)}
                                                    disabledDate={(currentDate) =>
                                                        currentDate && currentDate < dayjs().endOf("day")
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <DatePicker
                                                    size="large"
                                                    placeholder="Return"
                                                    className="w-full border-2 border-gray-900 hover:border-chocolate focus:border-chocolate rounded-lg text-gray-900 [&_.ant-picker-input>input]:text-gray-900 bg-white"
                                                    format="YYYY-MM-DD"
                                                    onChange={(date) => setReturnDate(date)}
                                                    disabledDate={(currentDate) =>
                                                        currentDate && currentDate < dayjs().endOf("day")
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </motion.div>


                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Bottom accent */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-2 sm:h-3 bg-gradient-to-r from-chocolate via-amber-800 to-black z-20 shadow-2xl"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </div>
    );
};

export default HeroSection;