import CustomSection from "@/components/CustomSection";
import image1 from "../../assets/about.png";
import { useGetCarByIdQuery } from "@/redux/feature/car/carManagement.api";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { useCreateBookingMutation } from "@/redux/feature/booking/bookingApi";
import { TCar } from "@/types/global";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Calendar, Clock, Shield, Navigation, Baby } from "lucide-react";

import CarGallery from "./components/CarGallery";
import CarInfo from "./components/CarInfo";
import BookingButton from "./components/BookingButton";

type ExtraOption = "insurance" | "gps" | "childSeat";

const CarDetails = () => {
    const { id } = useParams<{ id: string; }>();
    const { data: car, isLoading, error } = useGetCarByIdQuery(id);
    const statusFromQuery = car?.data?.status ?? "available";
    const isAvailable = String(statusFromQuery).toLowerCase() === "available";
    const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();
    const navigate = useNavigate();

    const [selectedExtras, setSelectedExtras] = useState<{ insurance: boolean; gps: boolean; childSeat: boolean; }>({
        insurance: false,
        gps: false,
        childSeat: false,
    });

    const [bookingDate, setBookingDate] = useState<string>("");
    const [startTimeInput, setStartTimeInput] = useState<string>("");
    const [endTimeInput, setEndTimeInput] = useState<string>("");
    const [showModal, setShowModal] = useState(false);

    const handleExtraChange = useCallback((extra: ExtraOption) => {
        setSelectedExtras((prev) => ({ ...prev, [extra]: !prev[extra] }));
    }, []);

    const calculateTotalCost = useCallback(() => {
        if (!car?.data?.pricePerHour || !bookingDate || !startTimeInput || !endTimeInput) return 0;

        const startDateTime = new Date(`${bookingDate}T${startTimeInput}`);
        const endDateTime = new Date(`${bookingDate}T${endTimeInput}`);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) return 0;

        const msDiff = endDateTime.getTime() - startDateTime.getTime();
        const hours = Math.max(1, Math.ceil(msDiff / (1000 * 60 * 60)));

        let baseCost = car.data.pricePerHour * hours;
        let extrasCost = 0;

        if (selectedExtras.insurance) extrasCost += 15 * hours;
        if (selectedExtras.gps) extrasCost += 5 * hours;
        if (selectedExtras.childSeat) extrasCost += 10 * hours;

        return baseCost + extrasCost;
    }, [car, bookingDate, startTimeInput, endTimeInput, selectedExtras]);

    const handleBookNow = useCallback(async () => {
        if (!car?.data) return;

        const startDateTime = new Date(`${bookingDate}T${startTimeInput}`);
        const endDateTime = new Date(`${bookingDate}T${endTimeInput}`);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
            toast.error("Please provide a valid date and times");
            return;
        }

        if (endDateTime <= startDateTime) {
            toast.error("End time must be after start time");
            return;
        }

        const currentDate = new Date();
        if (startDateTime < currentDate) {
            toast.error("Booking date and time must be in the future");
            return;
        }

        const totalCost = calculateTotalCost();

        const bookingData = {
            carId: car.data._id,
            date: bookingDate,
            startTime: startTimeInput,
            endTime: endTimeInput,
            extras: selectedExtras,
            totalCost: totalCost,
        } as const;

        try {
            await createBooking(bookingData).unwrap();
            toast.success("Booking created successfully!");
            navigate("/bookings", { replace: true });
        } catch (err) {
            toast.error("Failed to create booking. Please try again.");
            console.error("Failed to create booking:", err);
        }
    }, [createBooking, navigate, car, selectedExtras, bookingDate, startTimeInput, endTimeInput, calculateTotalCost]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4 py-12">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="h-[400px] bg-gray-200 rounded-2xl" />
                                <div className="grid grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-24 bg-gray-200 rounded-xl" />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-8 bg-gray-200 rounded w-3/4" />
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                                    ))}
                                </div>
                                <div className="h-12 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !car) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center p-8 max-w-md">
                    <div className="text-6xl mb-4">🚗</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Car Not Found</h2>
                    <p className="text-gray-600 mb-6">The car you're looking for is unavailable or doesn't exist.</p>
                    <button
                        onClick={() => navigate("/cars")}
                        className="btn btn-primary px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                    >
                        Browse Available Cars
                    </button>
                </div>
            </div>
        );
    }

    const { image, images, name, description, pricePerHour, features = [], status = "available" } = car.data as TCar;
    const rating = 4.5;

    const today = new Date().toISOString().split('T')[0];

    return (
        <div data-theme="light" className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <CustomSection
                image={image1}
                title={name}
                paragraph="Book this premium vehicle for your next journey"
            />

            <div className="container mx-auto px-4 py-8 lg:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                >
                    {/* Left Column - Car Gallery */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6 self-start"
                    >
                        <CarGallery images={images ?? (image ? [image] : [])} name={name} />

                        {/* Features Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-2xl">✨</span> Key Features
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-gray-600">
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Booking Info */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-6"
                    >
                        <CarInfo
                            name={name}
                            description={description}
                            pricePerHour={pricePerHour}
                            status={status}
                            features={features}
                            rating={rating}
                        />

                        {/* Date & Time Selection Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Select Date & Time
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-500">Hourly Rate: ${pricePerHour}/hr</span>
                                </div>
                            </div>

                            <button
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
                                onClick={() => setShowModal(true)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <div className="text-sm text-gray-500 mb-1">Booking Schedule</div>
                                        {bookingDate && startTimeInput && endTimeInput ? (
                                            <div className="flex items-center gap-3">
                                                <div className="text-lg font-semibold text-gray-800">{bookingDate}</div>
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Clock className="w-4 h-4" />
                                                    {startTimeInput} - {endTimeInput}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                                                Click to select date and time
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-2xl group-hover:scale-110 transition-transform">📅</div>
                                </div>
                            </button>

                            {/* Extras Selection */}
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Add Extra Services</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedExtras.insurance ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => handleExtraChange('insurance')}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Shield className={`w-5 h-5 ${selectedExtras.insurance ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <span className="font-medium">Insurance</span>
                                        </div>

                                    </div>
                                    <div
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedExtras.gps ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => handleExtraChange('gps')}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Navigation className={`w-5 h-5 ${selectedExtras.gps ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <span className="font-medium">GPS</span>
                                        </div>

                                    </div>
                                    <div
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedExtras.childSeat ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => handleExtraChange('childSeat')}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Baby className={`w-5 h-5 ${selectedExtras.childSeat ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <span className="font-medium">Child Seat</span>
                                        </div>

                                    </div>
                                </div>
                            </div>


                        </div>

                        <BookingButton
                            isAvailable={isAvailable}
                            loading={bookingLoading}
                            onBook={handleBookNow}
                            isDisabled={!bookingDate || !startTimeInput || !endTimeInput}

                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Date/Time Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-800">Select Booking Details</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-gray-600 mt-2">Choose your preferred date and time slot</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        min={today}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            value={startTimeInput}
                                            onChange={(e) => setStartTimeInput(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            value={endTimeInput}
                                            onChange={(e) => setEndTimeInput(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl">
                                <div className="text-sm text-blue-800">
                                    <div className="font-semibold mb-1">Booking Duration</div>
                                    {bookingDate && startTimeInput && endTimeInput ? (
                                        <div>
                                            {Math.ceil((new Date(`${bookingDate}T${endTimeInput}`).getTime() - new Date(`${bookingDate}T${startTimeInput}`).getTime()) / (1000 * 60 * 60))} hours
                                        </div>
                                    ) : (
                                        <div>Select date and time to see duration</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                                    onClick={() => {
                                        if (!bookingDate || !startTimeInput || !endTimeInput) {
                                            toast.error("Please fill in all fields");
                                            return;
                                        }

                                        const startDateTime = new Date(`${bookingDate}T${startTimeInput}`);
                                        const endDateTime = new Date(`${bookingDate}T${endTimeInput}`);

                                        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
                                            toast.error("Please provide valid date and times");
                                            return;
                                        }

                                        if (endDateTime <= startDateTime) {
                                            toast.error("End time must be after start time");
                                            return;
                                        }

                                        const currentDate = new Date();
                                        if (startDateTime < currentDate) {
                                            toast.error("Booking must be in the future");
                                            return;
                                        }

                                        setShowModal(false);
                                        toast.success("Schedule updated!");
                                    }}
                                >
                                    Confirm Schedule
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CarDetails;