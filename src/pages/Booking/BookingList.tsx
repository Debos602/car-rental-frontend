import {
    useDeleteBookingMutation,
    useGetBookingsQuery,
} from "@/redux/feature/booking/bookingApi";
import { useAppDispatch } from "@/redux/hook";
import { baseApi } from "@/redux/api/baseApi";
import { Bookings } from "@/types/global";
import { Table, Modal, message, Tag, Tooltip } from "antd";
import { useState } from "react";
import { motion } from "framer-motion";
import { DeleteOutlined, CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { userInfo } from "os";
import { useSelector } from "react-redux";

interface ApiError {
    data?: {
        message: string;
    };
    status?: number;
}

const BookingList = () => {

    const user = useSelector((state: any) => state.auth.user);

    const {
        data: bookings,
        isLoading,
        refetch,
    } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    const navigate = useNavigate();
    // console.log("Bookings Data:", bookings);

    const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
    const dispatch = useAppDispatch();
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
            // Refetch bookings list
            refetch();
            // Ensure notifications refetch immediately (invalidate Notification tag)
            dispatch(baseApi.util.invalidateTags(["Notification"]));
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage = apiError.data?.message || "Failed to cancel the booking.";
            message.error(errorMessage);
        } finally {
            setModalVisible(false);
            setSelectedBookingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-chocolate border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-chocolate font-semibold">Loading bookings...</p>
                </div>
            </div>
        );
    }

    const columns = [
        {
            title: (
                <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-chocolate mr-2"></div>
                    <span className="font-semibold text-gray-900">Car</span>
                </div>
            ),
            dataIndex: ["car", "image"],
            key: "image",
            render: (image: string, record: Bookings) => (
                <motion.div
                    className="flex items-center space-x-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.img
                        src={image}
                        className="h-16 w-24 object-cover rounded-xl shadow-md border-2 border-gray-900"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                        alt="Car"
                    />
                    <div>
                        <p className="font-bold text-gray-900">{record.car?.name}</p>
                        {/* <p className="text-xs text-gray-500">{record.car?.brand} • {record.car?.model}</p> */}
                    </div>
                </motion.div>
            ),
        },
        {
            title: (
                <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-chocolate" />
                    <span className="font-semibold text-gray-900">Booking Date</span>
                </div>
            ),
            dataIndex: "date",
            key: "date",
            render: (date: string) => (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block"
                >
                    <Tag color="default" className="text-gray-900 font-medium px-3 py-1 border-2 border-gray-900 rounded-lg">
                        {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </Tag>
                </motion.div>
            ),
        },
        {
            title: (
                <div className="flex items-center">
                    <ClockCircleOutlined className="mr-2 text-chocolate" />
                    <span className="font-semibold text-gray-900">Time</span>
                </div>
            ),
            key: "time",
            render: (record: Bookings) => (
                <div className="flex gap-2">
                    <div className="flex items-center">
                        <span className="text-gray-900 font-medium mr-2">Start:</span>
                        <span className="text-chocolate font-bold">{record.startTime}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-900 font-medium mr-2">End:</span>
                        <span className="text-gray-700 font-semibold">{record.endTime}</span>
                    </div>
                </div>
            ),
        },

        {
            title: <span className="font-semibold text-gray-900">Total Cost</span>,
            dataIndex: "totalCost",
            key: "totalCost",
            render: (totalCost: number) => (
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="inline-block"
                >
                    <div className="bg-gradient-to-r from-chocolate to-amber-800 text-white font-bold px-4 py-2 rounded-lg shadow-lg">
                        ${totalCost.toFixed(2)}
                    </div>
                </motion.div>
            ),
        },
        {
            title: <span className="font-semibold text-gray-900">Actions</span>,
            key: "actions",
            render: (record: Bookings) => (
                <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                >


                    <Tooltip title="Cancel Booking">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => showConfirmModal(record._id)}
                            disabled={record.status === "approved"}
                            className={`w-10 h-10 rounded-full border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-white transition-all duration-300 flex items-center justify-center ${record.status === "approved" ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            <DeleteOutlined />
                        </motion.button>
                    </Tooltip>
                </motion.div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 sm:mb-12"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                My Bookings
                            </h1>
                            <p className="text-gray-600">
                                Manage and track all your car rental bookings in one place
                            </p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                        >
                            {
                                user.role === 'user' ? (
                                    <button
                                        onClick={() => navigate('/dashboard/booking')}
                                        className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg"
                                    >
                                        User Dashboard
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate('/admin-dashboard/manage-booking')}
                                        className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg"
                                    >
                                        Admin Dashboard
                                    </button>
                                )
                            }
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bookings Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-gray-900 overflow-hidden"
                >
                    {bookings?.data && bookings.data.length > 0 ? (
                        <>
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-chocolate mr-2"></div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Your Bookings ({bookings.data.length})
                                        </h2>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-gray-600">Active</span>
                                        <div className="w-2 h-2 rounded-full bg-amber-500 ml-2"></div>
                                        <span className="text-sm text-gray-600">Pending</span>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table
                                    dataSource={bookings.data}
                                    columns={columns}
                                    rowKey="_id"
                                    pagination={{
                                        pageSize: 5,
                                        className: "px-6 py-4",
                                        itemRender: (current, type, originalElement) => {
                                            if (type === 'page') {
                                                return (
                                                    <button className={`mx-1 w-10 h-10 rounded-full ${current === 1
                                                        ? 'bg-chocolate text-white'
                                                        : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
                                                        } font-semibold transition-colors`}>
                                                        {current}
                                                    </button>
                                                );
                                            }
                                            return originalElement;
                                        }
                                    }}
                                    className="custom-table"
                                    rowClassName={(record, index) => {
                                        return index % 2 === 0
                                            ? 'bg-white hover:bg-amber-50/50 transition-colors'
                                            : 'bg-amber-50/30 hover:bg-amber-50/50 transition-colors';
                                    }}
                                    onRow={(record) => ({
                                        onClick: () => {
                                            // Handle row click for details
                                            console.log('Row clicked:', record);
                                        },
                                        style: { cursor: 'pointer' }
                                    })}
                                />
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-center py-20 px-6"
                        >
                            <div className="inline-block p-6 rounded-full bg-gradient-to-r from-chocolate/10 to-amber-800/10 mb-6">
                                <CalendarOutlined className="text-6xl text-chocolate" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                No Bookings Found
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto mb-8">
                                You haven't made any bookings yet. Explore our premium car collection and book your perfect ride today!
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = '/cars'}
                                className="bg-gradient-to-r from-chocolate to-amber-800 hover:from-amber-800 hover:to-chocolate text-white font-bold px-8 py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                Browse Available Cars
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Stats Summary */}
                {bookings?.data && bookings.data.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
                    >
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-900 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900">{bookings.data.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-chocolate/10 flex items-center justify-center">
                                    <CalendarOutlined className="text-2xl text-chocolate" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-900 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Spent</p>
                                    <p className="text-3xl font-bold text-chocolate">
                                        ${bookings.data.reduce((sum: number, booking: Bookings) => sum + (booking.totalCost || 0), 0).toFixed(2)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-amber-600/10 flex items-center justify-center">
                                    <span className="text-2xl text-amber-600 font-bold">$</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-gray-900 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Upcoming Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {bookings.data.filter((b: Bookings) => new Date(b.date) > new Date()).length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gray-900/10 flex items-center justify-center">
                                    <ClockCircleOutlined className="text-2xl text-gray-900" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Cancel Booking Modal */}
                <Modal
                    title={
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-chocolate mr-2"></div>
                            <span className="text-xl font-bold text-gray-900">Cancel Booking</span>
                        </div>
                    }
                    open={modalVisible}
                    onOk={handleCancelBooking}
                    onCancel={() => setModalVisible(false)}
                    confirmLoading={isDeleting}
                    centered
                    className="rounded-2xl shadow-2xl"
                    okButtonProps={{
                        className: "bg-gradient-to-r from-chocolate to-amber-800 hover:from-amber-800 hover:to-chocolate border-0 text-white font-bold rounded-lg px-6 py-2 h-auto",
                    }}
                    cancelButtonProps={{
                        className: "border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold rounded-lg px-6 py-2 h-auto",
                    }}
                >
                    <div className="py-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <DeleteOutlined className="text-2xl text-red-600" />
                        </div>
                        <p className="text-lg text-gray-900 font-semibold text-center mb-2">
                            Are you sure you want to cancel this booking?
                        </p>
                        <p className="text-gray-600 text-center mb-6">
                            This action cannot be undone. Any charges may still apply based on our cancellation policy.
                        </p>
                        <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-200">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Note:</span> Cancellations made less than 24 hours before the booking start time may incur additional fees.
                            </p>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default BookingList;