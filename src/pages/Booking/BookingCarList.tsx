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
                                initial={{ opacity: 0, y: 30 }}
                                animate={
                                    inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                                }
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}

                            >
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
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
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

                                        {/* Colored footer strip below card */}
                                        <div className="mt-3 rounded-b-xl overflow-hidden">
                                            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#D2691E] to-black text-white">
                                                <div>
                                                    <div className="text-sm opacity-90">Starting</div>
                                                    <div className="text-lg font-bold">${car.pricePerHour}/hr</div>
                                                </div>
                                                <Link to={`/car-details/${car._id}`} className="inline-block bg-[#D2691E] hover:bg-[#a8581a] px-4 py-2 rounded-lg transition text-white">Show More</Link>
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
