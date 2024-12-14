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
    } = car.data;
    console.log(car.data);

    const handleExtraChange = (extra: ExtraOption) => {
        setSelectedExtras((prev) => ({
            ...prev,
            [extra]: !prev[extra],
        }));
    };
    const rating = 4.5;

    return (
        <div>
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
                        className="border border-[#4335A7] border-opacity-30 p-4 h-full flex items-center justify-center rounded-xl bg-[#FFF6E9]"
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Zoom>
                            <img
                                src={image}
                                alt={name}
                                className=""
                            />
                        </Zoom>
                    </motion.div>

                    {/* Car Details */}
                    <motion.div
                        className="shadow-xl p-5 border border-[#4335A7] border-opacity-30 rounded-xl bg-[#FFF6E9]"
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-2xl font-bold text-[#4335A7]">{name}</h2>
                        <p className="text-md mt-2">{description.slice(0, 99)}</p>
                        <div className="flex items-center gap-4">
                            <p >
                                <span className="font-semibold">Price per Hour:</span> ${pricePerHour}
                            </p>
                            <p >
                                <span className="font-semibold">Status:</span> {status}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <p className="font-semibold m-0">Features:</p>
                            <ul className="list-inside">
                                {features.length > 0 ? (
                                    features.map((feature: string, index: number) => (
                                        <li className="mt-4" key={index}>{feature}</li>
                                    ))
                                ) : (
                                    <li>No additional features available.</li>
                                )}
                            </ul>
                            <>
                                <span className="font-semibold">Ratings: </span>
                                <Rate
                                    className="text-[#FF7F3E]"
                                    value={rating}
                                    disabled
                                />
                            </>
                        </div>
                        <div className=" flex items-center">
                            <p className="font-semibold m-0 me-2">Choose Extras:</p>
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
                                {status === "unavailable" ? "Unavailable" : "Add Now"}
                            </Link>

                        </div>
                    </motion.div>
                </motion.div>
            </div>

        </div>
    );
};

export default CarDetails;
