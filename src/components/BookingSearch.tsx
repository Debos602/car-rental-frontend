import { Button, DatePicker, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import image from "../../src/assets/about.png";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const { Option } = Select;

interface BookingSearchProps {
    onSearch: (location: string, startDate: string, endDate: string) => void;
}

const BookingSearch: React.FC<BookingSearchProps> = ({ onSearch }) => {
    const [location, setLocation] = useState("");
    const [startTime, setPickUpDate] = useState<Dayjs | null>(null);
    const [endTime, setReturnDate] = useState<Dayjs | null>(null);

    const locations = [
        "Dhaka",
        "Chittagong",
        "Comilla",
        "Barisal",
        "Rajshahi",
        "Rangpur",
        "Cox's Bazar",
        "Sylhet",
    ];

    const handleSearch = () => {
        const startD = startTime ? startTime.format("YYYY-MM-DD") : "";
        const endD = endTime ? endTime.format("YYYY-MM-DD") : "";
        onSearch(location, startD, endD);
    };

    // In-view hook to trigger animation when the component is in view
    const { ref, inView } = useInView({
        triggerOnce: true, // Trigger animation only once
        threshold: 0.1, // Trigger when 10% of the component is in view
    });

    return (
        <div
            className="relative z-10 mt-[82px] md:mt-[102px] h-[calc(100vh-134px)] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${image})` }}
        >
            <div
                ref={ref} // Attach the reference to the element
                className="absolute inset-0 flex flex-col justify-center items-center z-20 text-[#FFF6E9] bg-[#4335A7] bg-opacity-30 w-[300px] h-[350px]  md:w-[800px] md:h-[300px] lg:w-[900px] lg:h-[350px] mx-auto my-auto border-2 rounded-xl"
            >
                <motion.h1
                    className="text-3xl md:text-4xl font-bold my-3"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                        opacity: inView ? 1 : 0,
                        y: inView ? 0 : 50,
                    }}
                    transition={{ duration: 1 }}
                >
                    Bookings
                </motion.h1>

                <motion.div
                    className="w-full max-w-2xl px-4 mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: inView ? 1 : 0,
                        scale: inView ? 1 : 0.8,
                    }}
                    transition={{ duration: 1 }}
                >
                    <div className="bg-white text-[#4335A7] text-center rounded-xl p-6 shadow-lg md:flex items-center justify-between gap-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3"> <Select
                            placeholder="Select your location"
                            size="large"
                            className="flex-grow"
                            onChange={setLocation}
                            value={location}
                            style={{ width: "100%" }}
                        >
                            {locations.map((loc) => (
                                <Option key={loc} value={loc}>
                                    {loc}
                                </Option>
                            ))}
                        </Select>

                            <DatePicker
                                size="large"
                                placeholder="Pick-up Date"
                                className="flex-grow"
                                format="YYYY-MM-DD"
                                onChange={(date) => setPickUpDate(date)}
                                disabledDate={(currentDate) =>
                                    currentDate &&
                                    currentDate < dayjs().endOf("day")
                                }
                            />

                            <DatePicker
                                size="large"
                                placeholder="Return Date"
                                className="flex-grow"
                                format="YYYY-MM-DD"
                                onChange={(date) => setReturnDate(date)}
                                disabledDate={(currentDate) =>
                                    currentDate &&
                                    currentDate < dayjs().endOf("day")
                                }
                            /></div>

                        <Button
                            size="large"
                            className="bg-[#4335A7] mt-2 md:mt-0 rounded-xl border-2 hover:bg-white text-white px-8 py-4 shadow-lg"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingSearch;
