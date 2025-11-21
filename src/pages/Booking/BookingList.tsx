import {
    useDeleteBookingMutation,
    useGetBookingsQuery,
} from "@/redux/feature/booking/bookingApi";
import { Bookings } from "@/types/global";
import { Spin, Table, Modal, message } from "antd";
import { useState } from "react";
import { motion } from "framer-motion"; // For animations
import { DeleteOutlined } from "@ant-design/icons";

interface ApiError {
    data?: {
        message: string;
    };
    status?: number;
}

const BookingList = () => {
    const {
        data: bookings,
        isLoading,
        refetch,
    } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    console.log(bookings);

    const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

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
            const errorMessage = apiError.data?.message || "Failed to cancel the booking.";
            message.error(errorMessage);
        } finally {
            setModalVisible(false);
            setSelectedBookingId(null);
        }
    };

    if (isLoading) return <Spin size="large" className="flex justify-center items-center h-screen text-[#4335A7]" />;

    const columns = [
        {
            title: "Image",
            dataIndex: ["car", "image"],
            key: "image",
            render: (image: string) => (
                <motion.img
                    src={image}
                    className="h-[60px] w-[100px] object-cover rounded-2xl shadow-md border-2 border-[#4335A7]/30"
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    alt="Car Image"
                />
            ),
        },
        {
            title: "Car",
            dataIndex: ["car", "name"],
            key: "car",
            render: (carName: string) => (
                <motion.span
                    className="font-bold text-[#4335A7] hover:text-[#df3954] transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                >
                    {carName}
                </motion.span>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => (
                <span className="text-gray-700 font-medium bg-[#FFE4C4]/50 px-3 py-1 rounded-full">
                    {date}
                </span>
            ),
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: "startTime",
            render: (startTime: string) => (
                <span className="text-[#4335A7] font-semibold">
                    {startTime}
                </span>
            ),
        },
        {
            title: "End Time",
            dataIndex: "endTime",
            key: "endTime",
            render: (endTime: string) => (
                <span className="text-gray-600 italic">
                    {new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            ),
        },
        {
            title: "Total Cost",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (totalCost: number) => (
                <span className="font-bold text-[#df3954] bg-[#FFF6E9] px-4 py-1 rounded-lg shadow-sm">
                    ${totalCost.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record: Bookings) => (
                <motion.div
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    className="transition-all duration-300"
                >
                    <DeleteOutlined
                        className="text-[#df3954] cursor-pointer text-xl hover:text-red-800 transition-colors"
                        onClick={() => showConfirmModal(record._id)}
                        disabled={record.status === "approved"}
                    />
                </motion.div>
            ),
        },
    ];

    return (
        <div className="pt-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="col-span-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="rounded-2xl shadow-2xl overflow-x-auto bg-white/90"
                    >
                        {bookings?.data && bookings.data.length > 0 ? (
                            <Table
                                dataSource={bookings.data}
                                columns={columns}
                                rowKey="_id"
                                className="rounded-2xl overflow-hidden min-w-full"
                                pagination={false}
                                rowClassName={(record, index) =>
                                    index % 2 === 0 ? 'bg-[#FFF6E9]/50 hover:bg-[#FFE4C4]/70 transition-colors' : 'bg-white/50 hover:bg-[#FFE4C4]/70 transition-colors'
                                }
                            />
                        ) : (
                            <div className="text-center py-32 bg-gradient-to-br from-[#FFF6E9] to-[#FFE4C4] rounded-3xl shadow-2xl">
                                <p className="text-[#df3954] text-4xl font-extrabold tracking-wide drop-shadow-md">
                                    No bookings found. Time to hit the road—create a booking now!
                                </p>
                            </div>
                        )}
                    </motion.div>
                    <Modal
                        title={<span className="text-[#df3954] text-xl font-bold">Cancel Booking Confirmation</span>}
                        open={modalVisible}
                        onOk={handleCancelBooking}
                        onCancel={() => setModalVisible(false)}
                        confirmLoading={isDeleting}
                        centered
                        className="rounded-2xl shadow-lg"
                        okButtonProps={{
                            className:
                                "bg-[#df3954] text-white hover:bg-red-700 transition-all duration-300 rounded-full px-8 py-3 font-semibold",
                        }}
                        cancelButtonProps={{
                            className:
                                "border-[#4335A7] text-[#4335A7] hover:border-[#df3954] hover:text-[#df3954] transition-all duration-300 rounded-full px-8 py-3",
                        }}
                    >
                        <p className="text-lg text-gray-800 font-medium">
                            Are you absolutely sure you want to cancel this booking? This action cannot be undone.
                        </p>
                    </Modal>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingList;