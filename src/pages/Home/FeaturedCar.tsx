import { useGetAllCarsQuery } from "@/redux/feature/car/carManagement.api";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Card, Badge, Rate, Skeleton } from "antd";
import Slider, { CustomArrowProps } from "react-slick";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TCar } from "@/types/global";
import { Link } from "react-router-dom";

// Custom Next Arrow
const NextArrow = (props: CustomArrowProps) => {
    const { onClick } = props;
    return (
        <motion.button
            className="hidden md:flex absolute right-4 md:right-6 top-[50%] transform -translate-y-1/2 bg-gradient-to-r from-[#D2691E] to-transparent text-white p-2 md:p-3 rounded-full shadow-lg hover:opacity-90 transition z-30"
            onClick={onClick}
            aria-label="Next"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowRightOutlined style={{ fontSize: "18px" }} />
        </motion.button>
    );
};

// Custom Previous Arrow
const PrevArrow = (props: CustomArrowProps) => {
    const { onClick } = props;
    return (
        <motion.button
            className="hidden md:flex absolute left-4 md:left-6 top-[50%] transform -translate-y-1/2 bg-gradient-to-l from-[#D2691E] to-transparent text-white p-2 md:p-3 rounded-full shadow-lg hover:opacity-90 transition z-30"
            onClick={onClick}
            aria-label="Previous"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowLeftOutlined style={{ fontSize: "18px" }} />
        </motion.button>
    );
};

const FeaturedCars = () => {
    const { data: cars, isLoading, isError } = useGetAllCarsQuery(undefined);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const carsArray = Array.isArray(cars?.data) ? cars?.data : [];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    const getPreviousPrice = (currentPrice: number) => currentPrice + 50;

    return (
        <div className="bg-white/90 text-black relative" ref={ref}>
            {/* decorative blurred background */}
            <div
                aria-hidden
                className="absolute -inset-6 rounded-3xl -z-20"
                style={{
                    background: 'radial-gradient(closest-side,#FBEAD2, transparent)',
                    filter: 'blur(40px)',
                    opacity: 0.6,
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1 }}
                className="container mx-auto py-20"
            >
                <div className="grid grid-cols-1 md:grid-cols-5">
                    <div className="p-4 md:col-span-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-50 text-[#D2691E] px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-amber-200">
                            <span className="w-2 h-2 bg-gradient-to-r from-[#D2691E] to-amber-600 rounded-full"></span>
                            Feature Car
                        </div>
                        <p className="text-4xl font-semibold text-black mb-4">
                            Our Top Picks For You
                            <span className="text-[#D2691E]"> Today!</span>
                        </p>
                        <p className="text-lg font-medium text-black/80 max-w-2xl mx-auto mb-8">
                            Explore our handpicked selection of the most popular cars, offering
                            unbeatable comfort, style, and performance.
                        </p>
                    </div>

                    <div className="col-span-4 my-5">
                        {isLoading ? (
                            <div className="relative p-4 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.12)] bg-white">
                                <Slider {...settings} className=" overflow-hidden ">
                                    {[1, 2, 3].map((_, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                            transition={{ duration: 0.8, delay: index * 0.12 }}
                                            className="px-4"
                                        >
                                            <Badge.Ribbon
                                                text={<Skeleton.Input style={{ width: 50 }} size="small" active />}
                                                color="#D2691E"
                                            >
                                                <Card
                                                    loading={true}
                                                    className="border-0 bg-gradient-to-b from-transparent to-white/60 group rounded-xl overflow-hidden transform transition-transform"
                                                    cover={
                                                        <div className="relative overflow-hidden">
                                                            <Skeleton.Image active style={{ width: '100%', height: 180 }} />
                                                        </div>
                                                    }
                                                />
                                                <div className="mt-3 rounded-b-xl overflow-hidden">
                                                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#D2691E] to-black text-white">
                                                        <Skeleton.Input active size="small" style={{ width: 100 }} />
                                                        <Skeleton.Button active shape="round" />
                                                    </div>
                                                </div>
                                            </Badge.Ribbon>
                                        </motion.div>
                                    ))}
                                </Slider>
                            </div>
                        ) : isError ? (
                            <p>Failed to load cars.</p>
                        ) : carsArray.length > 0 ? (
                            <div>
                                <div className="relative p-4 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.12)] bg-white">
                                    <Slider {...settings} className=" overflow-hidden ">
                                        {carsArray.map((car: TCar, index: number) => (
                                            <motion.div
                                                key={car._id}
                                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                                animate={
                                                    inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }
                                                }
                                                transition={{
                                                    duration: 0.5,
                                                    delay: index * 0.08,
                                                    type: "spring",
                                                    stiffness: 120
                                                }}
                                                whileHover={{
                                                    y: -4,
                                                    transition: { duration: 0.2 }
                                                }}
                                                className="h-full"
                                            >
                                                <Badge.Ribbon
                                                    text={car.status}
                                                    color="#D2691E"
                                                    className="text-xs"
                                                    style={{ fontSize: '10px', padding: '0 8px', height: '20px', lineHeight: '20px' }}
                                                >
                                                    <div role="article" tabIndex={0} aria-label={`Featured car ${car.name}`} className="h-full">
                                                        <Card
                                                            className="h-full bg-gradient-to-b from-white to-amber-50 shadow-lg group rounded-lg overflow-hidden transform transition-all duration-200 hover:shadow-xl border border-gray-100"
                                                            cover={
                                                                <div className="relative overflow-hidden h-44 sm:h-52 md:h-56 lg:h-60">
                                                                    <img
                                                                        alt={`${car.brand} ${car.name} ${car.model}`}
                                                                        loading="lazy"
                                                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                        src={car.image || '/placeholder-car.png'}
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                                                    <div className="absolute top-2 right-2">
                                                                        <div className="bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                                                                            {car.seats} Seats
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                            styles={{ body: { padding: '12px' } }}
                                                        >
                                                            <div className="h-full flex flex-col">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-chocolate transition-colors truncate">
                                                                            {car.name}
                                                                        </h3>
                                                                        <p className="text-gray-500 text-xs mt-0.5 truncate">
                                                                            {car.brand} • {car.model}
                                                                        </p>
                                                                    </div>
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chocolate to-amber-900 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ml-2">
                                                                        {car.year}
                                                                    </div>
                                                                </div>

                                                                <p className="text-gray-600 text-sm sm:text-xs mb-3 line-clamp-2 flex-grow-0">
                                                                    {car.description?.slice(0, 90) ?? ''}...
                                                                </p>

                                                                <div className="space-y-2 mt-auto">
                                                                    <div className="flex items-center justify-between">
                                                                        <div>
                                                                            <p className="text-xs line-through text-gray-400 mb-0.5">
                                                                                ${getPreviousPrice(car.pricePerHour)}
                                                                            </p>
                                                                            <p className="text-lg font-bold text-chocolate">
                                                                                ${car.pricePerHour}<span className="text-xs font-medium text-gray-600">/hr</span>
                                                                            </p>
                                                                        </div>
                                                                        <Rate
                                                                            disabled
                                                                            defaultValue={Number(car.rating) || 4}
                                                                            className="text-amber-400 [&_.ant-rate-star]:mr-0.5 text-xs"
                                                                        />
                                                                    </div>

                                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                                        <div className="flex items-center space-x-2">
                                                                            <div className="flex items-center">
                                                                                <div
                                                                                    className="w-3 h-3 rounded-full border border-gray-300 mr-1"
                                                                                    style={{ backgroundColor: car.color }}
                                                                                    aria-hidden
                                                                                ></div>
                                                                                <span className="text-gray-600 text-xs">{car.color}</span>
                                                                            </div>
                                                                            <span className="text-gray-600 text-xs">•</span>
                                                                            <span className="text-gray-600 text-xs">{car.fuelType}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <Link
                                                                                to={`/car-details/${car._id}`}
                                                                                aria-label={`View details for ${car.name}`}
                                                                                className="bg-gradient-to-r from-chocolate to-amber-800 hover:from-amber-800 hover:to-chocolate text-white px-4 py-2 sm:px-8 sm:py-3 rounded-md font-semibold transition-all duration-200 transform hover:scale-105 shadow text-xs sm:text-sm"
                                                                            >
                                                                                View
                                                                            </Link>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                </Badge.Ribbon>
                                            </motion.div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        ) : (
                            <p>No cars available.</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default FeaturedCars;