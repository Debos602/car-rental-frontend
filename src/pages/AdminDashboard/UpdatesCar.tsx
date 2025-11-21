import {
    useGetAllCarsQuery,
    useDeleteCarMutation,
    useUpdateCarMutation,
} from "@/redux/feature/car/carManagement.api";
import { Button, Spin, Table, Modal, Form, Input, Upload } from "antd";
import { TCar } from "@/types/global";
import { useState } from "react";
import { toast } from "sonner";
import { UploadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion"; // Import Framer Motion

const UpdatesCar = () => {
    const { data: cars, isLoading, refetch } = useGetAllCarsQuery(undefined);
    const [deleteCar] = useDeleteCarMutation();
    const [updateCar] = useUpdateCarMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [currentCar, setCurrentCar] = useState<TCar | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const openUpdateModal = (car: TCar) => {
        setCurrentCar(car);
        form.setFieldsValue({ ...car });
        setIsModalOpen(true);
    };

    const handleDelete = async (carId: string) => {
        try {
            await deleteCar(carId).unwrap();
            toast.success("Car deleted successfully!");
            refetch();
        } catch (error) {
            toast.error("Failed to delete car: " + error);
        }
    };

    const handleImageChange = (file: File) => {
        setImageFile(file);
    };

    const handleUpdate = async (values: TCar) => {
        if (!currentCar) {
            toast.error("No car selected for update.");
            return;
        }

        const formData = new FormData();
        formData.append("car", JSON.stringify({ ...currentCar, ...values }));

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            await updateCar(formData).unwrap();
            toast.success("Car updated successfully!");
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            toast.error("Failed to update car: " + error);
        }
    };

    const columns = [
        {
            title: "Car Name",
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
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Electric",
            dataIndex: "isElectric",
            key: "isElectric",
            render: (text: boolean) => (text ? "Yes" : "No"),
        },
        {
            title: "Actions",
            key: "actions",
            render: (car: TCar) => (
                <div>
                    <Button
                        onClick={() => openUpdateModal(car)}
                        className="mr-2 bg-[#4335A7] text-white hover:bg-white hover:text-[#4335A7] transition-all duration-300"
                    >
                        Update
                    </Button>
                    <Button
                        danger
                        onClick={() => handleDelete(car._id)}
                        className="transition-all duration-300"
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return <Spin size="large">Loading cars...</Spin>;
    }

    const carList = Array.isArray(cars?.data) ? cars?.data : [];

    return (
        <div className="border-2 rounded-xl bg-[#FFF6E9] p-5 border-opacity-10">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto rounded-2xl shadow-xl bg-white p-0"
            >
                <h2 className="text-4xl font-extrabold text-center mb-4 uppercase text-[#4335A7]">
                    Update and Delete Cars
                </h2>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                >
                    <Table
                        dataSource={carList}
                        columns={columns}
                        rowKey="_id"
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                    />
                </motion.div>

                <Modal
                    title="Update Car"
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    className="bg-[#FFF6E9]"
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Form form={form} layout="vertical" onFinish={handleUpdate}>
                            <Form.Item
                                label="Car Name"
                                name="name"
                                rules={[{ required: true, message: "Please enter car name" }]}
                            >
                                <Input placeholder="Enter car name" />
                            </Form.Item>

                            <Form.Item
                                label="Color"
                                name="color"
                                rules={[{ required: true, message: "Please enter car color" }]}
                            >
                                <Input placeholder="Enter car color" />
                            </Form.Item>

                            <Form.Item
                                label="Location"
                                name="location"
                                rules={[{ required: true, message: "Please enter car location" }]}
                            >
                                <Input placeholder="Enter car location" />
                            </Form.Item>

                            <Form.Item label="Image" name="image">
                                <Upload
                                    beforeUpload={(file) => {
                                        handleImageChange(file);
                                        return false; // Prevent automatic upload
                                    }}
                                    maxCount={1}
                                    accept="image/*"
                                >
                                    <Button icon={<UploadOutlined />}>Upload Car Image</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="Price Per Hour"
                                name="pricePerHour"
                                rules={[{ required: true, message: "Please enter price per hour" }]}
                            >
                                <Input type="number" placeholder="Enter price per hour" />
                            </Form.Item>

                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Button
                                    htmlType="submit"
                                    className="w-full bg-[#4335A7] hover:bg-[#80C4E9]"
                                >
                                    Update
                                </Button>
                            </motion.div>
                        </Form>
                    </motion.div>
                </Modal>
            </motion.div>
        </div>
    );
};

export default UpdatesCar;
