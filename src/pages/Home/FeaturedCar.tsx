import { useGetAllCarsQuery } from "@/redux/feature/car/carManagement.api";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Card, Badge, Rate } from "antd";
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
            className="absolute right-6 top-[50%] transform -translate-y-1/2 bg-gradient-to-r from-[#D2691E] to-transparent text-white p-2 rounded-full shadow-lg hover:opacity-90 transition z-30"
            onClick={onClick}
            aria-label="Next"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowRightOutlined style={{ fontSize: "20px" }} />
        </motion.button>
    );
};

// Custom Previous Arrow
const PrevArrow = (props: CustomArrowProps) => {
    const { onClick } = props;
    return (
        <motion.button
            className="absolute left-6 top-[50%] transform -translate-y-1/2 bg-gradient-to-l from-[#D2691E] to-transparent text-white p-2 rounded-full shadow-lg hover:opacity-90 transition z-30"
            onClick={onClick}
            aria-label="Previous"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <ArrowLeftOutlined style={{ fontSize: "20px" }} />
        </motion.button>
    );
};

const FeaturedCars = () => {
    const { data: cars, isLoading, isError } = useGetAllCarsQuery(undefined);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const carsArray = Array.isArray(cars?.data) ? cars?.data : [];

    if (isLoading) return <p className="text-center font-bold text-[#FF7F3E]">Loading...</p>;
    if (isError) return <p>Failed to load cars.</p>;

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

    const getRandomPreviousPrice = (currentPrice: number) => {
        return (currentPrice + Math.floor(Math.random() * 100 + 50));
    };

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
                    <div>
                        <h2 className="text-3xl font-medium text-[#D2691E] mb-2">Featured Cars</h2>
                        <p className="text-4xl font-semibold text-black mb-4">
                            Discover Our Top Picks For You Today!
                        </p>
                        <p className="text-lg font-medium text-black/80 max-w-2xl mx-auto mb-8">
                            Explore our handpicked selection of the most popular cars, offering
                            unbeatable comfort, style, and performance.
                        </p>
                    </div>

                    <div className="col-span-4 my-5">
                        {carsArray.length > 0 ? (
                            <div>
                                <div className="relative p-4 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.12)] bg-white">
                                    <Slider {...settings} className=" overflow-hidden ">
                                        {carsArray.map((car: TCar, index: number) => (
                                            <motion.div
                                                key={car._id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                                transition={{ duration: 0.8, delay: index * 0.12 }}
                                                className="px-4"
                                                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                                            >
                                                <motion.div whileHover={{ scale: 1.01 }}>
                                                    <Badge.Ribbon text={car.status} style={{ backgroundColor: '#D2691E' }}>
                                                        <Card
                                                            className="border-0 bg-gradient-to-b from-transparent to-white/60 group rounded-xl overflow-hidden transform transition-transform hover:-translate-y-1"
                                                            cover={
                                                                <div className="relative overflow-hidden">
                                                                    <img
                                                                        alt={car.name}
                                                                        className="h-[180px] w-full group-hover:scale-105 transition duration-500 ease-out object-cover"
                                                                        src={car.image}
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                                                                </div>
                                                            }
                                                        >
                                                            <Card.Meta
                                                                className="font-medium text-black"
                                                                title={<span className="text-lg font-semibold text-black">{car.name}</span>}
                                                                description={<span className="text-sm text-black/80">{`${car.description.slice(0, 60)}...`}</span>}
                                                            />
                                                            <div className="mt-3 w-full">
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <div>
                                                                        <p className="text-sm line-through text-gray-400 m-0">${getRandomPreviousPrice(car.pricePerHour)}</p>
                                                                        <p className="text-lg font-semibold text-[#D2691E] m-0">${car.pricePerHour}/hr</p>
                                                                    </div>
                                                                    <Rate disabled defaultValue={4} className="mt-2 text-yellow-400" />
                                                                </div>
                                                            </div>
                                                        </Card>

                                                        {/* Colored footer strip below card */}
                                                        <div className="mt-3 rounded-b-xl overflow-hidden">
                                                            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#D2691E] to-black text-white">
                                                                <div>
                                                                    <div className="text-sm opacity-90">Starting</div>
                                                                    <div className="text-lg font-bold">${car.pricePerHour}/hr</div>
                                                                </div>
                                                                <Link to="/cars" className="inline-block bg-[#D2691E] hover:bg-[#a8581a] px-4 py-2 rounded-lg transition text-white">Show More</Link>
                                                            </div>
                                                        </div>
                                                    </Badge.Ribbon>
                                                </motion.div>
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
