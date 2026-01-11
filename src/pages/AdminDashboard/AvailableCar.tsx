import { useGetAvailableCarsQuery } from "@/redux/feature/car/carManagement.api";
import { Spin, Table, Typography, Button, Card, Empty, Tag } from "antd";
import { EyeInvisibleOutlined, ReloadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const AvailableCar = () => {
    const params = { status: "available" };
    const {
        data: cars,
        isLoading,
        isError,
        refetch,
    } = useGetAvailableCarsQuery(params);
    const carsArray = Array.isArray(cars?.data) ? cars.data : [];

    const columns = [
        {
            title: "Car",
            dataIndex: "image",
            key: "image",
            width: 120,
            render: (image: string, record: any) => (
                <div className="flex items-center gap-2">
                    <motion.img
                        src={image}
                        alt="Car"
                        className="h-16 w-24 rounded-lg object-cover border"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    <Text strong className="text-sm block md:hidden">{record.name}</Text>
                </div>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            className: "hidden md:table-cell",
            render: (text: string) => <Text strong>{text}</Text>,
        },
        {
            title: "Details",
            key: "details",
            render: (_: any, record: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full border" style={{ backgroundColor: record.color }} />
                        <Text className="text-sm">{record.color}</Text>
                    </div>
                    <Tag color={record.isElectric ? "green" : "blue"}>
                        {record.isElectric ? "Electric" : "Fuel"}
                    </Tag>
                </div>
            ),
        },
        {
            title: "Price",
            dataIndex: "pricePerHour",
            key: "pricePerHour",
            render: (text: number) => (
                <Text strong className="text-blue-600">${text}/hr</Text>
            ),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            className: "hidden lg:table-cell",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: "available" | "unavailable") => (
                <Tag color={status === "available" ? "success" : "error"} className="capitalize">
                    {status === "available" ? "Available" : "Unavailable"}
                </Tag>
            ),
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } },
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <Spin size="large" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-4">
                <Text type="danger">Failed to load cars</Text>
                <Button onClick={refetch} className="ml-2" size="small">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Card
                bordered={false}
                className="shadow-sm"
                title={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <Title level={4} className="m-0">Available Cars</Title>
                        <Button
                            onClick={refetch}
                            icon={<ReloadOutlined />}
                            size="small"
                        >
                            Refresh
                        </Button>
                    </div>
                }
            >
                {carsArray.length > 0 ? (
                    <Table
                        dataSource={carsArray}
                        columns={columns}
                        rowKey="_id"
                        size="small"
                        pagination={{
                            pageSize: 6,
                            showSizeChanger: false,
                            simple: true,
                        }}
                        className="compact-table"
                    />
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No cars available"
                        className="py-8"
                    />
                )}
            </Card>
        </motion.div>
    );
};

export default AvailableCar;