import { Spin, Table, Button, Popconfirm, message, Card, Tag, Space, Avatar, Badge, Tooltip } from "antd";
import { motion } from "framer-motion";
import {
    useGetAllBookingsQuery,
    useDeleteBookingMutation,
    useUpdateBookingMutation,
} from "@/redux/feature/booking/bookingApi";
import type { ColumnsType } from "antd/es/table";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    CarOutlined,
    UserOutlined,
    PhoneOutlined,
    DollarOutlined,
    CalendarOutlined,
    ReloadOutlined,
    EyeOutlined,
    CheckOutlined,
    CloseOutlined
} from "@ant-design/icons";

// Define local types to include missing properties
type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    profileImage?: string;
    address?: string;
};

type Car = {
    name: string;
    image?: string;
    pricePerHour: number;
};

type Bookings = {
    _id: string;
    user: User;
    car: Car;
    date: string;
    startTime: string;
    endTime?: string;
    totalCost?: number;
    status: string;
    paymentStatus: string;
};

const ManageBooking = () => {
    const {
        data: bookings,
        isLoading,
        refetch,
    } = useGetAllBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const [updateBooking] = useUpdateBookingMutation();
    const [cancelBooking] = useDeleteBookingMutation();

    const handleApprove = async (bookingId: string) => {
        try {
            const updatedData = {
                _id: bookingId,
                status: "approved",
            };
            await updateBooking(updatedData).unwrap();
            message.success("Booking approved successfully.");
            refetch();
        } catch (error) {
            message.error("Failed to approve booking.");
        }
    };

    const handleCancel = async (bookingId: string) => {
        try {
            await cancelBooking(bookingId).unwrap();
            message.success("Booking canceled successfully.");
            refetch();
        } catch (error) {
            message.error("Failed to cancel booking.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'success';
            case 'pending': return 'processing';
            case 'canceled': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return <CheckCircleOutlined />;
            case 'pending': return <ClockCircleOutlined />;
            case 'canceled': return <CloseCircleOutlined />;
            default: return null;
        }
    };

    const formatTime = (time: string) => {
        if (!time) return 'N/A';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const columns: ColumnsType<Bookings> = [
        {
            title: (
                <span className="flex items-center gap-2">
                    <UserOutlined />
                    Customer
                </span>
            ),
            key: "customer",
            render: (record: Bookings) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={40}
                        src={record.user?.profileImage}
                        icon={<UserOutlined />}
                        className="border"
                    />
                    <div>
                        <div className="font-medium text-gray-800">{record.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{record.user?.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <PhoneOutlined />
                    Contact
                </span>
            ),
            key: "contact",
            render: (record: Bookings) => (
                <div className="text-gray-700">
                    <div>{record.user?.phone || 'N/A'}</div>
                    <div className="text-xs text-gray-500">
                        {record.user?.address || 'No address'}
                    </div>
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <CarOutlined />
                    Vehicle
                </span>
            ),
            key: "vehicle",
            render: (record: Bookings) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        shape="square"
                        size={40}
                        src={record.car?.image}
                        icon={<CarOutlined />}
                        className="rounded-lg border"
                    />
                    <div>
                        <div className="font-medium">{record.car?.name}</div>
                        <div className="text-xs text-gray-500">
                            ${record.car?.pricePerHour}/hour
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <CalendarOutlined />
                    Schedule
                </span>
            ),
            key: "schedule",
            render: (record: Bookings) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">
                            {new Date(record.date).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="text-xs text-gray-600">
                        {formatTime(record.startTime)} - {record.endTime ? formatTime(record.endTime) : 'Flexible'}
                    </div>
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <DollarOutlined />
                    Payment
                </span>
            ),
            key: "payment",
            render: (record: Bookings) => (
                <div>
                    <div className="font-bold text-[#4335A7]">
                        ${record.totalCost ? Math.round(record.totalCost) : '0'}
                    </div>
                    <div className="text-xs text-gray-500">
                        {record.paymentStatus === 'paid' ? (
                            <Tag color="green" className="text-xs">Paid</Tag>
                        ) : (
                            <Tag color="orange" className="text-xs">Pending</Tag>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag
                    color={getStatusColor(status)}
                    icon={getStatusIcon(status)}
                    className="px-3 py-1 rounded-full capitalize font-medium"
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record: Bookings) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            className="text-gray-500 hover:text-[#4335A7]"
                            size="small"
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Approve this booking?"
                        description="This will confirm the booking and notify the customer."
                        onConfirm={() => handleApprove(record._id)}
                        okText="Approve"
                        cancelText="Cancel"
                        okButtonProps={{
                            className: 'bg-green-600 hover:bg-green-700 border-0',
                            icon: <CheckOutlined />
                        }}
                        disabled={record.status === "approved" || record.status === "canceled"}
                    >
                        <Button
                            type="default"
                            icon={<CheckOutlined />}
                            className={`${record.status === "approved"
                                ? 'bg-green-100 text-green-700 border-green-300'
                                : 'hover:border-green-500 hover:text-green-600'
                                }`}
                            disabled={record.status === "approved" || record.status === "canceled"}
                            size="small"
                        >
                            {record.status === "approved" ? 'Approved' : 'Approve'}
                        </Button>
                    </Popconfirm>

                    <Popconfirm
                        title="Cancel this booking?"
                        description="This action cannot be undone. The customer will be notified."
                        onConfirm={() => handleCancel(record._id)}
                        okText="Cancel Booking"
                        cancelText="Keep"
                        okButtonProps={{
                            danger: true,
                            icon: <CloseOutlined />
                        }}
                        disabled={record.status === "canceled"}
                    >
                        <Button
                            danger
                            icon={<CloseOutlined />}
                            disabled={record.status === "canceled"}
                            size="small"
                        >
                            {record.status === "canceled" ? 'Canceled' : 'Cancel'}
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Loading bookings..." />
            </div>
        );
    }

    const bookingList: Bookings[] = Array.isArray(bookings?.data) ? bookings.data : [];

    // Calculate statistics
    const stats = {
        total: bookingList.length,
        approved: bookingList.filter(b => b.status === 'approved').length,
        pending: bookingList.filter(b => b.status === 'pending').length,
        canceled: bookingList.filter(b => b.status === 'canceled').length,
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}

        >
            {/* Header Card */}
            <Card className="mb-6 border-0 shadow-lg rounded-xl bg-gradient-to-r from-[#4335A7] to-[#6A4BAA]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <CalendarOutlined className="text-white text-lg" />
                            </div>
                            <h1 className="text-2xl font-bold text-white m-0">
                                Booking Management
                            </h1>
                        </div>
                        <p className="text-white/80 m-0">
                            Manage and monitor all vehicle bookings
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge
                            count={stats.total}
                            showZero
                            className="bg-white/20 backdrop-blur-sm"
                        >
                            <Tag className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                                Total
                            </Tag>
                        </Badge>
                        <Tag color="success" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                            Approved: {stats.approved}
                        </Tag>
                        <Tag color="processing" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                            Pending: {stats.pending}
                        </Tag>
                        <Tag color="error" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                            Canceled: {stats.canceled}
                        </Tag>
                    </div>
                </div>
            </Card>

            {/* Main Content Card */}
            <Card
                title={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <CarOutlined className="text-[#4335A7]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 m-0">
                                    All Bookings
                                </h2>
                                <p className="text-gray-500 text-sm m-0">
                                    Manage customer bookings and reservations
                                </p>
                            </div>
                        </div>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={refetch}
                            className="hover:border-[#4335A7] hover:text-[#4335A7]"
                        >
                            Refresh
                        </Button>
                    </div>
                }
                className="border-0 shadow-lg rounded-xl overflow-hidden"
            >
                {bookingList.length === 0 ? (
                    <div className="text-center py-16">
                        <CalendarOutlined className="text-4xl text-gray-300 mb-4" />
                        <h3 className="text-gray-500 mb-2">No bookings found</h3>
                        <p className="text-gray-400">All bookings will appear here</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Table
                            columns={columns}
                            dataSource={bookingList.map((booking: Bookings, index: number) => ({
                                ...booking,
                                key: booking._id || index,
                            }))}
                            pagination={{
                                pageSize: 8,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total) => (
                                    <div className="text-gray-600">
                                        Showing {total} bookings
                                    </div>
                                ),
                            }}
                            scroll={{ x: 1200 }}
                            className="compact-table"
                            rowClassName="hover:bg-gray-50 transition-colors"
                        />
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
};

export default ManageBooking;