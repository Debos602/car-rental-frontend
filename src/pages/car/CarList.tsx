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
        <div className="bg-[#FFF6E9]" ref={ref}>
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
                                                <Link to={`/car-details/${car._id}`}  >
                                                    Car Details
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
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
