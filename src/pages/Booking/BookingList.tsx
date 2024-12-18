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

    if (isLoading) return <Spin size="large" />;

    if (!isLoading && bookings?.data?.length === 0) {
        return (
            <div className="text-center py-32 bg-[#FFF6E9]">
                <p className="text-[#df3954] text-3xl font-bold">
                    No bookings found. Please create a booking to see your list here.
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
                    className="h-[48px] max-h-full  object-cover rounded-xl shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
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
                    className="font-semibold text-gray-800 hover:text-[#4335A7]"
                    whileHover={{ color: "#4335A7" }}
                >
                    {carName}
                </motion.span>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
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
                    {new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            ),
        },

        {
            title: "Total Cost",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (totalCost: number) => (
                <span className="font-semibold text-green-600">
                    ${totalCost.toFixed(2)}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record: Bookings) => (
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="transition-all duration-300"
                >

                    <DeleteOutlined className="text-red-600 cursor-pointer text-lg"
                        onClick={() => showConfirmModal(record._id)}
                        disabled={record.status === "approved"} />

                </motion.div>
            ),
        },
    ];

    return (
        <div className="bg-[#FFF6E9] py-12">
            <div className="container mx-auto">
                <div>
                    <motion.div
                        className="col-span-4"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="rounded-xl shadow-lg overflow-x-auto"
                        >
                            {bookings?.data && bookings.data.length > 0 ? (
                                <Table
                                    dataSource={bookings.data}
                                    columns={columns}
                                    rowKey="_id"
                                    className="bg-[#FFF6E9] rounded-lg shadow-lg overflow-x-auto"
                                    pagination={false}
                                />
                            ) : (
                                <div className="text-center py-16 text-2xl text-[#FFF6E9]">No bookings found</div>
                            )}
                        </motion.div>
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
                                    "bg-[#4335A7] text-white hover:bg-red-600 transition-all duration-300 rounded-full px-6 py-2",
                            }}
                            cancelButtonProps={{
                                className:
                                    "border-gray-300 hover:border-black transition-all duration-300 rounded-full px-6 py-2",
                            }}
                        >
                            <p className="text-lg text-[#4335A7]">
                                Are you sure you want to cancel this booking?
                            </p>
                        </Modal>
                    </motion.div>
                </div>
            </div>
        </div>

    );
};

export default BookingList;
