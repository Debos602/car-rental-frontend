import { useGetAllCarsQuery } from "@/redux/feature/car/carManagement.api";
import { TCar } from "@/types/global";
import { Link } from "react-router-dom";

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

    // Filter cars based on search parameters
    const filteredCars = cars?.data?.filter((car: TCar) => {
        const matchesLocation = searchParams.location
            ? car.location === searchParams.location
            : true; // No filter if location is not specified

        // Implement additional filters based on startDate and endDate if needed
        const matchesDateRange = true; // Update this based on your date filtering logic

        return matchesLocation && matchesDateRange;
    });

    return (
        <div className="bg-[#FFF6E9]">
            <div className="container mx-auto py-16">
                <div className=" grid grid-cols-1 md:grid-cols-4 gap-6">
                    {filteredCars && filteredCars.length > 0 ? (
                        filteredCars.slice(0, 8).map((car: TCar) => (
                            <div
                                key={car._id}
                                className="relative bg-[#80C4E9] shadow-lg rounded-xl p-4 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 group"
                            >
                                <div className="absolute inset-0 bg-[#4335A7] bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl z-10 flex items-center justify-center">
                                    <Link
                                        to={`/car-details/${car._id}`}
                                        className="bg-[#FFF6E9] hover:text-[#4335A7] uppercase font-semibold text-center rounded-xl px-4 py-2 block text-[#4335A7] border-[#4335A7] hover:border-[#4335A7]  transition-all duration-300"
                                    >
                                        Book Now
                                    </Link>
                                </div>

                                <div className="relative z-0">
                                    <div className="relative">
                                        <img
                                            src={car.image}
                                            alt={car.name}
                                            className="h-48 max-w-full rounded-xl object-cover mb-4 transform transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <h2 className="text-lg font-semibold mb-2">
                                        Brand: {car.name}
                                    </h2>
                                    <p className="text-gray-500 mb-2">
                                        Price: ${car.pricePerHour} per hour
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        Description:{" "}
                                        {car.description
                                            .split(" ")
                                            .slice(0, 20)
                                            .join(" ")}
                                        ...
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        Status: {car.status}
                                    </p>
                                </div>
                            </div>
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
