import { useState, useEffect } from "react";
import { useGetAllCarsQuery } from "@/redux/feature/car/carManagement.api";
import { TCar } from "@/types/global";
import { Select, Button, Form, Input, Space, Card, Rate, Badge } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { useInView } from "react-intersection-observer";
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
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const [filteredCars, setFilteredCars] = useState<TCar[] | undefined>(cars?.data);
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

                return matchesLocation && matchesPickUpDate && matchesReturnDate;
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
    const getRandomPreviousPrice = (currentPrice: number) => {
        return (currentPrice + Math.floor(Math.random() * 100 + 50));
    };

    return (
        <div data-theme="light" className="bg-[#FFF6E9]" ref={ref}>
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
                        <Form.Item
                            name="location"
                            label={<span className="text-[#4335A7] font-semibold text-base">Location</span>}
                        >
                            <Input
                                placeholder="Enter location"
                                className="text-[#4335A7] placeholder:text-[#4335A7] border border-[#4335A7]"
                            />
                        </Form.Item>

                        {/* Other Filters */}
                        <Form.Item
                            name="carName"
                            label={<span className="text-[#4335A7] font-semibold text-base">Car Name</span>}
                            className="rouned-xl"
                        >
                            <Select
                                placeholder="Select car name"
                                allowClear
                                className="text-[#4335A7] border border-[#4335A7] rounded-[8px]"
                                dropdownStyle={{ color: '#4335A7' }}
                            >
                                {cars?.data.map((car: TCar) => (
                                    <Select.Option key={car._id} value={car.name}>
                                        {car.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="color"
                            label={<span className="text-[#4335A7] font-semibold text-base">Color</span>}
                            className="text-[#4335A7]"
                        >
                            <Select
                                placeholder="Select color"
                                allowClear
                                className="text-[#4335A7] border border-[#4335A7] rounded-[8px]"
                                dropdownStyle={{ color: '#4335A7' }}
                            >
                                {Array.from(
                                    new Set(cars?.data.map((car: TCar) => car.color))
                                ).map((color) => (
                                    <Select.Option key={String(color)} value={color}>
                                        {String(color)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Price Range */}
                        <Form.Item
                            name="pricePerHour"
                            label={<span className="text-[#4335A7] font-semibold text-base">Price Range</span>}
                        >
                            <Space.Compact>
                                <Form.Item name={["pricePerHour", 0]} noStyle>
                                    <Input
                                        placeholder="Min"
                                        min={0}
                                        className="mr-2 text-[#4335A7] border border-[#4335A7] placeholder:text-[#4335A7]"
                                    />
                                </Form.Item>
                                <Form.Item name={["pricePerHour", 1]} noStyle>
                                    <Input
                                        placeholder="Max"
                                        min={0}
                                        className="text-[#4335A7] border border-[#4335A7] placeholder:text-[#4335A7]"
                                    />
                                </Form.Item>
                            </Space.Compact>
                        </Form.Item>

                        <div className="md:flex items-center">
                            <Button
                                htmlType="submit"
                                className="bg-[#4335A7] text-white border-2 border-[#4335A7] hover:bg-white hover:text-[#4335A7] mr-2"
                            >
                                Apply Filters
                            </Button>
                            <Button
                                onClick={handleClearFilters}
                                className="bg-[#4335A7] text-white border-2 border-[#4335A7] hover:bg-white hover:text-[#4335A7]"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </Form>


                    {/* Cards Section */}
                    <div className="col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredCars?.map((car, index) => (
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
                                        className="border-0 bg-gradient-to-b from-transparent to-black/10 shadow-2xl group rounded-xl overflow-hidden transform transition-transform hover:-translate-y-1"
                                        cover={
                                            <div className="relative overflow-hidden">
                                                <img
                                                    alt={car.name}
                                                    className="h-[150px] w-full group-hover:scale-105 transition duration-300 object-cover"
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
                                            <div className="flex justify-between items-center gap-4">
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
                                            <Link to={`/car-details/${car._id}`} className="inline-block bg-[#D2691E] hover:bg-[#a8581a] px-4 py-2 rounded-lg transition text-white">Car Details</Link>
                                        </div>
                                    </div>
                                </Badge.Ribbon>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarList;
