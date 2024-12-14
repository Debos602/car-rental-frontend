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
            className="absolute right-6 top-[50%] transform -translate-y-1/2 bg-gradient-to-r from-[#4335A7] to-transparent text-white p-2 rounded-full shadow-lg hover:bg-opacity-70 transition z-30"
            onClick={onClick}
            aria-label="Next"
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
            className="absolute left-6 top-[50%] transform -translate-y-1/2 bg-gradient-to-l from-[#4335A7] to-transparent text-white p-2 rounded-full shadow-lg hover:bg-opacity-70 transition z-30"
            onClick={onClick}
            aria-label="Previous"
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
        <div className="bg-[#FFF6E9]" ref={ref}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1 }}
                className="container mx-auto py-20"
            >
                <div className="grid grid-cols-1 md:grid-cols-5">
                    <div>
                        <h2 className="text-3xl font-medium text-[#FF7F3E] mb-2">Featured Cars</h2>
                        <p className="text-4xl font-semibold text-[#4335A7] mb-4">
                            Discover Our Top Picks For You Today!
                        </p>
                        <p className="text-lg font-medium text-[#0f2e3f] max-w-2xl mx-auto mb-8">
                            Explore our handpicked selection of the most popular cars, offering
                            unbeatable comfort, style, and performance.
                        </p>
                    </div>

                    <div className="col-span-4 my-5">
                        {carsArray.length > 0 ? (
                            <div>
                                <Slider {...settings} className=" overflow-hidden ">
                                    {carsArray.map((car: TCar, index: number) => (
                                        <motion.div
                                            key={car._id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={
                                                inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                                            }
                                            transition={{
                                                duration: 0.8,
                                                delay: index * 0.2,
                                            }}
                                            className="px-4 "
                                        >
                                            <Badge.Ribbon text={car.status} color={car.status === 'available' ? "green" : "red"}>
                                                <Card
                                                    className="border shadow-lg  group rounded-xl  overflow-hidden transform transition-transform"
                                                    cover={
                                                        <div className="">
                                                            <img
                                                                alt={car.name}
                                                                className="h-[150px] max-h-full w-full group-hover:scale-105 transition duration-300 object-cover"
                                                                src={car.image}
                                                            />

                                                        </div>
                                                    }
                                                >
                                                    <Card.Meta
                                                        className="font-medium text-[#0f2e3f]"
                                                        title={car.name}
                                                        description={` ${car.description.slice(
                                                            0,
                                                            50
                                                        )}...`}
                                                    />
                                                    <div className="mt-2 w-full">
                                                        <div className="flex justify-start items-center gap-6">
                                                            <p className="text-lg font-semibold text-[#FF7F3E] m-0">
                                                                Price: ${car.pricePerHour}
                                                            </p>
                                                            <p className="text-sm line-through text-gray-500 m-0">
                                                                ${getRandomPreviousPrice(car.pricePerHour)}
                                                            </p>
                                                        </div>
                                                        <Rate disabled defaultValue={4} className="mt-2" />
                                                        <div className="w-full mt-4 text-end">
                                                            <Link to="/cars" className="mt-4 w-full py-2 px-4 rounded-xl bg-[#4335A7] text-white hover:bg-white border hover:border-[#4335A7] transition">
                                                                Show More
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Badge.Ribbon>
                                        </motion.div>
                                    ))}
                                </Slider>
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
