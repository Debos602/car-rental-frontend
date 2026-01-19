import { useEffect, useState } from "react";
import { useGetAllBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { motion } from "framer-motion";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

type Booking = {
    _id: string;
    user: {
        email: string;
        name: string;
    };
    car: {
        name: string;
    };
    date: string;
    totalCost: number;
    status: 'confirmed' | 'pending' | 'cancelled';
    pickupDate?: string;
    returnDate?: string;
};

const TotalBookings = () => {
    const { data: bookingsData, isLoading } = useGetAllBookingsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
        }
    );

    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const bookings: Booking[] = Array.isArray(bookingsData?.data)
        ? bookingsData.data.map((booking: any) => ({
            ...booking,
            status: booking.status || 'confirmed',
        }))
        : [];

    // Define table columns
    const columns: ColumnsType<Booking> = [
        {
            title: "Customer",
            dataIndex: "user",
            key: "user",
            render: (user: any) => (
                <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>
            ),
        },
        {
            title: "Car",
            dataIndex: ["car", "name"],
            key: "car",
            render: (carName: string) => (
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#D2691E]"></div>
                    <span className="font-medium text-gray-800">{carName}</span>
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => (
                <div className="text-gray-700 font-medium">{date}</div>
            ),
        },
        {
            title: "Total Cost",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (cost: number) => (
                <div className="font-bold text-[#10B981]">${cost.toFixed(2)}</div>
            ),
            sorter: (a: Booking, b: Booking) => a.totalCost - b.totalCost,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                const statusConfig: Record<string, { color: string; icon: JSX.Element; text: string; }> = {
                    confirmed: {
                        color: "green",
                        icon: <CheckCircleOutlined />,
                        text: "Confirmed"
                    },
                    pending: {
                        color: "orange",
                        icon: <ClockCircleOutlined />,
                        text: "Pending"
                    },
                    cancelled: {
                        color: "red",
                        icon: <CloseCircleOutlined />,
                        text: "Cancelled"
                    }
                };
                const config = statusConfig[status] || statusConfig.confirmed;
                return (
                    <Tag
                        icon={config.icon}
                        color={config.color}
                        className="px-3 py-1 rounded-full font-medium"
                    >
                        {config.text}
                    </Tag>
                );
            },
        },
    ];

    if (isLoading && !showContent) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <Spin size="large" className="text-[#4335A7]" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md border border-gray-100"
        >
            {/* Header */}
            <div className="px-2 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Total Bookings</h2>

                    </div>
                    {bookings.length > 0 && (
                        <div className="px-4 py-2 bg-[#4335A7]/10 text-[#4335A7] rounded-lg font-semibold">
                            Total: ${bookings.reduce((sum, b) => sum + b.totalCost, 0).toFixed(2)}
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
            <div>
                {bookings.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Table<Booking>
                            bordered
                            columns={columns}
                            dataSource={bookings}
                            rowKey={(record) => record._id}
                            pagination={{
                                pageSize: 8,
                                showSizeChanger: false,
                                showTotal: (total) => `Showing ${total} bookings`,
                            }}
                            scroll={{ x: 'max-content' }}
                            className="bg-white p-4"
                            rowClassName={(record, index) =>
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center py-12"
                    >
                        <div className="text-4xl text-gray-300 mb-4">
                            📋
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No bookings available</h3>
                        <p className="text-gray-500">There are no bookings to display at the moment.</p>
                    </motion.div>
                )}
            </div>


        </motion.div>
    );
};

export default TotalBookings;