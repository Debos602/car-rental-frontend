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
    const { data: carResponse, isLoading, error } = useGetCarByIdQuery(id);

    // Check the actual structure of carResponse
    const carData = carResponse?.data as TCar | undefined;

    const [createBooking, { isLoading: bookingLoading }] = useCreateBookingMutation();
    const navigate = useNavigate();

    // Time selection
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [startHour, setStartHour] = useState<number>(8);
    const [endHour, setEndHour] = useState<number>(9);
    const [showModal, setShowModal] = useState(false);

    // Extras
    const [selectedExtras, setSelectedExtras] = useState<{
        insurance: boolean;
        gps: boolean;
        childSeat: boolean;
    }>({
        insurance: false,
        gps: false,
        childSeat: false,
    });

    const handleExtraChange = useCallback((extra: ExtraOption) => {
        setSelectedExtras((prev) => ({ ...prev, [extra]: !prev[extra] }));
    }, []);

    // Time options: 8:00 – 22:00
    const timeOptions = Array.from({ length: 15 }, (_, i) => {
        const hour = i + 8;
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayHourStr = String(displayHour).padStart(2, "0");
        const period = hour >= 12 ? "PM" : "AM";
        return {
            value: hour,
            label: `${displayHourStr}:00 ${period}`,
            militaryTime: `${hour.toString().padStart(2, '0')}:00`
        };
    });

    const formatTimeForDisplay = (hour: number): string => {
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayHourStr = String(displayHour).padStart(2, "0");
        const period = hour >= 12 ? "PM" : "AM";
        return `${displayHourStr}:00 ${period}`;
    };

    const formatDateTimeForAPI = (dateStr: string, hour: number): string => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        date.setHours(hour, 0, 0, 0);
        return date.toISOString();
    };

    // Safely extract price with fallback
    const getPricePerHour = (): number => {
        if (!carData || !carData.pricePerHour) {
            console.error("No price per hour found in car data");
            return 0;
        }

        // Treat raw price as unknown to handle unexpected shapes coming from backend
        const price: unknown = (carData as any).pricePerHour;
        console.log("Raw price value:", price, "Type:", typeof price);

        // Try different ways to extract the number
        let numericPrice: number;

        if (typeof price === 'number') {
            numericPrice = price;
        } else if (typeof price === 'string') {
            // Remove any non-numeric characters except decimal point and minus
            const cleaned = (price as string).replace(/[^\d.-]/g, '');
            numericPrice = parseFloat(cleaned);
        } else if (typeof price === 'object' && price !== null) {
            // If it's an object, try to get value property or stringify
            const stringValue = JSON.stringify(price);
            const cleaned = stringValue.replace(/[^\d.-]/g, '');
            numericPrice = parseFloat(cleaned);
        } else {
            numericPrice = Number(price as any);
        }

        console.log("Parsed numeric price:", numericPrice);

        if (isNaN(numericPrice) || !isFinite(numericPrice) || numericPrice <= 0) {
            console.error("Invalid price after parsing:", numericPrice);
            return 0;
        }

        return numericPrice;
    };

    const calculateTotalCost = useCallback((): number => {
        if (!selectedDate || startHour >= endHour) {
            return 0;
        }

        const pricePerHour = getPricePerHour();
        if (pricePerHour === 0) {
            console.error("Cannot calculate total cost: price per hour is 0");
            return 0;
        }

        const hours = Math.max(1, endHour - startHour);
        console.log("Calculating total cost:", {
            pricePerHour,
            hours,
            selectedDate,
            startHour,
            endHour,
            selectedExtras
        });

        // Calculate base cost
        const baseCost = pricePerHour * hours;
        console.log("Base cost:", baseCost);

        // Validate base cost
        if (isNaN(baseCost) || !isFinite(baseCost) || baseCost < 0) {
            console.error("Invalid base cost calculation");
            return 0;
        }

        // Calculate extras cost
        let extrasCost = 0;
        if (selectedExtras.insurance) {
            extrasCost += 15 * hours;
            console.log("Adding insurance:", 15 * hours);
        }
        if (selectedExtras.gps) {
            extrasCost += 5 * hours;
            console.log("Adding GPS:", 5 * hours);
        }
        if (selectedExtras.childSeat) {
            extrasCost += 10 * hours;
            console.log("Adding child seat:", 10 * hours);
        }

        const total = baseCost + extrasCost;
        console.log("Total before rounding:", total);

        // Round to 2 decimal places
        const roundedTotal = Math.round((total + Number.EPSILON) * 100) / 100;
        console.log("Rounded total:", roundedTotal);

        // Final validation
        if (isNaN(roundedTotal) || !isFinite(roundedTotal) || roundedTotal < 0) {
            console.error("Invalid total after calculation");
            return 0;
        }

        return roundedTotal;
    }, [carData, selectedDate, startHour, endHour, selectedExtras]);

    const handleBookNow = useCallback(async () => {
        if (!carData?._id || !selectedDate) {
            toast.error("Missing required booking information");
            return;
        }

        if (startHour >= endHour) {
            toast.error("End time must be after start time");
            return;
        }

        const startDateTime = formatDateTimeForAPI(selectedDate, startHour);
        const endDateTime = formatDateTimeForAPI(selectedDate, endHour);

        const bookingStart = new Date(startDateTime);
        if (bookingStart < new Date()) {
            toast.error("Booking must be scheduled in the future");
            return;
        }

        const totalCost = calculateTotalCost();
        console.log("Final totalCost for booking:", totalCost, "Type:", typeof totalCost);

        // Validate totalCost is a valid positive number
        if (typeof totalCost !== 'number' || isNaN(totalCost) || !isFinite(totalCost) || totalCost <= 0) {
            console.error("Invalid totalCost calculated:", totalCost);
            toast.error("Cannot calculate booking cost. Please try again or contact support.");
            return;
        }

        const bookingData = {
            carId: carData._id,
            date: selectedDate,
            startTime: startDateTime,
            endTime: endDateTime,
            extras: selectedExtras,
            totalCost: totalCost,
        };

        console.log("Booking data to send:", bookingData);
        console.log("totalCost type in bookingData:", typeof bookingData.totalCost);

        try {
            await createBooking(bookingData).unwrap();
            toast.success("Booking created successfully!");
            navigate("/bookings", { replace: true });
        } catch (err: any) {
            console.error("Booking creation failed:", err);
            toast.error(err?.data?.message || "Failed to create booking. Please try again.");
        }
    }, [carData, selectedDate, startHour, endHour, selectedExtras, createBooking, navigate, calculateTotalCost]);

    const totalHours = Math.max(1, endHour - startHour);
    const totalCostDisplay = calculateTotalCost();
    console.log("Total cost display:", totalCostDisplay);

    const today = new Date().toISOString().split("T")[0];

    // ──────────────────────────────────────────────────────────────
    // RENDERING
    // ──────────────────────────────────────────────────────────────

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

    if (error || !carData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center p-8 max-w-md">
                    <div className="text-6xl mb-4">🚗</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Car Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The car you're looking for is unavailable or doesn't exist.
                    </p>
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

    const { image, images, name, description, features = [], status = "available" } = carData;
    const rating = 4.5;
    const isAvailable = status.toLowerCase() === "available";

    // Get price for display
    const pricePerHour = getPricePerHour();
    const displayPricePerHour = pricePerHour.toFixed(2);
    const isValidPrice = pricePerHour > 0;

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
                    {/* Left Column - Gallery + Features */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6 self-start"
                    >
                        <CarGallery images={images ?? (image ? [image] : [])} name={name} />

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

                        {/* Date & Time + Extras Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Select Date & Time
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-500">
                                        Hourly Rate: ${displayPricePerHour}/hr
                                    </span>
                                </div>
                            </div>

                            <button
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
                                onClick={() => setShowModal(true)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <div className="text-sm text-gray-500 mb-1">Booking Schedule</div>
                                        <div className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                                            {selectedDate
                                                ? `${selectedDate} • ${formatTimeForDisplay(startHour)} - ${formatTimeForDisplay(endHour)}`
                                                : "Select date and time"}
                                        </div>
                                    </div>
                                    <div className="text-2xl group-hover:scale-110 transition-transform">📅</div>
                                </div>
                            </button>

                            {/* Extras */}
                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Add Extra Services</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { key: "insurance", icon: Shield, label: "Insurance", price: 15 },
                                        { key: "gps", icon: Navigation, label: "GPS", price: 5 },
                                        { key: "childSeat", icon: Baby, label: "Child Seat", price: 10 },
                                    ].map(({ key, icon: Icon, label, price }) => (
                                        <div
                                            key={key}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedExtras[key as keyof typeof selectedExtras]
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            onClick={() => handleExtraChange(key as ExtraOption)}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <Icon
                                                    className={`w-5 h-5 ${selectedExtras[key as keyof typeof selectedExtras]
                                                        ? "text-blue-600"
                                                        : "text-gray-400"
                                                        }`}
                                                />
                                                <span className="font-medium">{label}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                ${price * totalHours} for {totalHours} hr{totalHours !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cost Summary */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-600">Estimated Total</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            ${totalCostDisplay.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {totalHours} hour{totalHours !== 1 ? "s" : ""} × $
                                            {displayPricePerHour}/hour
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <BookingButton
                            isAvailable={isAvailable && isValidPrice}
                            loading={bookingLoading}
                            onBook={handleBookNow}
                            isDisabled={!selectedDate || totalCostDisplay <= 0 || !isValidPrice}
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Date/Time Selection Modal */}
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
                                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={today}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                </div>

                                {selectedDate && (
                                    <>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Start Time
                                            </label>
                                            <select
                                                value={startHour}
                                                onChange={(e) => {
                                                    const newStart = parseInt(e.target.value);
                                                    setStartHour(newStart);
                                                    if (newStart >= endHour) setEndHour(newStart + 1);
                                                }}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                            >
                                                {timeOptions.map((time) => (
                                                    <option key={time.value} value={time.value}>
                                                        {time.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 mb-2">End Time</label>
                                            <select
                                                value={endHour}
                                                onChange={(e) => setEndHour(parseInt(e.target.value))}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                            >
                                                {timeOptions
                                                    .filter((time) => time.value > startHour)
                                                    .map((time) => (
                                                        <option key={time.value} value={time.value}>
                                                            {time.label}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>

                            {selectedDate && (
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <div className="text-sm text-blue-800">
                                        <div className="font-semibold mb-1">Booking Summary</div>
                                        <div className="space-y-1">
                                            <div>Date: {selectedDate}</div>
                                            <div>Time: {formatTimeForDisplay(startHour)} - {formatTimeForDisplay(endHour)}</div>
                                            <div className="font-medium mt-2">
                                                Duration: {totalHours} hour{totalHours !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                        if (!selectedDate) {
                                            toast.error("Please select a date");
                                            return;
                                        }
                                        if (startHour >= endHour) {
                                            toast.error("End time must be after start time");
                                            return;
                                        }

                                        const bookingDate = new Date(selectedDate);
                                        bookingDate.setHours(startHour, 0, 0, 0);
                                        if (bookingDate < new Date()) {
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