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
                                        className="h-full bg-gradient-to-b from-white via-amber-50 to-orange-50 shadow-[0_12px_28px_rgba(67,28,16,0.12)] group rounded-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(67,28,16,0.18)] border border-orange-100"
                                        cover={
                                            <div className="relative overflow-hidden h-44 sm:h-48">
                                                <img
                                                    alt={car.name}
                                                    className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                                                    src={car.image}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"></div>

                                                <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white/85 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                                                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-600">{car.year}</span>
                                                </div>

                                                <div className="absolute right-3 top-3">
                                                    <div className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                                        {car.seats} Seats
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 shadow-sm">
                                                    <span className="text-[10px] font-semibold text-gray-700">{car.fuelType}</span>
                                                </div>
                                            </div>
                                        }
                                        styles={{ body: { padding: '14px 14px 12px' } }}
                                    >
                                        <div className="h-full flex flex-col">
                                            <div className="mb-3 flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-base font-bold text-gray-900 transition-colors group-hover:text-chocolate">
                                                        {car.name}
                                                    </h3>
                                                    <p className="mt-1 truncate text-[11px] text-gray-500">
                                                        {car.brand} • {car.model}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">
                                                    <span>★</span>
                                                    <span>{Number(car.rating) || 4.8}</span>
                                                </div>
                                            </div>

                                            <p className="mb-3 flex-grow text-[12px] leading-5 text-gray-600">
                                                {(car.description || '').slice(0, 86)}{(car.description || '').length > 86 ? '...' : ''}
                                            </p>

                                            <div className="mt-auto space-y-3">
                                                <div className="flex items-end justify-between gap-3">
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-medium text-gray-400 line-through">
                                                            ${getRandomPreviousPrice(car.pricePerHour)}
                                                        </p>
                                                        <p className="text-2xl font-black leading-none text-chocolate">
                                                            ${car.pricePerHour}
                                                            <span className="ml-1 text-[11px] font-semibold text-gray-600">/hr</span>
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-1">
                                                        <div
                                                            className="h-3 w-3 rounded-full border border-gray-300"
                                                            style={{ backgroundColor: car.color }}
                                                        ></div>
                                                        <span className="text-[10px] font-medium text-gray-700">{car.color}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-orange-100 pt-3">
                                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                        <span className="rounded-full bg-stone-100 px-2 py-1">{car.seats} seats</span>
                                                        <span className="rounded-full bg-stone-100 px-2 py-1">{car.transmission || 'Auto'}</span>
                                                    </div>

                                                    <Link
                                                        to={`/car-details/${car._id}`}
                                                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-chocolate to-amber-800 px-4 py-2 text-[11px] font-bold text-white shadow-md shadow-orange-200 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg hover:shadow-orange-200"
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
