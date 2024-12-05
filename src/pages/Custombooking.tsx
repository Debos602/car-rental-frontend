import {
    useDeleteBookingMutation,
    useGetBookingsQuery,
} from "@/redux/feature/booking/bookingApi";
import { Bookings } from "@/types/global";
import { Spin, Table, Modal, message } from "antd";
import { useState } from "react";
import { motion } from "framer-motion";

interface ApiError {
    data?: {
        message: string;
    };
    status?: number;
}

const Custombooking = () => {
    const {
        data: bookings,
        isLoading,
        refetch,
    } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const [deleteBooking, { isLoading: isDeleting }] =
        useDeleteBookingMutation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
        null
    );

    const showConfirmModal = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setModalVisible(true);
    };

    const handleCancelBooking = async () => {
        if (!selectedBookingId) return;

        try {
            await deleteBooking(selectedBookingId).unwrap();
            message.success("Booking cancelled successfully!");
            refetch();
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage =
                apiError.data?.message || "Failed to cancel the booking.";
            message.error(errorMessage);
        } finally {
            setModalVisible(false);
            setSelectedBookingId(null);
        }
    };

    if (isLoading) return <Spin className="flex justify-center items-center h-screen" size="large" />;

    if (!isLoading && bookings?.data?.length === 0) {
        return (
            <div className="text-center">
                <p className="text-gray-600">
                    No bookings found. Please create a booking to see your list
                    here.
                </p>
            </div>
        );
    }

    const columns = [
        {
            title: "Image",
            dataIndex: ["car", "image"],
            key: "image",
            render: (image: string) => (
                <motion.img
                    src={image}
                    className=" w-32 max-w-full object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                    alt="Car Image"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                />
            ),
        },
        {
            title: "Car",
            dataIndex: ["car", "name"],
            key: "car",
            render: (carName: string) => (
                <motion.span
                    className="font-semibold text-gray-800 hover:text-[#4335A7] transition-all duration-300"
                    whileHover={{ color: "#FF7F3E" }}
                >
                    {carName}
                </motion.span>
            ),
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: "startTime",
        },
        {
            title: "End Time",
            dataIndex: "endTime",
            key: "endTime",
            render: (endTime: string) => (
                <span className="text-gray-600">
                    {new Date(endTime).toLocaleDateString("en-GB")}
                </span>
            ),
        },
        {
            title: "Total Cost",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (totalCost: number) => (
                <span className="font-semibold text-[#FF7F3E]">
                    ${totalCost.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record: Bookings) => (
                <motion.button
                    className={`border-2 text-black px-4 py-1 rounded-lg font-semibold transition-all duration-300 ${record.status === "approved"
                        ? "bg-gray-300 cursor-not-allowed border-gray-300"
                        : "bg-white border-black hover:bg-[#80C4E9] hover:text-white"
                        }`}
                    type="button"
                    onClick={() => showConfirmModal(record._id)}
                    disabled={record.status === "approved"}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Cancel
                </motion.button>
            ),
        },
    ];

    return (
        <motion.div
            className="bg-[#FFF6E9] py-4"

        >
            <motion.h2
                className="text-center bg-[#80C4E9] py-10 text-3xl sm:text-5xl font-normal uppercase rounded-xl text-[#4335A7] mx-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Manage Your Booking
            </motion.h2>
            {bookings?.data && bookings.data.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Table
                        dataSource={bookings.data}
                        columns={columns}
                        rowKey="_id"
                        className="hover:shadow-lg transition-all duration-300 bg-[#FFF6E9] rounded-lg px-4 overflow-x-auto"
                        scroll={{ x: 500 }}
                    />
                </motion.div>
            ) : (
                <p className="text-center text-gray-600">
                    No bookings found. Please create a booking to see your list
                    here.
                </p>
            )}
            <Modal
                title="Cancel Booking"
                open={modalVisible}
                onOk={handleCancelBooking}
                onCancel={() => setModalVisible(false)}
                confirmLoading={isDeleting}
                centered
                className="rounded-lg"
                okButtonProps={{
                    className:
                        "bg-red-500 text-white hover:bg-red-600 transition-all duration-300 rounded-full px-6 py-2",
                }}
                cancelButtonProps={{
                    className:
                        "border-gray-300 hover:border-black transition-all duration-300 rounded-full px-6 py-2",
                }}
            >
                <motion.p
                    className="text-lg text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Are you sure you want to cancel this booking?
                </motion.p>
            </Modal>
        </motion.div>
    );
};

export default Custombooking;
