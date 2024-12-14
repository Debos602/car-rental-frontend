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
        <div className="bg-[#FFF6E9]" ref={ref}>
            <div className="container mx-auto py-12">
                <div className=" grid grid-cols-1 md:grid-cols-4 gap-8">
                    {filteredCars && filteredCars.length > 0 ? (
                        filteredCars.slice(0, 8).map((car: TCar, index: number) => (
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

                            >
                                <Badge.Ribbon text={car.status} color={car.status === 'available' ? "green" : "red"}>
                                    <Card
                                        className="border shadow-lg group rounded-xl  overflow-hidden transform transition-transform"
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
                                                <Link to={`/car-details/${car._id}`} className="relative z-20 mt-4 w-full py-2 px-4 rounded-xl bg-[#FF7F3E] text-white hover:bg-[#e06c2e] transition">
                                                    View Details
                                                </Link>
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
        </div>
    );
};

export default BookingCarList;
