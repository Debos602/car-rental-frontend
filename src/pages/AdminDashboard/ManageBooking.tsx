import { Spin, Table, Button, Popconfirm, message } from "antd";
import { motion } from "framer-motion";
import {
    useGetAllBookingsQuery,
    useDeleteBookingMutation,
    useUpdateBookingMutation,
} from "@/redux/feature/booking/bookingApi";
import type { ColumnsType } from "antd/es/table";
import { TBooking } from "@/types/global";

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

    // Approve booking handler
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

    // Cancel booking handler
    const handleCancel = async (bookingId: string) => {
        try {
            await cancelBooking(bookingId).unwrap();
            message.success("Booking canceled successfully.");
            refetch();
        } catch (error) {
            message.error("Failed to cancel booking.");
        }
    };

    // Define table columns
    const columns: ColumnsType<TBooking> = [
        {
            title: "User Email",
            dataIndex: ["user", "email"],
            key: "userEmail",
            responsive: ["md"],
        },
        {
            title: "Phone",
            dataIndex: ["user", "phone"],
            key: "userPhone",
            responsive: ["md"],
        },
        {
            title: "Car Name",
            dataIndex: ["car", "name"],
            key: "carName",
        },
        {
            title: "Price Per Hour",
            dataIndex: ["car", "pricePerHour"],
            key: "pricePerHour",
            render: (price: number) => `$${price}`,
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string) => new Date(date).toLocaleDateString(),
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
            render: (time: string | null) =>
                time
                    ? new Date(`1970-01-01T${time}`).toLocaleTimeString()
                    : "N/A",
        },
        {
            title: "Total Cost",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (cost: number) => (cost ? `$${Math.round(cost)}` : "N/A"),
        },
        {
            title: "Booking Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => status.toUpperCase(),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record: TBooking) => (
                <div className="flex space-x-2">
                    <Popconfirm
                        title="Are you sure you want to approve this booking?"
                        onConfirm={() => handleApprove(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            size="small"
                            className="mr-2 bg-[#4335A7] text-[#FFF6E9]"
                            disabled={record.status === "approved"}
                        >
                            Approve
                        </Button>
                    </Popconfirm>

                    <Popconfirm
                        title="Are you sure you want to cancel this booking?"
                        onConfirm={() => handleCancel(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            size="small"
                            disabled={record.status === "canceled"}
                        >
                            Cancel
                        </Button>
                    </Popconfirm>
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
        <div
        >
            <motion.h1
                initial={{ opacity: 0, translateY: -50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }} className="bg-[#4335A7] bg-opacity-70 text-[#FFF6E9] text-center py-5 px-4 text-xl font-semibold uppercase shadow-lg mb-4 mx-4 rounded-xl">
                Manage Bookings
            </motion.h1>

            <motion.div className="px-4" initial={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }}>
                <Table
                    columns={columns}
                    dataSource={
                        Array.isArray(bookings?.data)
                            ? bookings.data.map(
                                (booking: TBooking, index: number) => ({
                                    ...booking,
                                    key: index,
                                })
                            )
                            : []
                    }
                    pagination={{
                        defaultPageSize: 5, // Show 5 items per page by default
                        pageSizeOptions: ['5', '10', '20'], // Available page size options
                        showSizeChanger: true, // Allow changing the page size
                        showTotal: (total) => `Total ${total} items`, // Display total items
                    }}

                    scroll={{ x: 800 }}
                    className="w-full overflow-auto border border-[#4335A7] border-opacity-10 rounded-xl"

                    rowClassName={() => "text-[#4335A7]"}
                />

            </motion.div>
        </div >
    );
};

export default ManageBooking;
