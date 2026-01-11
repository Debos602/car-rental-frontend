import { useGetAllCarsQuery } from "@/redux/feature/car/carManagement.api";
import { TCar } from "@/types/global";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge, Card, Rate } from "antd";
interface BookingCarListProps {
    searchParams: {
        location: string;
        startDate: string;
        endDate: string;
    };
}

const BookingCarList = ({ searchParams }: BookingCarListProps) => {
    const { data: cars } = useGetAllCarsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    // Filter cars based on search parameters
    const filteredCars = cars?.data?.filter((car: TCar) => {
        const matchesLocation = searchParams.location
            ? car.location === searchParams.location
            : true; // No filter if location is not specified

        // Implement additional filters based on startDate and endDate if needed
        const matchesDateRange = true; // Update this based on your date filtering logic

        return matchesLocation && matchesDateRange;
    });
    const getRandomPreviousPrice = (currentPrice: number) => {
        return (currentPrice + Math.floor(Math.random() * 100 + 50));
    };

    return (
        <div data-theme="light" className="bg-white/10" ref={ref}>
            <div className="container mx-auto py-12">
                <div className=" grid grid-cols-1 md:grid-cols-4 gap-8">
                    {filteredCars && filteredCars.length > 0 ? (
                        filteredCars.slice(0, 8).map((car: TCar, index: number) => (
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
                                    color="#7c2d12"
                                    className="text-xs"
                                    style={{ fontSize: '10px', padding: '0 8px', height: '20px', lineHeight: '20px' }}
                                >
                                    <Card
                                        className="h-full bg-gradient-to-b from-white to-amber-50 shadow-lg group rounded-lg overflow-hidden transform transition-all duration-200 hover:shadow-xl border border-gray-100"
                                        cover={
                                            <div className="relative overflow-hidden h-36 sm:h-40">
                                                <img
                                                    alt={car.name}
                                                    className="h-full w-full object-cover group-hover:scale-105 transition duration-400"
                                                    src={car.image}
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

                                            <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-grow-0">
                                                {(car.description || '').slice(0, 80)}...
                                            </p>

                                            <div className="space-y-2 mt-auto">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs line-through text-gray-400 mb-0.5">
                                                            ${getRandomPreviousPrice(car.pricePerHour)}
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
                                                            ></div>
                                                            <span className="text-gray-600 text-xs">{car.color}</span>
                                                        </div>
                                                        <span className="text-gray-600 text-xs">•</span>
                                                        <span className="text-gray-600 text-xs">{car.fuelType}</span>
                                                    </div>
                                                    <Link
                                                        to={`/car-details/${car._id}`}
                                                        className="bg-gradient-to-r from-chocolate to-amber-800 hover:from-amber-800 hover:to-chocolate text-white px-6 py-3 rounded-md font-semibold transition-all duration-200 transform hover:scale-105 shadow hover:shadow-md text-xs"
                                                    >
                                                        Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Badge.Ribbon>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-lg font-semibold py-14">
                            No cars found for the selected criteria.
                        </p>
                    )}
                </div>
            </div>
        </div >
    );
};

export default BookingCarList;
