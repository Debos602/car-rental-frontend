import bookingApi, {
    useDeleteBookingMutation,
    useGetBookingsQuery,
} from "@/redux/feature/booking/bookingApi";
import { Bookings } from "@/types/global";
import { Spin, Table, Modal, message, Tag, Tooltip, Card, Badge } from "antd";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    DeleteOutlined,
    CarOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import { formatOnlyTime } from "@/lib/time";
import { useSocket } from "@/hook/useSocket";


// Theme colors based on your dashboard
const themeColors = {
    primary: '#1e40af', // Deep blue
    secondary: '#3b82f6', // Medium blue
    accent: '#10b981', // Green
    warning: '#f59e0b', // Amber
    danger: '#ef4444', // Red
    text: '#1f2937', // Dark gray
    lightText: '#6b7280', // Medium gray
    background: '#f8fafc', // Light blue-gray
    card: '#ffffff', // White
    border: '#e5e7eb' // Light gray
};

interface ApiError {
    data?: {
        message: string;
    };
    status?: number;
}

const MyBooking = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [socketToast, setSocketToast] = useState<{ type: 'info' | 'success' | 'error' | 'warning'; content: string; } | null>(null);

    const {
        data: bookings,
        isLoading,
        refetch,

    } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    console.log("Bookings data:", bookings);

    const { onMessage, offMessage, joinRoom } = useSocket(import.meta.env.VITE_SOCKET_SERVER_URL);
    const [deleteBooking, { isLoading: isDeleting }] =
        useDeleteBookingMutation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
        null
    );
    const [selectedBookingCar, setSelectedBookingCar] = useState<string>('');

    const showConfirmModal = (bookingId: string, carName: string) => {
        setSelectedBookingId(bookingId);
        setSelectedBookingCar(carName);
        setModalVisible(true);
    };

    useEffect(() => {
        const handleBookingDeleted = (payload: { bookingId: string; message?: string; }) => {
            console.log("Received 'booking-deleted' event with payload:", payload.message);

            // Only update local state here; show toast in separate effect to remain Concurrent Mode safe
            setSocketToast({ type: 'info', content: payload?.message || 'Booking deleted' });

            // Refresh bookings list
            refetch();
        };
        onMessage('booking-deleted', handleBookingDeleted);
        return () => {
            offMessage('booking-deleted', handleBookingDeleted);
        };
    }, [onMessage, offMessage, refetch]);
    useEffect(() => {
        if (!socketToast) return;

        const { type, content } = socketToast;
        // Trigger antd message inside effect (Concurrent Mode safe)
        if (type === 'info') messageApi.info(content, 4);
        else if (type === 'success') messageApi.success(content);
        else if (type === 'warning') messageApi.warning(content);
        else messageApi.error(content);

        setSocketToast(null);
    }, [socketToast, messageApi]);

    const handleCancelBooking = async () => {
        if (!selectedBookingId) return;

        try {
            await deleteBooking(selectedBookingId).unwrap();

            refetch();
        } catch (error) {
            const apiError = error as ApiError;
            const errorMessage =
                apiError.data?.message || "Failed to cancel the booking.";
            message.error(errorMessage);
        } finally {
            setModalVisible(false);
            setSelectedBookingId(null);
            setSelectedBookingCar('');
        }
    };

    // Helper function to normalize status (handle both 'cancelled' and 'canceled')
    const normalizeStatus = (status: string | undefined): string => {
        if (!status) return 'unknown';

        const normalized = status.toLowerCase();
        // Convert 'canceled' to 'cancelled' for consistent comparison
        if (normalized === 'canceled') return 'cancelled';
        return normalized;
    };

    const getStatusColor = (status: string | undefined) => {
        const normalizedStatus = normalizeStatus(status);

        switch (normalizedStatus) {
            case 'approved':
                return { color: 'success' as const, text: 'Approved', icon: <CheckCircleOutlined /> };
            case 'pending':
                return { color: 'warning' as const, text: 'Pending', icon: <ClockCircleOutlined /> };
            case 'cancelled':
                return { color: 'default' as const, text: 'Cancelled', icon: <CloseCircleOutlined /> };
            case 'completed':
                return { color: 'processing' as const, text: 'Completed', icon: <CheckCircleOutlined /> };
            default:
                return { color: 'default' as const, text: status || 'N/A', icon: <ClockCircleOutlined /> };
        }
    };

    // Robust duration calculator that handles HH:mm or ISO timestamps
    const computeDurationHours = (dateStr?: string, start?: string, end?: string) => {
        if (!start || !end) return 0;

        const makeDate = (d?: string, t?: string) => {
            if (!d || !t) return null;
            // If time already contains a 'T', assume full ISO
            if (t.includes('T')) return new Date(t);
            // If date string contains time already
            if (d.includes('T')) return new Date(d);
            try {
                return new Date(`${d}T${t}`);
            } catch (e) {
                return null;
            }
        };

        const sd = makeDate(dateStr, start);
        const ed = makeDate(dateStr, end);
        if (!sd || !ed) return 0;
        const s = sd.getTime();
        const e = ed.getTime();
        if (!Number.isFinite(s) || !Number.isFinite(e)) return 0;
        const diffHours = (e - s) / (1000 * 60 * 60);
        if (!Number.isFinite(diffHours) || Number.isNaN(diffHours) || diffHours <= 0) return 0;
        return Math.round((diffHours + Number.EPSILON) * 10) / 10; // 1 decimal
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to check if booking can be cancelled
    const canCancelBooking = (status: string | undefined): boolean => {
        const normalizedStatus = normalizeStatus(status);
        return normalizedStatus !== 'approved' && normalizedStatus !== 'cancelled' && normalizedStatus !== 'completed';
    };



    // Desktop table columns
    const desktopColumns = [
        {
            title: <span style={{ color: themeColors.text, fontWeight: 600 }}>Car Details</span>,
            dataIndex: ['car', 'name'],
            key: 'car',
            width: 220,
            fixed: 'left' as const,
            render: (carName: string, record: Bookings) => (
                <div className="flex items-center space-x-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                    >
                        <img
                            src={record.car?.image}
                            className="w-14 h-14 object-cover rounded-lg shadow-md"
                            alt={carName}
                            style={{ border: `2px solid ${themeColors.border}` }}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                            <CarOutlined style={{ color: themeColors.primary, fontSize: '10px' }} />
                        </div>
                    </motion.div>
                    <div className="min-w-0">
                        <div className="font-semibold text-sm truncate" style={{ color: themeColors.text }}>
                            {carName}
                        </div>
                        <div className="text-xs flex items-center space-x-1 mt-1" style={{ color: themeColors.lightText }}>
                            <span className="truncate">{record.car?.color}</span>
                            <span>•</span>
                            <span>{record.car?.isElectric ? 'Electric' : 'Fuel'}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: <span style={{ color: themeColors.text, fontWeight: 600 }}>Date</span>,
            dataIndex: 'date',
            key: 'date',
            width: 110,
            responsive: ['md'] as any,
            render: (date: string) => (
                <div className="flex flex-col">
                    <span className="text-xs font-medium" style={{ color: themeColors.text }}>
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs" style={{ color: themeColors.lightText }}>
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                </div>
            ),
        },
        {
            title: "Start Time",
            key: "startTime",
            render: (record: Bookings) => (
                <span className="font-medium">
                    {formatOnlyTime(record.startTime)}
                </span>
            ),
        },
        {
            title: "End Time",
            key: "endTime",
            render: (record: Bookings) => (
                <span className="font-medium">
                    {formatOnlyTime(record.endTime)}
                </span>
            ),
        },

        {
            title: <span style={{ color: themeColors.text, fontWeight: 600 }}>Duration</span>,
            key: 'duration',
            width: 90,
            responsive: ['lg'] as any,
            render: (record: Bookings) => {
                const duration = computeDurationHours(record.date, record.startTime, record.endTime);
                return (
                    <div className="text-center">
                        <div className="text-xs font-bold" style={{ color: themeColors.primary }}>
                            {duration > 0 ? `${duration.toFixed(1)}h` : "—"}
                        </div>
                    </div>
                );
            },
        },
        {
            title: <span style={{ color: themeColors.text, fontWeight: 600 }}>Amount</span>,
            dataIndex: 'totalCost',
            key: 'totalCost',
            width: 100,
            responsive: ['sm'] as any,
            render: (totalCost: number) => (
                <div className="flex flex-col items-center">
                    <span className="font-bold text-sm" style={{ color: themeColors.text }}>
                        ${totalCost.toFixed(2)}
                    </span>
                </div>
            ),
        },

        {
            title: <span style={{ color: themeColors.text, fontWeight: 600 }}>Payment</span>,
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            width: 90,
            responsive: ['lg'] as any,
            render: (status: string) => (
                <Badge
                    status={status === 'paid' ? 'success' : status === 'pending' ? 'warning' : 'default'}
                    text={
                        <span className="text-xs font-medium">
                            {status === 'paid' ? 'Paid' : status === 'pending' ? 'Pending' : 'Unpaid'}
                        </span>
                    }
                />
            ),
        },
        {
            title: <span style={{ color: themeColors.text, fontWeight: 600 }}>Actions</span>,
            key: 'actions',
            width: 100,
            fixed: 'right' as const,
            render: (record: Bookings) => {
                const canCancel = canCancelBooking(record.status);
                const isCancelled = normalizeStatus(record.status) === 'cancelled';

                return (
                    <div className="flex justify-center">
                        <Tooltip title={!canCancel ?
                            (isCancelled ? "Booking already cancelled" : "Cannot cancel approved/completed bookings") :
                            "Cancel Booking"
                        }>
                            <motion.button
                                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 ${!canCancel
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                    : "bg-white text-red-500 border border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600"
                                    }`}
                                type="button"
                                onClick={() => showConfirmModal(record._id, record.car?.name || 'this car')}
                                disabled={!canCancel}
                                whileHover={!canCancel ? {} : { scale: 1.05 }}
                                whileTap={!canCancel ? {} : { scale: 0.95 }}
                            >
                                <DeleteOutlined style={{ fontSize: '12px' }} />
                                <span className="text-xs">Cancel</span>
                            </motion.button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    // Get filtered stats
    const bookingStats = bookings?.data ? {
        total: bookings.data.length,
        approved: bookings.data.filter((b: Bookings) => normalizeStatus(b.status) === 'approved').length,
        pending: bookings.data.filter((b: Bookings) => normalizeStatus(b.status) === 'pending').length,
        cancelled: bookings.data.filter((b: Bookings) => normalizeStatus(b.status) === 'cancelled').length,
        totalSpent: bookings.data.reduce((sum: number, b: Bookings) => sum + (b.paymentStatus === 'paid' ? 0 : (b.totalCost || 0)), 0)
    } : null;

    // Mobile Card View Component
    const MobileBookingCard = ({ booking }: { booking: Bookings; }) => {
        const duration = computeDurationHours(booking.date, booking.startTime, booking.endTime);
        const { color, text, icon } = getStatusColor(booking.status);
        const canCancel = canCancelBooking(booking.status);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
            >
                <Card
                    size="small"
                    className="hover:shadow-md transition-shadow duration-300"
                    style={{ borderColor: themeColors.border }}
                >
                    <div className="flex flex-col space-y-4">
                        {/* Header Row */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                                <img
                                    src={booking.car?.image}
                                    alt={booking.car?.name}
                                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                    style={{ border: `2px solid ${themeColors.border}` }}
                                />
                                <div className="min-w-0">
                                    <div className="font-semibold text-sm" style={{ color: themeColors.text }}>
                                        {booking.car?.name}
                                    </div>
                                    <div className="text-xs mt-1" style={{ color: themeColors.lightText }}>
                                        {booking.car?.color} • {booking.car?.isElectric ? 'Electric' : 'Fuel'}
                                    </div>
                                    <div className="text-xs font-bold mt-1" style={{ color: themeColors.secondary }}>
                                        ${booking.car?.pricePerHour}/hour
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <Tag
                                    color={color}
                                    icon={icon}
                                    className="text-xs py-0.5 px-2 rounded-full"
                                >
                                    {text}
                                </Tag>
                                <Badge
                                    status={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                                    text={
                                        <span className="text-xs">
                                            {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                        </span>
                                    }
                                />
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                    <CalendarOutlined style={{ color: themeColors.lightText, fontSize: '12px' }} />
                                    <span className="text-xs font-medium" style={{ color: themeColors.text }}>
                                        {formatDate(booking.date)}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <ClockCircleOutlined style={{ color: themeColors.lightText, fontSize: '12px' }} />
                                    <span className="text-xs" style={{ color: themeColors.text }}>
                                        {/* {(`${booking.date}T${booking.startTime}`, `${booking.date}T${booking.endTime}`)} */}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1 text-right">
                                <div className="text-sm font-bold" style={{ color: themeColors.primary }}>
                                    {duration.toFixed(1)} hours
                                </div>
                                <div className="flex items-center justify-end space-x-1">
                                    <DollarOutlined style={{ color: themeColors.accent, fontSize: '12px' }} />
                                    <span className="text-lg font-bold" style={{ color: themeColors.text }}>
                                        ${booking.totalCost?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-end pt-2 border-t" style={{ borderColor: themeColors.border }}>
                            <Tooltip title={!canCancel ?
                                "Cannot cancel this booking" :
                                "Cancel Booking"
                            }>
                                <motion.button
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${!canCancel
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                        : "bg-white text-red-500 border border-red-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600"
                                        }`}
                                    type="button"
                                    onClick={() => showConfirmModal(booking._id, booking.car?.name || 'this car')}
                                    disabled={!canCancel}
                                    whileHover={!canCancel ? {} : { scale: 1.05 }}
                                    whileTap={!canCancel ? {} : { scale: 0.95 }}
                                >
                                    <DeleteOutlined />
                                    <span className="text-sm">Cancel Booking</span>
                                </motion.button>
                            </Tooltip>
                        </div>
                    </div>
                </Card>
            </motion.div>
        );
    };
    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Spin size="large" />
        </div>
    );
    return (
        <motion.div
            className="py-6 px-3 sm:px-6"
            style={{ backgroundColor: themeColors.background }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {contextHolder}
            {/* Header */}
            <motion.div
                className="mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: themeColors.text }}>
                    Manage Your Bookings
                </h1>
                <p className="text-xs sm:text-sm" style={{ color: themeColors.lightText }}>
                    View, manage, and cancel your vehicle bookings
                </p>
            </motion.div>

            {/* Stats Summary */}
            {bookingStats && (
                <motion.div
                    className="mb-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border" style={{ borderColor: themeColors.border }}>
                            <div className="text-xs sm:text-sm" style={{ color: themeColors.lightText }}>Total</div>
                            <div className="text-lg sm:text-2xl font-bold mt-1" style={{ color: themeColors.primary }}>
                                {bookingStats.total}
                            </div>
                        </div>
                        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border" style={{ borderColor: themeColors.border }}>
                            <div className="text-xs sm:text-sm" style={{ color: themeColors.lightText }}>Approved</div>
                            <div className="text-lg sm:text-2xl font-bold mt-1" style={{ color: themeColors.accent }}>
                                {bookingStats.approved}
                            </div>
                        </div>
                        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border" style={{ borderColor: themeColors.border }}>
                            <div className="text-xs sm:text-sm" style={{ color: themeColors.lightText }}>Pending</div>
                            <div className="text-lg sm:text-2xl font-bold mt-1" style={{ color: themeColors.warning }}>
                                {bookingStats.pending}
                            </div>
                        </div>
                        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border" style={{ borderColor: themeColors.border }}>
                            <div className="text-xs sm:text-sm" style={{ color: themeColors.lightText }}>Total Spent</div>
                            <div className="text-lg sm:text-2xl font-bold mt-1" style={{ color: themeColors.secondary }}>
                                ${bookingStats.totalSpent.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Bookings Table - Desktop */}
            {bookings?.data && bookings.data.length > 0 ? (
                <>
                    {/* Desktop View */}
                    <div className="hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border"
                            style={{ borderColor: themeColors.border }}
                        >
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
                                    <div>
                                        <h2 className="text-base sm:text-lg font-semibold" style={{ color: themeColors.text }}>
                                            Your Bookings
                                        </h2>

                                    </div>
                                    <div className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: themeColors.background, color: themeColors.lightText }}>
                                        Updated just now
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <div className="min-w-[900px]">
                                        <Table
                                            bordered
                                            dataSource={bookings.data}
                                            columns={desktopColumns}
                                            rowKey="_id"
                                            pagination={{
                                                pageSize: 8,
                                                showSizeChanger: true,
                                                showQuickJumper: true,
                                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
                                                size: 'small'
                                            }}
                                            scroll={{ x: 'max-content' }}
                                            size="small"
                                            className="custom-booking-table"
                                            rowClassName={(record) => normalizeStatus(record.status) === 'cancelled' ? 'opacity-60' : ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Tablet View */}
                    <div className="hidden md:block lg:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border"
                            style={{ borderColor: themeColors.border }}
                        >
                            <div className="p-4">
                                <div className="mb-4">
                                    <h2 className="text-base font-semibold" style={{ color: themeColors.text }}>
                                        Your Bookings
                                    </h2>
                                    <p className="text-xs" style={{ color: themeColors.lightText }}>
                                        Showing {bookings.data.length} booking{bookings.data.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <div className="min-w-[700px]">
                                        <Table
                                            dataSource={bookings.data}
                                            columns={desktopColumns.filter(col =>
                                                !col.responsive ||
                                                col.responsive.includes('md') ||
                                                col.responsive.includes('sm')
                                            )}
                                            rowKey="_id"
                                            pagination={{
                                                pageSize: 6,
                                                showSizeChanger: false,
                                                size: 'small'
                                            }}
                                            scroll={{ x: 'max-content' }}
                                            size="small"
                                            className="custom-booking-table"
                                            rowClassName={(record) => normalizeStatus(record.status) === 'cancelled' ? 'opacity-60' : ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden border"
                            style={{ borderColor: themeColors.border }}
                        >
                            <div className="p-4">
                                <div className="mb-4">
                                    <h2 className="text-base font-semibold" style={{ color: themeColors.text }}>
                                        Your Bookings
                                    </h2>
                                    <p className="text-xs" style={{ color: themeColors.lightText }}>
                                        Showing {bookings.data.length} booking{bookings.data.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {bookings.data.map((booking: Bookings) => (
                                        <MobileBookingCard key={booking._id} booking={booking} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            ) : (
                <motion.div
                    className="text-center py-12 sm:py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block p-6 sm:p-8 rounded-full mb-4 sm:mb-6" style={{ backgroundColor: `${themeColors.primary}10` }}>
                        <CarOutlined style={{ fontSize: '48px', color: themeColors.primary }} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: themeColors.text }}>
                        No Bookings Found
                    </h3>
                    <p className="mb-6 text-sm sm:text-base px-4" style={{ color: themeColors.lightText }}>
                        You haven't made any bookings yet. Start by exploring our available vehicles.
                    </p>
                    <motion.button
                        className="px-6 py-3 rounded-lg font-medium text-white text-sm sm:text-base"
                        style={{ backgroundColor: themeColors.primary }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/dashboard/cars'}
                    >
                        Browse Available Cars
                    </motion.button>
                </motion.div>
            )}

            {/* Cancel Booking Modal */}
            <Modal
                title={
                    <div className="flex items-center space-x-2">
                        <ExclamationCircleOutlined style={{ color: themeColors.danger }} />
                        <span style={{ color: themeColors.text }}>Cancel Booking</span>
                    </div>
                }
                open={modalVisible}
                onOk={handleCancelBooking}
                onCancel={() => setModalVisible(false)}
                confirmLoading={isDeleting}
                centered
                okText="Yes, Cancel Booking"
                cancelText="Go Back"
                className="rounded-lg"
                okButtonProps={{
                    style: {
                        backgroundColor: themeColors.danger,
                        borderColor: themeColors.danger,
                    },
                    className: "hover:opacity-90 transition-all duration-300"
                }}
                cancelButtonProps={{
                    style: {
                        borderColor: themeColors.border,
                        color: themeColors.text,
                    },
                    className: "hover:border-gray-400 transition-all duration-300"
                }}
                styles={{ body: { padding: '20px' } }}
                width={400}
            >
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center mb-4"
                    >
                        <div className="p-4 rounded-full" style={{ backgroundColor: `${themeColors.danger}15` }}>
                            <DeleteOutlined style={{ fontSize: '36px', color: themeColors.danger }} />
                        </div>
                    </motion.div>

                    <p className="text-center text-base font-medium" style={{ color: themeColors.text }}>
                        Cancel booking for
                    </p>
                    <p className="text-center text-lg font-bold mb-2" style={{ color: themeColors.primary }}>
                        "{selectedBookingCar}"?
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg" style={{ backgroundColor: themeColors.background }}>
                        <div className="flex justify-between text-xs">
                            <span style={{ color: themeColors.lightText }}>Cancellation Policy:</span>
                            <span style={{ color: themeColors.danger, fontWeight: 600 }}>Non-refundable</span>
                        </div>
                        <p className="text-xs mt-2" style={{ color: themeColors.lightText }}>
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Custom CSS for Table */}
            <style>{`
                .custom-booking-table .ant-table-thead > tr > th {
                    background-color: ${themeColors.background};
                    border-bottom: 2px solid ${themeColors.border};
                    color: ${themeColors.text};
                    font-weight: 600;
                    padding: 8px 12px;
                    white-space: nowrap;
                }
                
                .custom-booking-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid ${themeColors.border};
                    padding: 8px 12px;
                }
                
                .custom-booking-table .ant-table-tbody > tr:hover > td {
                    background-color: ${themeColors.background} !important;
                }
                
                .ant-pagination-item-active {
                    border-color: ${themeColors.primary} !important;
                }
                
                .ant-pagination-item-active a {
                    color: ${themeColors.primary} !important;
                }
                
                .ant-pagination-item:hover {
                    border-color: ${themeColors.secondary} !important;
                }
                
                .ant-pagination-item:hover a {
                    color: ${themeColors.secondary} !important;
                }
                
                @media (max-width: 768px) {
                    .custom-booking-table .ant-table-thead > tr > th,
                    .custom-booking-table .ant-table-tbody > tr > td {
                        padding: 6px 8px;
                        font-size: 12px;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default MyBooking;