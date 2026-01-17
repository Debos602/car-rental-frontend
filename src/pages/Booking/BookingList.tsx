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
import {
    DeleteOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DollarCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface ApiError {
    data?: { message: string; };
    status?: number;
}

const BookingList = () => {
    const user = useSelector((state: any) => state.auth.user);

    const { data: bookings, isLoading, refetch } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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
            dispatch(baseApi.util.invalidateTags(["Notification"]));
        } catch (error) {
            const apiError = error as ApiError;
            message.error(apiError.data?.message || "Failed to cancel the booking.");
        } finally {
            setModalVisible(false);
            setSelectedBookingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50/60 to-orange-50/40 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-20 h-20 border-4 border-chocolate/30 border-t-chocolate rounded-full animate-spin mx-auto mb-6"></div>
                    <p className="text-xl font-medium text-chocolate/80">Loading your bookings...</p>
                </motion.div>
            </div>
        );
    }

    const columns = [
        {
            title: "Car",
            dataIndex: ["car", "image"],
            key: "image",
            render: (image: string, record: Bookings) => (
                <motion.div className="flex items-center gap-4" whileHover={{ x: 4 }}>
                    <div className="relative overflow-hidden rounded-xl shadow-md">
                        <img
                            src={image}
                            className="h-16 w-28 object-cover transition-transform duration-500 hover:scale-110"
                            alt={record.car?.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{record.car?.name}</p>
                        <p className="text-sm text-gray-600">{record.car?.brand}</p>
                    </div>
                </motion.div>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => (
                <Tag
                    color="default"
                    className="px-4 py-1.5 text-sm font-medium rounded-lg bg-white/70 backdrop-blur-sm border border-amber-200 text-gray-800 shadow-sm"
                >
                    {new Date(date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </Tag>
            ),
        },
        {
            title: "Time",
            key: "time",
            render: (record: Bookings) => (
                <div className="flex flex-col sm:flex-row sm:gap-6 text-sm">
                    <div>
                        <span className="text-gray-600">Start:</span>{" "}
                        <span className="font-medium text-chocolate">{record.startTime}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">End:</span>{" "}
                        <span className="font-medium text-gray-700">{record.endTime}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Total",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (totalCost: number) => (
                <div className="inline-block px-5 py-2 bg-gradient-to-r from-chocolate/90 to-amber-800/90 text-white font-semibold rounded-lg shadow-md">
                    ${totalCost.toFixed(2)}
                </div>
            ),
        },
        {
            title: "Payment",
            key: "payment",
            render: (record: Bookings) => (
                <Tooltip title={record.status === "approved" ? "Already Paid" : "Pay Now"}>
                    <motion.button
                        disabled={record.status === "approved"}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => navigate("/dashboard/payment")}
                        className={`p-3 rounded-full bg-white shadow-md transition-all ${record.status === "approved"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-chocolate hover:text-white text-chocolate border border-chocolate/30"
                            }`}
                    >
                        <DollarCircleFilled className="text-xl" />
                    </motion.button>
                </Tooltip>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record: Bookings) => (
                <Tooltip title={record.status === "approved" ? "Cannot cancel approved booking" : "Cancel"}>
                    <motion.button
                        disabled={record.status === "approved"}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => showConfirmModal(record._id)}
                        className={`p-3 rounded-full bg-white shadow-md transition-all ${record.status === "approved"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-red-50 hover:text-red-600 text-red-500 border border-red-200"
                            }`}
                    >
                        <DeleteOutlined className="text-xl" />
                    </motion.button>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50/70 via-orange-50/30 to-white py-10 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                >
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                            My Bookings
                        </h1>
                        <p className="mt-2 text-gray-600">Track and manage your car rental reservations</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                            navigate(user.role === "user" ? "/dashboard/booking" : "/admin-dashboard/manage-booking")
                        }
                        className="px-7 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-medium rounded-xl shadow-lg transition-all duration-300"
                    >
                        {user.role === "user" ? "User Dashboard" : "Admin Dashboard"}
                    </motion.button>
                </motion.div>

                {/* Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
                >
                    {bookings?.data?.length > 0 ? (
                        <>
                            <div className="p-6 border-b border-amber-100/60">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-chocolate"></div>
                                        Your Reservations ({bookings.data.length})
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>Active
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>Pending
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table
                                    dataSource={bookings.data}
                                    columns={columns}
                                    rowKey="_id"
                                    pagination={{
                                        pageSize: 6,
                                        className: "px-6 py-5",
                                    }}
                                    className="custom-ant-table"
                                    rowClassName={() => "hover:bg-amber-50/40 transition-colors duration-200"}
                                />
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-24 px-6 text-center"
                        >
                            <div className="inline-flex p-8 rounded-full bg-gradient-to-br from-chocolate/5 to-amber-800/5 mb-8">
                                <CalendarOutlined className="text-7xl text-chocolate/70" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Bookings Yet</h3>
                            <p className="text-lg text-gray-600 max-w-lg mx-auto mb-10">
                                Start your journey — browse our exclusive collection and book your dream car today.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/cars")}
                                className="px-10 py-4 bg-gradient-to-r from-chocolate to-amber-800 hover:from-amber-800 hover:to-chocolate text-white font-semibold text-lg rounded-xl shadow-xl transition-all duration-300"
                            >
                                Explore Cars →
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Stats */}
                {bookings?.data?.length > 0 && (
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Total Bookings",
                                value: bookings.data.length,
                                icon: <CalendarOutlined />,
                                color: "chocolate",
                            },
                            {
                                title: "Total Spent",
                                value: `$${bookings.data
                                    .reduce((sum: number, b: Bookings) => sum + (b.totalCost || 0), 0)
                                    .toFixed(2)}`,
                                icon: "$",
                                color: "amber-700",
                            },
                            {
                                title: "Upcoming",
                                value: bookings.data.filter((b: Bookings) => new Date(b.date) > new Date()).length,
                                icon: <ClockCircleOutlined />,
                                color: "gray-800",
                            },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-lg"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                        <p className={`text-3xl font-bold ${stat.color === "chocolate" ? "text-chocolate" : "text-gray-900"}`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${stat.color}/10 to-${stat.color}/5 flex items-center justify-center text-2xl text-${stat.color}`}
                                    >
                                        {stat.icon}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Cancel Modal */}
                <Modal
                    title={
                        <div className="flex items-center gap-3 text-xl font-bold text-gray-900">
                            <div className="w-3 h-3 rounded-full bg-chocolate"></div>
                            Cancel Booking
                        </div>
                    }
                    open={modalVisible}
                    onOk={handleCancelBooking}
                    onCancel={() => setModalVisible(false)}
                    confirmLoading={isDeleting}
                    centered
                    okText="Yes, Cancel Booking"
                    cancelText="Keep Booking"
                    okButtonProps={{
                        className:
                            "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 border-0 text-white font-medium rounded-lg px-8",
                    }}
                    cancelButtonProps={{
                        className: "border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-8",
                    }}
                >
                    <div className="py-6 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                            <DeleteOutlined className="text-4xl text-red-600" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900 mb-3">
                            Confirm cancellation?
                        </p>
                        <p className="text-gray-600 mb-6">
                            This action cannot be undone. Cancellation fees may apply depending on timing.
                        </p>
                        <div className="bg-amber-50 p-4 rounded-xl text-sm text-amber-800 border border-amber-200">
                            <strong>Note:</strong> Cancellations within 24 hours of start time may incur charges.
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default BookingList;