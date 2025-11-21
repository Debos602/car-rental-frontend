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
            className="hidden md:inline-flex absolute right-4 md:right-6 top-[46%] transform -translate-y-1/2 bg-gradient-to-r from-[#D2691E] to-[#a8581a] text-white p-2 sm:p-3 md:p-4 rounded-full shadow-2xl hover:scale-105 transition-transform z-30"
            onClick={onClick}
            aria-label="Next"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
        >
            <ArrowRightOutlined style={{ fontSize: 14 }} className="sm:text-base md:text-lg" />
        </motion.button>
    );
};

const PrevArrow = (props: CustomArrowProps) => {
    const { onClick } = props;

    return (
        <motion.button
            className="hidden md:inline-flex absolute left-4 md:left-6 top-[46%] transform -translate-y-1/2 bg-gradient-to-l from-[#D2691E] to-[#a8581a] text-white p-2 sm:p-3 md:p-4 rounded-full shadow-2xl hover:scale-105 transition-transform z-30"
            onClick={onClick}
            aria-label="Previous"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
        >
            <ArrowLeftOutlined style={{ fontSize: 14 }} className="sm:text-base md:text-lg" />
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

    const [startTime, setPickUpDate] = useState<Dayjs | null>(null);
    const [endTime, setReturnDate] = useState<Dayjs | null>(null);
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
        const startD = startTime ? startTime.format("YYYY-MM-DD") : "";
        const endD = endTime ? endTime.format("YYYY-MM-DD") : "";
        navigate(`/cars?location=${location}&startDate=${startD}&endDate=${endD}`);
    };

    return (
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[calc(100vh-134px)]">
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
                            <div className="absolute inset-0 bg-black/50 z-10 backdrop-blur-sm"></div>
                            <img
                                src={item.src}
                                className="h-[50vh] sm:h-[60vh] md:h-[calc(100vh-134px)] w-full object-cover filter grayscale contrast-95"
                                alt={item.alt}
                            />
                        </div>
                    </motion.div>
                ))}
            </Slider>

            {/* Content Overlay - split layout on md+ */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center z-20 mx-auto px-4 sm:px-6 md:px-8"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                        {/* Left: big copy */}
                        <motion.div
                            className="hidden md:block text-center md:text-left py-6 sm:py-8 md:py-12 ps-0 md:ps-4 lg:ps-12"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h2
                                className="text-2xl sm:text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg leading-tight"
                                variants={itemVariant}
                            >
                                Find your perfect ride
                            </motion.h2>
                            <motion.p
                                className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/95 max-w-md sm:max-w-lg md:max-w-xl leading-relaxed"
                                variants={itemVariant}
                            >
                                Clean cars • Transparent pricing • Easy booking — get on the road today. Our fleet is
                                ready across major cities.
                            </motion.p>
                            <motion.div
                                className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center md:justify-start gap-3"
                                variants={itemVariant}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        size="large"
                                        className="chocolate-btn px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg text-sm sm:text-base md:text-lg w-full sm:w-auto"
                                        onClick={() => navigate("/cars")}
                                    >
                                        Browse Cars
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full sm:w-auto"
                                >
                                    <Link to="/about" className="inline-block px-4 py-2 sm:px-6 sm:py-3 border border-white text-white rounded-lg hover:bg-white/10 transition text-sm sm:text-base w-full sm:w-auto text-center">
                                        Learn more
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Right: Search card */}
                        <motion.div
                            className=" mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/95 rounded-2xl shadow-2xl p-4 sm:p-5 md:p-8 backdrop-blur-md"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="text-sm sm:text-base md:text-lg font-semibold text-black mb-2 sm:mb-3"
                                variants={itemVariant}
                            >
                                Quick Search
                            </motion.div>
                            <motion.div
                                className="grid grid-cols-1 gap-2 sm:gap-3"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div variants={itemVariant}>
                                    <Select
                                        placeholder="Select your location"
                                        size="large"
                                        className="w-full text-black"
                                        onChange={handleChange}
                                        value={location}
                                        style={{ width: "100%", color: "#000" }}
                                    >
                                        {locations.map((loc) => (
                                            <Option key={loc} value={loc}>
                                                {loc}
                                            </Option>
                                        ))}
                                    </Select>
                                </motion.div>

                                <motion.div variants={itemVariant} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                    <DatePicker
                                        size="large"
                                        placeholder="Pick-up"
                                        className="w-full"
                                        format="YYYY-MM-DD"
                                        onChange={(date) => setPickUpDate(date)}
                                        disabledDate={(currentDate) =>
                                            currentDate && currentDate < dayjs().endOf("day")
                                        }
                                        style={{ color: "#000" }}
                                    />

                                    <DatePicker
                                        size="large"
                                        placeholder="Return"
                                        className="w-full"
                                        format="YYYY-MM-DD"
                                        onChange={(date) => setReturnDate(date)}
                                        disabledDate={(currentDate) =>
                                            currentDate && currentDate < dayjs().endOf("day")
                                        }
                                        style={{ color: "#000" }}
                                    />
                                </motion.div>

                                <motion.div variants={itemVariant}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Button size="large" className="chocolate-btn rounded-xl mt-1 text-sm sm:text-base md:text-lg w-full" onClick={handleSearch}>
                                            Search
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HeroSection;