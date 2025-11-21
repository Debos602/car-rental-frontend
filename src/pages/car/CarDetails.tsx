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
        status = "available",
    } = car.data;
    const isAvailable = String(status).toLowerCase() === "available";
    console.log(car.data);

    const handleExtraChange = (extra: ExtraOption) => {
        setSelectedExtras((prev) => ({
            ...prev,
            [extra]: !prev[extra],
        }));
    };
    const rating = 4.5;

    return (
        <div data-theme="light">
            <CustomSection
                image={image1}
                title="Car Details"
                paragraph="Learn more about our company, our team, and our commitment to excellence."
            />
            <div className="container mx-auto py-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Car Image */}
                    <motion.div
                        className="border border-black/10 p-4 h-full flex items-center justify-center rounded-xl bg-black"
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Zoom>
                            <img
                                src={image}
                                alt={name}
                                className="max-w-full max-h-[520px] object-contain rounded-lg shadow-lg"
                            />
                        </Zoom>
                    </motion.div>

                    {/* Car Details */}
                    <motion.div
                        className="shadow-xl p-6 border border-gray-200 rounded-xl bg-white"
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-2xl font-bold text-black">{name}</h2>
                        <p className="text-md mt-2 text-gray-700">{description?.slice(0, 220)}</p>
                        <div className="flex items-center gap-4">
                            <p>
                                <span className="font-semibold text-sm">Price per Hour:</span>
                                <span className="block text-xl font-bold text-[#D2691E]">${Number(pricePerHour).toFixed(2)}</span>
                            </p>
                            <p>
                                <span className="font-semibold text-sm">Status:</span>
                                <span className={`block text-sm font-medium ${isAvailable ? "text-green-600" : "text-red-600"}`}>{String(status).toUpperCase()}</span>
                            </p>
                        </div>

                        <div className="mt-4">
                            <p className="font-semibold">Features:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-700">
                                {features.length > 0 ? (
                                    features.map((feature: string, index: number) => (
                                        <li className="mt-1" key={index}>{feature}</li>
                                    ))
                                ) : (
                                    <li className="mt-1">No additional features available.</li>
                                )}
                            </ul>

                            <div className="mt-4 flex items-center gap-3">
                                <span className="font-semibold">Ratings:</span>
                                <Rate value={rating} disabled className="text-[#D2691E]" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="font-semibold mb-2">Choose Extras:</p>
                            <div className="flex flex-row items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedExtras.insurance}
                                        onChange={() => handleExtraChange("insurance")}
                                    />
                                    <span className="text-sm text-gray-700">Insurance</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedExtras.gps}
                                        onChange={() => handleExtraChange("gps")}
                                    />
                                    <span className="text-sm text-gray-700">GPS</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedExtras.childSeat}
                                        onChange={() => handleExtraChange("childSeat")}
                                    />
                                    <span className="text-sm text-gray-700">Child Seat</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Link
                                onClick={(e) => {
                                    if (!isAvailable) {
                                        e.preventDefault();
                                    } else {
                                        handleBookNow(car.data);
                                    }
                                }}
                                to={isAvailable ? `/bookings` : `#`}
                                className={`mt-2 inline-block text-white uppercase px-6 py-3 rounded-lg shadow-md ${!isAvailable ? "bg-gray-400 cursor-not-allowed" : "bg-[#D2691E] hover:bg-[#a9572d]"}`}
                            >
                                {isAvailable ? "Book Now" : "Unavailable"}
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

        </div>
    );
};

export default CarDetails;
