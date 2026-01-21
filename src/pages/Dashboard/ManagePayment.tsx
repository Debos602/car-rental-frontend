import { useGetBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { useCreateOrderMutation } from "@/redux/feature/order/orderApi";
import { Bookings, TOrder } from "@/types/global";
import { Button, Card, Table, Tag, Spin, Typography } from "antd";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
    DollarOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CarOutlined,
    CreditCardOutlined,
    CheckCircleOutlined

} from "@ant-design/icons";
import { formatOnlyTime } from "@/lib/time";

const { Title, Text } = Typography;

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
    border: '#e5e7eb', // Light gray
    success: '#10b981'
};

// Helper function to format the date
const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const ManagePayment = () => {
    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
    const { data: bookings, isLoading: isLoadingBookings } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    console.log("Bookings data:", bookings);

    // Create payment for a specific booking (used by per-row action)
    const handleCreateOrderForBooking = async (booking: Bookings) => {
        if (!booking) {
            toast.error("Invalid booking");
            return;
        }

        const orderData: TOrder = {
            bookingId: booking._id,
            carName: booking.car?.name || "",
            date: booking.date,
            endTime: booking.endTime,
            startTime: booking.startTime,
            totalCost: booking.totalCost || 0,
            transactionId: booking.transactionId || `TXN-${Date.now()}`,
            paymentStatus: booking.paymentStatus || "pending",
            email: booking.user?.email || "",
            phone: booking.user?.phone || "",
            name: booking.user?.name || ""
        };

        try {
            const response = await createOrder(orderData).unwrap();
            toast.success("Payment link created successfully!");
            if (response?.data?.payment_url) {
                window.open(response.data.payment_url, "_self");
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create payment link. Please try again.");
        }
    };

    const columns = [
        {
            title: <span className="font-semibold" style={{ color: themeColors.text }}>Car Details</span>,
            key: "carDetails",
            width: 200,
            render: (record: Bookings) => (
                <div className="flex items-center space-x-3">
                    {record.car?.image && (
                        <img
                            src={record.car.image}
                            alt={record.car?.name || "Car Image"}
                            className="w-12 h-12 object-cover rounded-lg"
                            style={{ border: `2px solid ${themeColors.border}` }}
                        />
                    )}
                    <div>
                        <div className="font-medium text-sm" style={{ color: themeColors.text }}>
                            {record.car?.name || "N/A"}
                        </div>
                        <Text type="secondary" className="text-xs">
                            {record.car?.color || ""}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            title: <span className="font-semibold" style={{ color: themeColors.text }}>Booking Date</span>,
            dataIndex: "date",
            key: "date",
            width: 150,
            render: (date: string | Date) => (
                <div className="flex items-center space-x-2">
                    <CalendarOutlined style={{ color: themeColors.primary, fontSize: '12px' }} />
                    <span className="text-sm" style={{ color: themeColors.text }}>
                        {formatDate(date)}
                    </span>
                </div>
            ),
        },
        {
            title: "Start Time",
            key: "startTime",
            render: (record: Bookings) => (
                <div className="flex items-center space-x-2">
                    <span className="font-medium">
                        {formatOnlyTime(record.startTime)}
                    </span>
                </div>
            ),
        },
        {
            title: "End Time",
            key: "endTime",
            render: (record: Bookings) => (
                <div className="flex items-center space-x-2">
                    <span className="font-medium">
                        {formatOnlyTime(record.endTime)}
                    </span>
                </div>
            ),
        },
        {
            title: <span className="font-semibold" style={{ color: themeColors.text }}>Duration</span>,
            key: "duration",
            width: 100,
            render: (record: Bookings) => {
                try {
                    const start = new Date(record.startTime);
                    const end = new Date(record.endTime);

                    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                        return <div className="text-center">N/A</div>;
                    }

                    const duration =
                        (end.getTime() - start.getTime()) / (1000 * 60 * 60);

                    return (
                        <div className="text-center">
                            <span
                                className="text-sm font-bold"
                                style={{ color: themeColors.primary }}
                            >
                                {duration.toFixed(1)}h
                            </span>
                        </div>
                    );
                } catch {
                    return <div className="text-center">N/A</div>;
                }
            },
        }
        ,
        {
            title: <span className="font-semibold" style={{ color: themeColors.text }}>Amount</span>,
            dataIndex: "totalCost",
            key: "totalCost",
            width: 120,
            render: (totalCost: number) => (
                <div className="flex items-center space-x-2">
                    <DollarOutlined style={{ color: themeColors.accent }} />
                    <span className="font-bold text-lg" style={{ color: themeColors.text }}>
                        ${totalCost?.toFixed(2) || "0.00"}
                    </span>
                </div>
            ),
        },
        {
            title: <span className="font-semibold" style={{ color: themeColors.text }}>Status</span>,
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            width: 120,
            render: (status: string) => (
                <Tag
                    color={status === 'paid' ? 'success' : 'warning'}
                    icon={status === 'paid' ? <CheckCircleOutlined /> : <CreditCardOutlined />}
                    className="flex items-center justify-center space-x-1 py-1 px-2 rounded-full text-xs font-medium"
                >
                    {status?.toUpperCase() || 'PENDING'}
                </Tag>
            ),
        },
        {
            title: <span className="font-semibold" style={{ color: themeColors.text }}>Actions</span>,
            key: 'actions',
            width: 160,
            render: (record: Bookings) => (
                <div className="flex items-center gap-2">
                    {(() => {
                        const isPaid = record.paymentStatus === 'paid';
                        return (
                            <Button
                                type={isPaid ? 'default' : 'primary'}
                                size="middle"
                                onClick={() => !isPaid && handleCreateOrderForBooking(record)}
                                loading={isCreatingOrder && !isPaid}
                                disabled={isPaid || isCreatingOrder}
                                style={{ backgroundColor: isPaid ? undefined : themeColors.primary }}
                            >
                                {isPaid ? 'Paid' : 'Pay Now'}
                            </Button>
                        );
                    })()}
                </div>
            ),
        },
    ];

    // Get all bookings
    const allBookings: Bookings[] = bookings?.data || [];

    // Calculate statistics
    const totalBookingsCount = allBookings.length;
    const unpaidBookings = allBookings.filter(b => b.paymentStatus !== 'paid');
    const totalUnpaidAmount = unpaidBookings.reduce((sum: number, booking: Bookings) => sum + (booking.totalCost || 0), 0);
    const pendingBookingsCount = unpaidBookings.length;

    if (isLoadingBookings) {
        return (
            <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: themeColors.background }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Animated Header */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <Title level={2} className=" mb-2" style={{ color: themeColors.text }}>
                    Payment Management
                </Title>

            </motion.div>

            {/* Payment Summary Stats */}
            {totalBookingsCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card size="small" className="text-center" style={{ borderColor: themeColors.border }}>
                            <div className="text-sm" style={{ color: themeColors.lightText }}>Total Bookings</div>
                            <div className="text-2xl font-bold mt-1" style={{ color: themeColors.primary }}>
                                {totalBookingsCount}
                            </div>
                        </Card>
                        <Card size="small" className="text-center" style={{ borderColor: themeColors.border }}>
                            <div className="text-sm" style={{ color: themeColors.lightText }}>Pending Payments</div>
                            <div className="text-2xl font-bold mt-1" style={{ color: themeColors.warning }}>
                                {pendingBookingsCount}
                            </div>
                        </Card>
                        <Card size="small" className="text-center" style={{ borderColor: themeColors.border }}>
                            <div className="text-sm" style={{ color: themeColors.lightText }}>Total Amount</div>
                            <div className="text-2xl font-bold mt-1" style={{ color: themeColors.secondary }}>
                                ${totalUnpaidAmount.toFixed(2)}
                            </div>
                        </Card>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}

            >
                <Card
                    className="shadow-lg border"
                    style={{
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.card
                    }}
                >
                    {/* Card Header */}
                    <div className="mb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <Title level={3} style={{ color: themeColors.text }}>Payment Overview</Title>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CreditCardOutlined style={{ color: themeColors.primary, fontSize: '20px' }} />
                                <Text strong style={{ color: themeColors.text }}>
                                    Secure Payment Gateway
                                </Text>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="mb-6">
                        <div className="overflow-x-auto">
                            <Table
                                bordered
                                dataSource={allBookings}
                                columns={columns}
                                rowKey={(record: Bookings) => record._id}
                                pagination={{ pageSize: 5, showSizeChanger: true }}
                                className="custom-payment-table"
                                scroll={{ x: 900 }}
                                size="middle"
                                rowClassName="hover:bg-gray-50"
                                locale={{
                                    emptyText: (
                                        <div className="py-8 text-center">
                                            <CreditCardOutlined style={{ fontSize: '48px', color: themeColors.lightText, marginBottom: '16px' }} />
                                            <Text type="secondary">No bookings found. Create a booking first.</Text>
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    </div>
                </Card>

                {/* Payment Information */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <Card size="small" className="text-center" style={{ borderColor: themeColors.border }}>
                        <CarOutlined style={{ color: themeColors.primary, fontSize: '24px', marginBottom: '12px' }} />
                        <Text strong className="block mb-1" style={{ color: themeColors.text }}>Instant Confirmation</Text>
                        <Text type="secondary" className="text-xs">Get immediate booking confirmation upon payment</Text>
                    </Card>
                    <Card size="small" className="text-center" style={{ borderColor: themeColors.border }}>
                        <CreditCardOutlined style={{ color: themeColors.accent, fontSize: '24px', marginBottom: '12px' }} />
                        <Text strong className="block mb-1" style={{ color: themeColors.text }}>Secure Payment</Text>
                        <Text type="secondary" className="text-xs">Your payment information is protected with encryption</Text>
                    </Card>
                    <Card size="small" className="text-center" style={{ borderColor: themeColors.border }}>
                        <ClockCircleOutlined style={{ color: themeColors.warning, fontSize: '24px', marginBottom: '12px' }} />
                        <Text strong className="block mb-1" style={{ color: themeColors.text }}>24/7 Support</Text>
                        <Text type="secondary" className="text-xs">Round-the-clock customer support available</Text>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Custom CSS */}
            <style>{`
                .custom-payment-table .ant-table-thead > tr > th {
                    background-color: ${themeColors.background};
                    border-bottom: 2px solid ${themeColors.border};
                    color: ${themeColors.text};
                    font-weight: 600;
                }
                
                .custom-payment-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid ${themeColors.border};
                }
                
                .custom-payment-table .ant-table-tbody > tr:hover > td {
                    background-color: ${themeColors.background} !important;
                }
                
                @media (max-width: 768px) {
                    .custom-payment-table .ant-table-thead > tr > th,
                    .custom-payment-table .ant-table-tbody > tr > td {
                        padding: 8px 4px;
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ManagePayment;