import { useGetBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { useCreateOrderMutation } from "@/redux/feature/order/orderApi";
import { Bookings } from "@/types/global";
import { Button, Card, Table } from "antd";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Helper function to format the date
const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear().toString().slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
};

const ManagePayment = () => {
    const [createOrder] = useCreateOrderMutation();
    const { data: bookings } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const { endTime, startTime, totalCost, date, user, car, paymentStatus } =
        bookings?.data[0] || {};

    const handleCreateOrder = async () => {
        const orderData = {
            carName: car?.name,
            date,
            startTime,
            endTime,
            totalCost,
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            paymentStatus,
        };

        try {
            const response = await createOrder(orderData).unwrap();
            toast.success("Payment link created successfully");
            window.open(response?.data?.payment_url, "_self");
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    const columns = [
        {
            title: "Car Name",
            key: "carName",
            render: (record: Bookings) => record.car?.name || "N/A",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (date: string | Date) => formatDate(date),
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
            render: (endTime: string | Date) => formatDate(endTime),
        },
        {
            title: "Total Cost",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (totalCost: number) => `$${totalCost.toFixed(2)}`,
        },
    ];

    return (
        <div className="min-h-screen  py-4">
            {/* Animated Header */}
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-[#FFF6E9] bg-gradient-to-r from-[#4335A7] to-[#6E57C9] py-10 text-3xl sm:text-5xl font-normal uppercase rounded-xl mx-4 shadow-lg"
            >
                Manage Payment
            </motion.h1>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="container mx-auto mt-4 px-4 sm:px-8 lg:px-4"
            >
                <Card className="text-center shadow-md border-2 border-[#4335A7]">
                    <h2 className="text-xl font-semibold text-center text-[#4335A7]">
                        Booking Summary
                    </h2>
                    <Table
                        dataSource={bookings?.data || []}
                        columns={columns}
                        rowKey={(record: Bookings) => record._id}
                        pagination={false}
                        className="my-4 overflow-x-auto"
                    />
                    <p className="mt-4 text-lg font-semibold text-[#FF7F3E]">
                        Total Cost: ${totalCost?.toFixed(2) || "0.00"}
                    </p>
                    <Button
                        className="mt-4 bg-[#4335A7] text-white hover:bg-[#FFF6E9] hover:text-[#4335A7] border-2 border-[#4335A7] rounded-xl px-4 py-2 uppercase font-semibold transition duration-300"
                        onClick={handleCreateOrder}
                    >
                        Proceed to Payment
                    </Button>
                </Card>
            </motion.div>
        </div>
    );
};

export default ManagePayment;
