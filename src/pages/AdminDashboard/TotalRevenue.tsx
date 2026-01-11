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

    const totalRevenue = orders?.data?.reduce(
        (sum: number, order: TOrder) =>
            sum + (order.paymentStatus === "paid" ? order.totalCost : 0),
        0
    );

    if (isLoading) {
        return (
            <Card bordered className="p-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    <div className="space-y-1 flex-1">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 w-24 bg-gray-300 rounded animate-pulse" />
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card bordered className="p-4 hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                        <DollarCircleOutlined className="text-green-600 text-lg" />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                        <div className="text-2xl font-bold text-gray-800">
                            ${totalRevenue?.toFixed(2) || "0.00"}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">
                        {orders?.data?.length || 0} orders
                    </div>
                    <div className="text-xs text-green-600">
                        All paid
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TotalRevenue;