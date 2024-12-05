import CustomSection from "@/components/CustomSection";
import image1 from "../../assets/about.png";
import { useGetCarByIdQuery } from "@/redux/feature/car/carManagement.api";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Rate } from "antd";
import { useCreateBookingMutation } from "@/redux/feature/booking/bookingApi";
import { TCar } from "@/types/global";
import { toast } from "sonner";
import { motion } from "framer-motion";

type ExtraOption = "insurance" | "gps" | "childSeat";

const CarDetails = () => {
    const { id } = useParams();
    const { data: car, isLoading, error } = useGetCarByIdQuery(id);
    const [createBooking] = useCreateBookingMutation();
    const navigate = useNavigate();

    const [selectedExtras, setSelectedExtras] = useState<{
        insurance: boolean;
        gps: boolean;
        childSeat: boolean;
    }>({
        insurance: false,
        gps: false,
        childSeat: false,
    });

    const handleBookNow = async (car: TCar) => {
        const startTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const bookingData = {
            carId: car._id,
            date: new Date().toISOString(),
            startTime: startTime,
        };

        try {
            await createBooking(bookingData).unwrap();
            toast.success("Booking created successfully");
            navigate("/bookings", { replace: true });
        } catch (error) {
            console.error("Failed to create booking:", error);
        }
    };

    if (isLoading) {
        return <div>Loading car details...</div>;
    }

    if (error || !car) {
        return <div>Failed to load car details</div>;
    }

    const {
        image,
        name,
        description,
        pricePerHour,
        features = [],
        status = "Available",
        rating,
    } = car.data;

    const handleExtraChange = (extra: ExtraOption) => {
        setSelectedExtras((prev) => ({
            ...prev,
            [extra]: !prev[extra],
        }));
    };

    return (
        <div>
            <CustomSection
                image={image1}
                title="Car Details"
                paragraph="Learn more about our company, our team, and our commitment to excellence."
            />
            <div className="container mx-auto">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Car Image */}
                    <motion.div
                        className="border-2 border-[#4335A7] p-4 h-full flex items-center justify-center rounded-xl bg-[#FFF6E9]"
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Zoom>
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </Zoom>
                    </motion.div>

                    {/* Car Details */}
                    <motion.div
                        className="border-2 border-[#80C4E9] p-4 bg-gradient-to-b from-[#80C4E9] to-[#FFF6E9] rounded-xl"
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-2xl font-bold text-[#4335A7]">{name}</h2>
                        <p className="text-lg mt-2">{description}</p>
                        <p className="mt-4">
                            <span className="font-semibold">Price per Hour:</span> ${pricePerHour}
                        </p>
                        <p className="mt-2">
                            <span className="font-semibold">Status:</span> {status}
                        </p>
                        <div>
                            <span className="font-semibold">Ratings: </span>
                            <Rate
                                className="text-[#FF7F3E]"
                                defaultValue={rating}
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold">Features:</h3>
                            <ul className="list-disc list-inside">
                                {features.length > 0 ? (
                                    features.map((feature: string, index: number) => (
                                        <li key={index}>{feature}</li>
                                    ))
                                ) : (
                                    <li>No additional features available.</li>
                                )}
                            </ul>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-semibold">Choose Extras:</h3>
                            <div className="flex flex-row items-center gap-4">
                                <label className="flex  items-center ">
                                    <input
                                        type="checkbox"
                                        checked={selectedExtras.insurance}
                                        onChange={() => handleExtraChange("insurance")}
                                    />
                                    <p className="ml-2 mt-3">Insurance</p>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedExtras.gps}
                                        onChange={() => handleExtraChange("gps")}
                                    />
                                    <p className="ml-2 mt-3"> GPS</p>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedExtras.childSeat}
                                        onChange={() => handleExtraChange("childSeat")}
                                    />
                                    <p className="ml-2 mt-3"> Child Seat</p>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <Link
                                onClick={(e) => {
                                    if (status === "unavailable") {
                                        e.preventDefault();
                                    } else {
                                        handleBookNow(car.data);
                                    }
                                }}
                                to={status === "available" ? `/bookings` : "#"}
                                className={`mt-6 inline-block text-white hover:bg-white border-2 border-black hover:text-black uppercase px-6 py-2 rounded-xl ${status === "unavailable"
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#4335A7] hover:bg-[#80C4E9]"
                                    }`}
                            >
                                {status === "unavailable" ? "Unavailable" : "Book Now"}
                            </Link>
                            <Link
                                to="/bookings"
                                className="mt-6 rounded-xl bg-white hover:bg-[#4335A7] uppercase px-3 py-2 text-black hover:text-white border-2 border-black"
                            >
                                Cancel Booking
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

        </div>
    );
};

export default CarDetails;
