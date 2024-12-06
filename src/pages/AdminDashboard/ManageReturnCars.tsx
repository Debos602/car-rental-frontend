import { Spin, Table, Button, Popconfirm, message, Tooltip } from "antd";
import { motion } from "framer-motion";
import { useGetAllBookingsQuery } from "@/redux/feature/booking/bookingApi";
import type { ColumnsType } from "antd/es/table";
import { TBooking } from "@/types/global";
import { useState } from "react";
import { useReturnCarMutation } from "@/redux/feature/car/carManagement.api";

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
    const [loading, setLoading] = useState(false);

    // Return car handler
    const handleReturnCar = async (bookingId: string) => {
        try {
            setLoading(true);
            const endTime = new Date().toISOString(); // Current time as endTime
            const updatedData = {
                bookingId,
                endTime, // Update the endTime to current time
                status: "completed",
            };

            await returncar(updatedData).unwrap();
            message.success("Car returned successfully.");
            refetch();
        } catch (error) {
            message.error("Failed to return the car.");
        } finally {
            setLoading(false);
        }
    };

    // Define table columns
    const columns: ColumnsType<TBooking> = [
        {
            title: "User Email",
            dataIndex: ["user", "email"],
            key: "userEmail",
        },
        {
            title: "Car Name",
            dataIndex: ["car", "name"],
            key: "carName",
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
            render: (time: string | null) => {
                // Check if time is valid and format it
                const date = new Date(time || 0); // Fallback to epoch if null
                return isNaN(date.getTime())
                    ? "N/A"
                    : date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => status.toUpperCase(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record: TBooking) => (
                <div>
                    <Tooltip title="Return Car">
                        <Popconfirm
                            title="Are you sure you want to return this car?"
                            onConfirm={() => handleReturnCar(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button

                                size="small"
                                disabled={record.status === "completed"}
                                loading={loading}
                                className="bg-[#4335A7] text-white hover:bg-white hover:text-[#4335A7] transition-all duration-300"
                            >
                                Return Car
                            </Button>
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Animated Header */}
            <motion.h1
                initial={{ opacity: 0, translateY: -50 }} // Animation starts above
                animate={{ opacity: 1, translateY: 0 }} // Animates into position
                transition={{ duration: 0.8, ease: "easeIn" }} // Smooth transition
                className="bg-gradient-to-r from-[#4335A7] to-[#6A4BAA] text-[#FFF6E9] text-center py-8 px-4 text-5xl font-semibold uppercase shadow-xl rounded-xl mb-4 mx-4"
            >
                Manage Returns Car
            </motion.h1>

            {/* Table for viewing and managing booked cars */}
            <motion.div
                className="px-4"
                initial={{ opacity: 0, translateY: 50 }} // Animation starts above
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }}

            >
                <Table
                    className="my-4 border border-[#4335A7] rounded-xl shadow-xl text-[#4335A7] p-4 overflow-x-auto"
                    columns={columns}
                    rowClassName={() => "text-[#4335A7]"}
                    dataSource={
                        Array.isArray(bookings?.data)
                            ? bookings.data.map((booking: TBooking, index: number) => ({
                                ...booking,
                                key: index,
                            }))
                            : []
                    }
                    pagination={{ pageSize: 10 }}
                    bordered
                    scroll={{ x: 800 }}
                    tableLayout="auto"

                />
            </motion.div>

        </div >
    );
};

export default ManageReturnCars;
