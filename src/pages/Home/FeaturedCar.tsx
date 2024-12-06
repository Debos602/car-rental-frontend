import { useGetAllCarsQuery } from "@/redux/feature/car/carManagement.api";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Slider, { CustomArrowProps } from "react-slick";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TCar } from "@/types/global";

// Custom Next Arrow
const NextArrow = (props: CustomArrowProps) => {
    const { onClick } = props;
    return (
        <motion.button
            className="absolute right-6 top-[48%] transform -translate-y-1/2 bg-gradient-to-r from-[#80C4E9] to-transparent text-white p-4 rounded-full shadow-lg hover:bg-opacity-70 transition z-30"
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
            className="absolute left-6 top-[48%] transform -translate-y-1/2 bg-gradient-to-l from-[#80C4E9] to-transparent text-white p-4 rounded-full shadow-lg hover:bg-opacity-70 transition z-30"
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
        autoplay: true,
        autoplaySpeed: 2000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
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

                    <div className="col-span-4">
                        {carsArray.length > 0 ? (
                            <div className="relative">
                                <Slider {...settings} className="rounded-xl overflow-hidden">
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
                                            className="px-3"
                                        >
                                            <Card
                                                className="relative shadow-lg rounded-xl overflow-hidden transform transition-transform border-2 border-[#4335A7]"
                                                cover={
                                                    <div className="relative">
                                                        <img
                                                            alt={car.name}
                                                            className="h-[220px] max-h-full w-full object-cover rounded-t-xl"
                                                            src={car.image}
                                                        />
                                                        <div className="absolute inset-0 bg-black opacity-60"></div>
                                                    </div>
                                                }
                                            >
                                                <Card.Meta
                                                    className="font-medium text-[#0f2e3f]"
                                                    title={car.name}
                                                    description={`Description: ${car.description.slice(
                                                        0,
                                                        50
                                                    )}...`}
                                                />
                                                <p className="text-lg font-semibold text-[#FF7F3E] mt-4">
                                                    Price per hour: ${car.pricePerHour}
                                                </p>
                                            </Card>
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



