import { useGetAvailableCarsQuery } from "@/redux/feature/car/carManagement.api";
import { Spin, Table, Typography, Button, Card, Empty } from "antd";
import { EyeInvisibleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title } = Typography;

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
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image: string) => (
                <motion.img
                    src={image}
                    alt="Car"
                    className="h-32 w-52 rounded-3xl border-2 hover:scale-105 transition-transform duration-300 object-cover"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Color",
            dataIndex: "color",
            key: "color",
        },
        {
            title: "Price Per Hour",
            dataIndex: "pricePerHour",
            key: "pricePerHour",
            render: (text: number) => `$${text}`,
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
        },
        {
            title: "Is Electric",
            dataIndex: "isElectric",
            key: "isElectric",
            render: (text: boolean) => (text ? "Yes" : "No"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: "available" | "unavailable") => (
                <>
                    {status === "available" ? (
                        <span style={{ color: "green" }}>Available</span>
                    ) : (
                        <span style={{ color: "red" }}>
                            <EyeInvisibleOutlined style={{ marginRight: 5 }} />
                            Unavailable
                        </span>
                    )}
                </>
            ),
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px] relative">
                <Spin size="large" className="absolute top-1/2 transform -translate-y-1/2" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center min-h-[200px] flex justify-center items-center">
                <p className="text-red-500">Failed to load cars. Please try again later.</p>
            </div>
        );
    }

    return (
        <motion.div
            className="p-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants}>
                <Card
                    bordered
                    className="shadow-lg rounded-lg bg-white max-w-6xl mx-auto"
                >
                    <motion.div
                        className="flex justify-between items-center mb-4"
                        variants={itemVariants}
                    >
                        <Title level={3} className="text-[#4335A7]">
                            Available Cars
                        </Title>
                        <Button onClick={refetch} type="primary" className="bg-[#4335A7]">
                            Refresh Data
                        </Button>
                    </motion.div>
                    {carsArray.length > 0 ? (
                        <motion.div variants={itemVariants}>
                            <Table
                                dataSource={carsArray}
                                columns={columns}
                                rowKey="_id"
                                pagination={{
                                    pageSize: 5,
                                    showSizeChanger: true,
                                    size: "small",
                                }}
                                className="rounded-lg shadow-sm"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            className="flex justify-center items-center min-h-[200px]"
                            variants={itemVariants}
                        >
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="No available cars"
                            />
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default AvailableCar;
