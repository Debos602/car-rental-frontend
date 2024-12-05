import { useGetAllOrdersQuery } from "@/redux/feature/order/orderApi";
import { Spin, Card } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { TOrder } from "@/types/global";
import { motion } from "framer-motion";

const TotalRevenue = () => {
    const { data: orders, isLoading } = useGetAllOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    // Calculate total revenue
    const totalRevenue = orders?.data?.reduce(
        (sum: number, order: TOrder) =>
            sum + (order.paymentStatus === "paid" ? order.totalCost : 0),
        0
    );

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
        },
    };

    const iconVariants = {
        hidden: { scale: 0 },
        visible: {
            scale: 1,
            transition: { duration: 0.5, delay: 0.3, ease: "backOut" },
        },
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <motion.div
            className="flex justify-center py-10 px-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Card
                bordered={false}
                className="shadow-lg rounded-lg w-full max-w-md bg-gradient-to-br from-green-100 to-white"
            >
                <motion.div
                    className="text-center mb-6"
                    variants={iconVariants}
                >
                    <DollarCircleOutlined className="text-[#FF7F3E] text-6xl mb-4" />
                    <h2 className="text-2xl font-semibold text-[#4335A7]">
                        Total Revenue
                    </h2>
                </motion.div>
                <div className="text-center">
                    <motion.p
                        className="text-4xl font-bold text-[#FF7F3E] mb-2"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
                    >
                        ${totalRevenue?.toFixed(2) ?? "0.00"}
                    </motion.p>
                    <motion.p
                        className="text-[#6A4BAA] text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        Total from {orders?.data?.length ?? 0} orders
                    </motion.p>
                </div>
            </Card>
        </motion.div>
    );
};

export default TotalRevenue;
