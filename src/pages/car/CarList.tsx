import { useState, useEffect } from "react";
import { useGetAllCarsQuery } from "@/redux/feature/car/carManagement.api";
import { TCar } from "@/types/global";
import { Select, Button, Form, Input, Space } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

// Define the type for the form values
interface IFilterValues {
    carName?: string;
    color?: string;
    pricePerHour?: [number, number]; // Array to hold the price range
    location?: string;
    pickUpDate?: Dayjs;
    returnDate?: Dayjs;
}

const CarList = () => {
    const { data: cars } = useGetAllCarsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    console.log(cars);
    const [filteredCars, setFilteredCars] = useState<TCar[] | undefined>(
        cars?.data
    );
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (cars?.data) {
            const location = searchParams.get("location");
            const pickUpDate = searchParams.get("pickUpDate");
            const returnDate = searchParams.get("returnDate");

            // Apply location and date filters from query parameters
            const filteredData = cars.data.filter((car: TCar) => {
                const carLocation = car.location ?? ""; // Handle undefined location

                const matchesLocation = location
                    ? carLocation.toLowerCase().includes(location.toLowerCase())
                    : true;
                const matchesPickUpDate = pickUpDate
                    ? dayjs(car.availableFrom).isBefore(dayjs(pickUpDate))
                    : true;
                const matchesReturnDate = returnDate
                    ? dayjs(car.availableUntil).isAfter(dayjs(returnDate))
                    : true;

                return (
                    matchesLocation && matchesPickUpDate && matchesReturnDate
                );
            });

            setFilteredCars(filteredData);
        }
    }, [cars, searchParams]);

    // Handle filtering logic
    const handleFilter = (values: IFilterValues) => {
        const {
            carName,
            color,
            pricePerHour,
            location,
            pickUpDate,
            returnDate,
        } = values;

        const filteredData = cars?.data.filter((car: TCar) => {
            const matchesName = carName
                ? car.name.toLowerCase().includes(carName.toLowerCase())
                : true;
            const matchesColor = color ? car?.color === color : true;
            const matchesPrice = pricePerHour
                ? car.pricePerHour >= pricePerHour[0] &&
                  car.pricePerHour <= pricePerHour[1]
                : true;
            const matchesLocation = location
                ? car.location?.toLowerCase().includes(location.toLowerCase())
                : true;
            const matchesPickUpDate = pickUpDate
                ? dayjs(car.availableFrom).isBefore(pickUpDate)
                : true;
            const matchesReturnDate = returnDate
                ? dayjs(car.availableUntil).isAfter(returnDate)
                : true;

            return (
                matchesName &&
                matchesColor &&
                matchesPrice &&
                matchesLocation &&
                matchesPickUpDate &&
                matchesReturnDate
            );
        });

        setFilteredCars(filteredData);
    };

    // Reset filters and show all cars
    const handleClearFilters = () => {
        form.resetFields(); // Reset the form fields
        setFilteredCars(cars?.data); // Reset the filtered data to show all cars
    };

    return (
        <div className="bg-gray-200">
            <div className="container mx-auto py-16">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Filters Section */}
                    <Form
                        form={form}
                        onFinish={handleFilter}
                        layout="vertical"
                        className="mb-5"
                    >
                        {/* Search Bar Inputs */}
                        <Form.Item name="location" label="Location">
                            <Input placeholder="Enter location" />
                        </Form.Item>

                        {/* Other Filters */}
                        <Form.Item name="carName" label="Car Name">
                            <Select placeholder="Select car name" allowClear>
                                {cars?.data.map((car: TCar) => (
                                    <Select.Option
                                        key={car._id}
                                        value={car.name}
                                    >
                                        {car.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="color" label="Color">
                            <Select placeholder="Select color" allowClear>
                                {Array.from(
                                    new Set(
                                        cars?.data.map((car: TCar) => car.color)
                                    )
                                ).map((color) => (
                                    <Select.Option
                                        key={String(color)}
                                        value={color}
                                    >
                                        {String(color)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Price Range */}
                        <Form.Item name="pricePerHour" label="Price Range">
                            <Space.Compact>
                                <Form.Item name={["pricePerHour", 0]} noStyle>
                                    <Input
                                        placeholder="Min"
                                        min={0}
                                        className="mr-2"
                                    />
                                </Form.Item>
                                <Form.Item name={["pricePerHour", 1]} noStyle>
                                    <Input placeholder="Max" min={0} />
                                </Form.Item>
                            </Space.Compact>
                        </Form.Item>

                        <div className="md:flex items-center">
                            <Button
                                htmlType="submit"
                                className="bg-black text-white border-2 border-black hover:bg-white hover:text-black mr-2"
                            >
                                Apply Filters
                            </Button>
                            <Button
                                onClick={handleClearFilters}
                                className="bg-black text-white border-2 border-black hover:bg-white hover:text-black"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </Form>

                    {/* Cards Section */}
                    <div className="col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredCars?.map((car) => (
                            <div
                                key={car._id}
                                className="relative from-amber-200 to-amber-50 bg-gradient-to-b shadow-lg rounded-xl p-4 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 group"
                            >
                                {/* Hover Overlay for full card and image */}
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl z-10 flex items-center justify-center">
                                    <Link
                                        to={`/car-details/${car._id}`}
                                        className="bg-white hover:text-black uppercase font-semibold text-center rounded-xl px-4 py-2 block text-black border-2 border-transparent hover:border-black transition-all duration-300"
                                    >
                                        View Details
                                    </Link>
                                </div>

                                <div className="relative z-0">
                                    <div className="relative">
                                        <img
                                            src={car.image}
                                            alt={car.name}
                                            className="h-48 w-full rounded-xl object-cover mb-4 transform transition-transform duration-300 group-hover:scale-105"
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
                                        {car.description.slice(0, 50)}...
                                    </p>
                                    <p className="text-gray-600 mb-4">
                                        Status: {car.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarList;
