import {
    useGetAllCarsQuery,
    useDeleteCarMutation,
    useUpdateCarMutation,
} from "@/redux/feature/car/carManagement.api";
import {
    Button,
    Spin,
    Table,
    Modal,
    Form,
    Input,
    Upload,
    Card,
    Tag,
    Space,
    Popconfirm,
    Image,
    Avatar,
    Divider,
    InputNumber,
    Switch,
    Select
} from "antd";
import { TCar } from "@/types/global";
import { useState } from "react";
import { toast } from "sonner";
import {
    UploadOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CarOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    ThunderboltOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { TextArea } = Input;

const UpdatesCar = () => {
    const { data: cars, isLoading, refetch } = useGetAllCarsQuery(undefined);
    const [deleteCar] = useDeleteCarMutation();
    const [updateCar] = useUpdateCarMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [form] = Form.useForm();
    const [currentCar, setCurrentCar] = useState<TCar | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const openUpdateModal = (car: TCar) => {
        setCurrentCar(car);
        setPreviewImage(car.image || null);
        form.setFieldsValue({ ...car });
        setIsModalOpen(true);
    };

    const handleDelete = async (carId: string) => {
        setIsDeleting(carId);
        try {
            await deleteCar(carId).unwrap();
            toast.success("Car deleted successfully!");
            refetch();
        } catch (error) {
            toast.error("Failed to delete car");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleImageChange = (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
        return false;
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
            setPreviewImage(null);
            setImageFile(null);
            refetch();
        } catch (error) {
            toast.error("Failed to update car");
        }
    };

    const columns = [
        {
            title: (
                <span className="flex items-center gap-2">
                    <CarOutlined />
                    Vehicle
                </span>
            ),
            key: "vehicle",
            render: (record: TCar) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        shape="square"
                        src={record.image}
                        size={48}
                        className="rounded-lg border"
                        icon={<CarOutlined />}
                    />
                    <div>
                        <div className="font-semibold text-gray-800">{record.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: record.color }} />
                            <span className="text-sm text-gray-500">{record.color}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <DollarOutlined />
                    Pricing
                </span>
            ),
            key: "price",
            render: (record: TCar) => (
                <div>
                    <div className="font-bold text-[#4335A7]">${record.pricePerHour}/hr</div>
                    <div className="text-xs text-gray-500">Per hour</div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag
                    color={status === "available" ? "success" : "error"}
                    className="capitalize px-3 py-1 rounded-full"
                >
                    {status === "available" ? (
                        <span className="flex items-center gap-1">
                            <CheckCircleOutlined />
                            Available
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <CloseCircleOutlined />
                            Unavailable
                        </span>
                    )}
                </Tag>
            ),
        },
        {
            title: "Type",
            key: "type",
            render: (record: TCar) => (
                <Tag
                    color={record.isElectric ? "green" : "blue"}
                    className="flex items-center gap-1 px-3 py-1"
                >
                    {record.isElectric ? (
                        <>
                            <ThunderboltOutlined />
                            Electric
                        </>
                    ) : "Fuel"}
                </Tag>
            ),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: "location",
            render: (location: string) => (
                <div className="flex items-center gap-2 text-gray-600">
                    <EnvironmentOutlined />
                    {location}
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (record: TCar) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => openUpdateModal(record)}
                        className="bg-[#4335A7] hover:bg-[#372887] border-0"
                        size="small"
                    />
                    <Popconfirm
                        title="Delete this car?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            loading={isDeleting === record._id}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Loading vehicles..." />
            </div>
        );
    }

    const carList = Array.isArray(cars?.data) ? cars?.data : [];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                title={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-[#4335A7] to-[#6A4BAA]">
                                    <CarOutlined className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 m-0">Manage Vehicles</h2>
                                    <p className="text-gray-500 text-sm m-0">
                                        {carList.length} vehicles in inventory
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            icon={<SyncOutlined />}
                            onClick={refetch}
                            className="hover:border-[#4335A7] hover:text-[#4335A7]"
                        >
                            Refresh
                        </Button>
                    </div>
                }
                className="border-0 shadow-lg rounded-xl overflow-hidden"
            >
                <AnimatePresence>
                    {carList.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <CarOutlined className="text-4xl text-gray-300 mb-4" />
                            <h3 className="text-gray-500 mb-2">No vehicles found</h3>
                            <p className="text-gray-400">Add some vehicles to get started</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Table
                                dataSource={carList}
                                columns={columns}
                                rowKey="_id"
                                pagination={{
                                    pageSize: 4,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    size: 'small',
                                }}
                                className="compact-table"
                                rowClassName="hover:bg-gray-50 transition-colors"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Update Modal */}
                <Modal
                    title={
                        <div className="flex items-center gap-3">
                            <EditOutlined className="text-[#4335A7]" />
                            <span className="text-lg font-semibold">Update Vehicle</span>
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setPreviewImage(null);
                        setImageFile(null);
                    }}
                    footer={null}
                    width={600}
                    styles={{
                        body: { padding: '24px' },
                        header: { borderBottom: '1px solid #f0f0f0' }
                    }}
                    className="rounded-lg"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdate}
                        className="space-y-4"
                    >
                        {/* Image Preview */}
                        {previewImage && (
                            <div className="flex justify-center mb-4">
                                <div className="relative w-40 h-28 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label="Car Name"
                                name="name"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Vehicle name"
                                    prefix={<CarOutlined className="text-gray-300" />}
                                    className="hover:border-[#4335A7] focus:border-[#4335A7]"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Color"
                                name="color"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Vehicle color"
                                    addonBefore={
                                        <div className="w-4 h-4 rounded-full border" style={{
                                            backgroundColor: form.getFieldValue('color')?.toLowerCase() || '#ccc'
                                        }} />
                                    }
                                    className="hover:border-[#4335A7] focus:border-[#4335A7]"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label="Location"
                                name="location"
                                rules={[{ required: true }]}
                            >
                                <Input
                                    placeholder="Where is it located?"
                                    prefix={<EnvironmentOutlined className="text-gray-300" />}
                                    className="hover:border-[#4335A7] focus:border-[#4335A7]"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Price Per Hour"
                                name="pricePerHour"
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    placeholder="0.00"
                                    min={1}
                                    prefix={<DollarOutlined className="text-gray-300" />}
                                    className="w-full hover:border-[#4335A7] focus:border-[#4335A7]"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label="Image"
                            >
                                <Upload
                                    beforeUpload={handleImageChange}
                                    showUploadList={false}
                                    accept="image/*"
                                    maxCount={1}
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        className="w-full hover:border-[#4335A7] hover:text-[#4335A7]"
                                    >
                                        {previewImage ? 'Change Image' : 'Upload New Image'}
                                    </Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="Status"
                                name="status"
                            >
                                <Select
                                    options={[
                                        { value: 'available', label: 'Available' },
                                        { value: 'unavailable', label: 'Unavailable' },
                                    ]}
                                    className="hover:border-[#4335A7] focus:border-[#4335A7]"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            label="Features"
                            name="features"
                        >
                            <Select
                                mode="tags"
                                placeholder="Add features (Bluetooth, GPS, etc.)"
                                className="hover:border-[#4335A7] focus:border-[#4335A7]"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <TextArea
                                rows={3}
                                placeholder="Vehicle description..."
                                className="hover:border-[#4335A7] focus:border-[#4335A7]"
                            />
                        </Form.Item>

                        <Form.Item
                            name="isElectric"
                            label="Vehicle Type"
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren="Electric"
                                unCheckedChildren="Fuel"
                                className="bg-gray-300"
                                style={{ backgroundColor: form.getFieldValue('isElectric') ? '#52c41a' : '#d9d9d9' }}
                            />
                        </Form.Item>

                        <Divider />

                        <div className="flex justify-end gap-3">
                            <Button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setPreviewImage(null);
                                    setImageFile(null);
                                }}
                                className="hover:border-[#4335A7] hover:text-[#4335A7]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<CheckCircleOutlined />}
                                className="bg-[#4335A7] hover:bg-[#372887] border-0 px-6"
                            >
                                Update Vehicle
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </Card>
        </motion.div>
    );
};

export default UpdatesCar;