import { useEffect, useState } from "react";
import { useGetAllBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { Spin, Table } from "antd";
import { motion } from "framer-motion";

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
        }, 3000); // 3 seconds delay

        return () => clearTimeout(timer);
    }, []);

    const bookings: Booking[] = Array.isArray(bookingsData?.data)
        ? bookingsData.data
        : [];

    // Define table columns
    const columns = [
        {
            title: "Email",
            dataIndex: ["user", "email"],
            key: "email",
        },
        {
            title: "User",
            dataIndex: ["user", "name"],
            key: "user",
        },
        {
            title: "Car Brand",
            dataIndex: ["car", "name"],
            key: "car",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Total Cost",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (cost: number) => `$${cost.toFixed(2)}`,
        },
    ];

    if (isLoading && !showContent) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin className="text-[#4335A7]" size="large" />
            </div>
        );
    }

    return (
        <motion.div
            className="p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg bg-white sm:bg-[#f5f5f5] lg:bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-[#4335A7] text-center sm:text-left">
                Total Bookings
                {bookings.length > 0 ? ` (${bookings.length})` : ""}
            </h1>
            {bookings.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Table
                        columns={columns}
                        dataSource={bookings}
                        rowKey={(record) => record._id}
                        pagination={{
                            pageSize: 5,
                        }}
                        className="overflow-x-auto w-full"
                        rowClassName={() => "text-[#4335A7]"}
                    />
                </motion.div>
            ) : (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center text-[#FF7F3E]"
                >
                    No bookings available
                </motion.p>
            )}
        </motion.div>
    );
};

export default TotalBookings;
