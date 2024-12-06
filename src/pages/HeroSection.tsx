import { Carousel, Select, Button, DatePicker } from "antd";
import img1 from "../assets/img-1.jpg";
import img2 from "../assets/img-2.jpg";
import img3 from "../assets/img-3.jpg";
import img4 from "../assets/img-4.jpg";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import { CustomArrowProps } from "react-slick";

const { Option } = Select;



const NextArrow = (props: CustomArrowProps) => {
    const { onClick } = props;

    return (
        <motion.button
            className="absolute right-6 top-[46%] transform -translate-y-1/2 bg-gradient-to-r from-[#80C4E9] to-transparent text-white p-4 rounded-full shadow-lg hover:bg-opacity-70 transition z-20"
            onClick={onClick}
            aria-label="Next"
            initial={{ opacity: 0, x: 50 }}  // Initial state: hidden and offset to the right
            animate={{ opacity: 1, x: 0 }}   // End state: fully visible and in place
            exit={{ opacity: 0, x: 50 }}     // Exit state: hidden and offset again
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <ArrowRightOutlined size={20} />
        </motion.button>
    );
};

const PrevArrow = (props: CustomArrowProps) => {
    const { onClick } = props;

    return (
        <motion.button
            className="absolute left-6 top-[46%] transform -translate-y-1/2 bg-gradient-to-l from-[#80C4E9] to-transparent text-white p-4 rounded-full shadow-lg hover:bg-opacity-70 transition z-20"
            onClick={onClick}
            aria-label="Previous"
            initial={{ opacity: 0, x: -50 }} // Initial state: hidden and offset to the left
            animate={{ opacity: 1, x: 0 }}   // End state: fully visible and in place
            exit={{ opacity: 0, x: -50 }}    // Exit state: hidden and offset again
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            <ArrowLeftOutlined size={20} />
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
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const handleSearch = () => {
        const startD = startTime ? startTime.format("YYYY-MM-DD") : "";
        const endD = endTime ? endTime.format("YYYY-MM-DD") : "";
        navigate(`/cars?location=${location}&startDate=${startD}&endDate=${endD}`);
    };

    return (
        <div className="relative mt-[82px] md:mt-[102px]">
            {/* Carousel */}
            <Carousel arrows {...settings}>
                {sliderItems.map((item, index) => (
                    <div key={index}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
                            <img
                                src={item.src}
                                className="h-[calc(100vh-134px)] w-full object-cover"
                                alt={item.alt}
                            />
                        </div>
                    </div>
                ))}
            </Carousel>

            {/* Content Overlay */}
            <motion.div
                className="absolute inset-0 flex flex-col justify-center items-center z-20 bg-opacity-50 bg-[#4335A7] border-2 border-[#FFF6E9] rounded-xl shadow-lg mx-auto my-auto w-[300px] h-[350px]  md:w-[800px] md:h-[300px] lg:w-[900px] lg:h-[350px]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <motion.h1
                    className="text-lg md:text-4xl font-extrabold uppercase my-0 md:my-3 text-[#FFF6E9] text-center"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    Find Your Perfect Ride
                </motion.h1>

                {/* Search Bar */}
                <motion.div
                    className="w-full max-w-2xl px-4 my-3"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <div className="bg-[#FFF6E9]  rounded-xl p-3 md:p-6 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            placeholder="Select your location"
                            size="large"
                            className="flex-grow"
                            onChange={handleChange}
                            value={location}
                            style={{ width: "100%", color: "#4335A7" }}
                        >
                            {locations.map((loc) => (
                                <Option key={loc} value={loc}>
                                    {loc}
                                </Option>
                            ))}
                        </Select>

                        <DatePicker
                            size="large"
                            placeholder="Pick-up Date"
                            className="flex-grow"
                            format="YYYY-MM-DD"
                            onChange={(date) => setPickUpDate(date)}
                            disabledDate={(currentDate) =>
                                currentDate && currentDate < dayjs().endOf("day")
                            }
                            style={{ color: "#4335A7" }}
                        />

                        <DatePicker
                            size="large"
                            placeholder="Return Date"
                            className="flex-grow"
                            format="YYYY-MM-DD"
                            onChange={(date) => setReturnDate(date)}
                            disabledDate={(currentDate) =>
                                currentDate && currentDate < dayjs().endOf("day")
                            }
                            style={{ color: "#4335A7" }}
                        />
                    </div>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    <Button
                        size="large"
                        className="bg-[#4335A7] mt-0 md:mt-3 text-[#FFF6E9] border-2 border-[#FFF6E9] rounded-xl px-8 py-4 shadow-lg"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroSection;
