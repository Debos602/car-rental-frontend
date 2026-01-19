import {
    Spin,
    Table,
    Button,
    Popconfirm,
    message,
    Tooltip,
    Card,
    Tag,
    Avatar,
    Badge,
    Row,
    Col,
    Statistic
} from "antd";
import { motion } from "framer-motion";
import { useGetAllBookingsQuery } from "@/redux/feature/booking/bookingApi";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { useReturnCarMutation } from "@/redux/feature/car/carManagement.api";
import {
    CarOutlined,
    UserOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowRightOutlined,
    ReloadOutlined,
    HistoryOutlined,
    DollarOutlined,
    CalendarOutlined,
    KeyOutlined,
    SafetyCertificateOutlined
} from "@ant-design/icons";
import { Bookings } from "@/types/global";



const ManageReturnCars = () => {
    const {
        data: bookings,
        isLoading,
        refetch,
    } = useGetAllBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const [returncar] = useReturnCarMutation();
    const [returningCarId, setReturningCarId] = useState<string | null>(null);

    // Return car handler
    const handleReturnCar = async (bookingId: string) => {
        try {
            setReturningCarId(bookingId);
            const endTime = new Date().toISOString();
            const updatedData = {
                bookingId,
                endTime,
                status: "completed",
            };

            await returncar(updatedData).unwrap();
            message.success("🚗 Car returned successfully!");
            refetch();
        } catch (error: any) {
            message.error(error?.data?.message || "Failed to return the car.");
        } finally {
            setReturningCarId(null);
        }
    };

    const formatTime = (time: string | null | undefined) => {
        if (!time) return 'N/A';
        try {
            const date = new Date(time);
            if (isNaN(date.getTime())) return 'Invalid';
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return 'Invalid';
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return { color: 'success', icon: <CheckCircleOutlined />, label: 'Completed' };
            case 'approved':
                return { color: 'processing', icon: <ClockCircleOutlined />, label: 'Active' };
            case 'pending':
                return { color: 'warning', icon: <ClockCircleOutlined />, label: 'Pending' };
            case 'canceled':
                return { color: 'error', icon: <CloseCircleOutlined />, label: 'Canceled' };
            default:
                return { color: 'default', icon: null, label: status };
        }
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
            render: (_, record) => {
                const name = record.user?.name ?? "Guest";
                const firstLetter = name.charAt(0).toUpperCase();

                return (
                    <div className="flex items-center gap-3">
                        <Avatar
                            size={40}
                            className="border bg-blue-500 text-white font-semibold"
                        >
                            {firstLetter}
                        </Avatar>

                        <div>
                            <div className="font-medium text-gray-800">{name}</div>
                            <div className="text-sm text-gray-500">
                                {record.user?.email ?? "No email"}
                            </div>
                        </div>
                    </div>
                );
            }


        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <CarOutlined />
                    Vehicle
                </span>
            ),
            key: "vehicle",
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        shape="square"
                        size={40}
                        src={record.car?.image}
                        icon={<CarOutlined />}
                        className="rounded-lg border"
                    />
                    <div>
                        <div className="font-medium">{record.car?.name || 'Unknown Car'}</div>
                        <div className="text-xs text-gray-500">
                            ${record.car?.pricePerHour || 0}/hr
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <CalendarOutlined />
                    Booking Period
                </span>
            ),
            key: "period",
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <ClockCircleOutlined className="text-gray-400" />
                        <div className="text-sm">
                            {formatTime(record.startTime)}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500">
                        {formatDate(record.date)}
                    </div>
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <HistoryOutlined />
                    Return Time
                </span>
            ),
            key: "returnTime",
            render: (_, record) => (
                <div>
                    {record.endTime ? (
                        <div className="space-y-1">
                            <div className="text-sm font-medium">
                                {formatTime(record.endTime)}
                            </div>
                            <Tag color="green">
                                Returned
                            </Tag>
                        </div>
                    ) : (
                        <Tag color="orange" icon={<ClockCircleOutlined />}>
                            Pending Return
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <DollarOutlined />
                    Total Cost
                </span>
            ),
            key: "cost",
            render: (_, record) => (
                <div className="font-bold text-[#4335A7]">
                    ${record.totalCost ? Math.round(record.totalCost) : '0'}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const config = getStatusConfig(status);
                return (
                    <Tag
                        color={config.color}
                        icon={config.icon}
                        className="px-3 py-1 rounded-full capitalize font-medium"
                    >
                        {config.label}
                    </Tag>
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => {
                const isCompleted = record.status === "completed";
                const isActive = record.status === "approved";

                return (
                    <Tooltip title={isCompleted ? "Already returned" : "Mark as returned"}>
                        <Popconfirm
                            title={
                                <div>
                                    <div className="font-semibold mb-2">Confirm Car Return?</div>
                                    <div className="text-gray-600 text-sm">
                                        This will mark the car as returned and calculate the final cost.
                                    </div>
                                </div>
                            }
                            description={
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <SafetyCertificateOutlined className="text-green-600" />
                                        <span>This action cannot be undone</span>
                                    </div>
                                </div>
                            }
                            onConfirm={() => handleReturnCar(record._id || '')}
                            okText="Confirm Return"
                            cancelText="Cancel"
                            okButtonProps={{
                                className: 'bg-[#4335A7] hover:bg-[#372887] border-0',
                                icon: <CheckCircleOutlined />,
                                loading: returningCarId === record._id
                            }}
                            disabled={isCompleted}
                        >
                            <Button
                                type={isActive ? "primary" : "default"}
                                danger={isCompleted}
                                icon={<CheckCircleOutlined />}
                                loading={returningCarId === record._id}
                                disabled={isCompleted}
                                className={`${isActive ? 'bg-[#4335A7] hover:bg-[#372887]' : ''} ${isCompleted ? 'opacity-50' : ''}`}
                                size="middle"
                            >
                                {isCompleted ? 'Returned' : 'Return'}
                            </Button>
                        </Popconfirm>
                    </Tooltip>
                );
            },
        },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Loading return records..." />
            </div>
        );
    }

    // Type assertion to BookingWithDetails
    const bookingList = Array.isArray(bookings?.data)
        ? (bookings.data as Bookings[])
        : [];

    const activeReturns = bookingList.filter((b: Bookings) => b.status === "approved" && !b.endTime);
    const completedReturns = bookingList.filter((b: Bookings) => b.status === "completed");
    const pendingReturns = bookingList.filter((b: Bookings) => b.status === "pending");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}

        >
            {/* Header Card */}
            <Card className="mb-6 border-0 shadow-lg rounded-xl bg-gradient-to-r from-[#4335A7] to-[#6A4BAA] overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <KeyOutlined className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white m-0">
                                    Car Returns Management
                                </h1>
                                <p className="text-white/80 m-0 mt-1">
                                    Track and manage vehicle returns
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Badge count={activeReturns.length} showZero overflowCount={99}>
                            <Tag className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                                Active Returns
                            </Tag>
                        </Badge>
                        <Badge count={completedReturns.length} showZero overflowCount={99}>
                            <Tag className="bg-green-500/20 backdrop-blur-sm text-white border-green-300/30">
                                Completed
                            </Tag>
                        </Badge>
                        <Badge count={pendingReturns.length} showZero overflowCount={99}>
                            <Tag className="bg-orange-500/20 backdrop-blur-sm text-white border-orange-300/30">
                                Pending
                            </Tag>
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Stats Row */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={8}>
                    <Card className="border-0 shadow-sm">
                        <Statistic
                            title="Active Returns"
                            value={activeReturns.length}
                            prefix={<ArrowRightOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#4335A7' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="border-0 shadow-sm">
                        <Statistic
                            title="Completed Returns"
                            value={completedReturns.length}
                            prefix={<CheckCircleOutlined className="text-green-500" />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="border-0 shadow-sm">
                        <Statistic
                            title="Pending Approval"
                            value={pendingReturns.length}
                            prefix={<ClockCircleOutlined className="text-orange-500" />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Table Card */}
            <Card
                title={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <CarOutlined className="text-[#4335A7]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 m-0">
                                    All Return Records
                                </h2>
                                <p className="text-gray-500 text-sm m-0">
                                    Manage vehicle returns and track completion
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
                        <HistoryOutlined className="text-4xl text-gray-300 mb-4" />
                        <h3 className="text-gray-500 mb-2">No return records found</h3>
                        <p className="text-gray-400">All returns will appear here</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Table
                            bordered
                            columns={columns}
                            dataSource={bookingList.map((booking: Bookings, index: number) => ({
                                ...booking,
                                key: booking._id || `booking-${index}`,
                            }))}
                            pagination={{
                                pageSize: 8,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total) => (
                                    <div className="text-gray-600">
                                        Showing {total} records
                                    </div>
                                ),
                            }}
                            scroll={{ x: 1200 }}
                            className="compact-table"
                            rowClassName={(record) =>
                                record.status === 'completed'
                                    ? 'bg-green-50/30'
                                    : 'hover:bg-gray-50 transition-colors'
                            }
                        />
                    </motion.div>
                )}
            </Card>
        </motion.div>
    );
};

export default ManageReturnCars;