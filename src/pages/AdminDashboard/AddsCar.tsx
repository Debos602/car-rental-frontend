import {
    Button,
    Input,
    Form,
    Select,
    Checkbox,
    InputNumber,
    Upload,
    Space,
    Divider,
    Card,
    Row,
    Col,
    Tag,
    Avatar
} from "antd";
import { useState } from "react";
import { TCar } from "@/types/global";
import { useCreateCarMutation } from "@/redux/feature/car/carManagement.api";
import { toast } from "sonner";
import {
    UploadOutlined,
    PlusOutlined,
    CarOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    PictureOutlined,
    CheckOutlined,
    CloseOutlined,
    ThunderboltOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { TextArea } = Input;

const AddsCar = () => {
    const [form] = Form.useForm();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isElectric, setIsElectric] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createCar] = useCreateCarMutation();

    const handleSubmit = async (values: TCar) => {
        setIsSubmitting(true);
        const data = { ...values, isElectric };

        const formData = new FormData();
        formData.append("car", JSON.stringify(data));
        if (file) {
            formData.append("image", file);
        }

        try {
            await createCar(formData).unwrap();
            toast.success("🚗 Car added successfully!");
            form.resetFields();
            setFile(null);
            setPreview(null);
            setIsElectric(false);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add car");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (file: File) => {
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        return false;
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Card
                title={
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-[#4335A7] to-[#6A4BAA]">
                            <PlusOutlined className="text-white" />
                        </div>
                        <div>
                            <h2 className="m-0 text-lg font-bold text-gray-800">Add New Vehicle</h2>
                            <p className="m-0 text-sm text-gray-500">Fill in the details below to add a new car</p>
                        </div>
                    </div>
                }
                className="border-0 shadow-lg rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-50"
                styles={{
                    body: { padding: '32px' }
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="space-y-6"
                >
                    {/* Image Preview Section */}
                    {preview && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6"
                        >
                            <div className="flex flex-col items-center">
                                <div className="relative w-48 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                                    <img
                                        src={preview}
                                        alt="Car preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                <Tag color="green" className="mt-2">
                                    <CheckOutlined /> Image Ready
                                </Tag>
                            </div>
                        </motion.div>
                    )}

                    <motion.div variants={itemVariants}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="flex items-center gap-2 font-medium text-gray-700">
                                        <CarOutlined className="text-[#4335A7]" />
                                        Car Name
                                    </span>
                                }
                                name="name"
                                rules={[{ required: true, message: "Please enter car name" }]}
                            >
                                <Input
                                    placeholder="Tesla Model 3, Toyota Camry, etc."
                                    className="h-11 rounded-lg hover:border-[#4335A7] focus:border-[#4335A7] focus:ring-1 focus:ring-[#4335A7] transition-all"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="flex items-center gap-2 font-medium text-gray-700">
                                        <div className="w-3 h-3 rounded-full border" style={{
                                            backgroundColor: form.getFieldValue('color')?.toLowerCase() || '#999'
                                        }} />
                                        Color
                                    </span>
                                }
                                name="color"
                                rules={[{ required: true, message: "Please enter car color" }]}
                            >
                                <Input
                                    placeholder="Midnight Blue, Pearl White, etc."
                                    className="h-11 rounded-lg hover:border-[#4335A7] focus:border-[#4335A7] focus:ring-1 focus:ring-[#4335A7] transition-all"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="flex items-center gap-2 font-medium text-gray-700">
                                        <CarOutlined className="text-[#4335A7]" />
                                        Features
                                    </span>
                                }
                                name="features"
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Bluetooth, GPS, Sunroof, Heated Seats..."
                                    className="rounded-lg hover:border-[#4335A7]"
                                    tagRender={(props) => (
                                        <Tag
                                            {...props}
                                            className="rounded-full px-3 py-1 bg-blue-50 border-blue-200 text-blue-700"
                                        >
                                            {props.label}
                                        </Tag>
                                    )}
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="flex items-center gap-2 font-medium text-gray-700">
                                        <DollarOutlined className="text-[#4335A7]" />
                                        Price Per Hour
                                    </span>
                                }
                                name="pricePerHour"
                                rules={[{ required: true, message: "Please enter price" }]}
                            >
                                <InputNumber
                                    placeholder="25.00"
                                    className="w-full rounded-lg hover:border-[#4335A7] focus:border-[#4335A7]"
                                    min={1}
                                    prefix="$"
                                    size="large"
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}

                                />
                            </Form.Item>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                label={
                                    <span className="flex items-center gap-2 font-medium text-gray-700">
                                        <EnvironmentOutlined className="text-[#4335A7]" />
                                        Location
                                    </span>
                                }
                                name="location"
                                rules={[{ required: true, message: "Please enter location" }]}
                            >
                                <Input
                                    placeholder="Downtown Parking, Airport Terminal, etc."
                                    className="h-11 rounded-lg hover:border-[#4335A7] focus:border-[#4335A7] focus:ring-1 focus:ring-[#4335A7] transition-all"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="flex items-center gap-2 font-medium text-gray-700">
                                        <PictureOutlined className="text-[#4335A7]" />
                                        Car Image
                                    </span>
                                }
                                extra="Upload a clear photo of the vehicle (max 5MB)"
                            >
                                <Upload
                                    beforeUpload={handleFileChange}
                                    showUploadList={false}
                                    accept="image/*"
                                    maxCount={1}
                                >
                                    <Button
                                        icon={<UploadOutlined />}
                                        className={`h-11 rounded-lg w-full ${preview ? 'border-green-500 text-green-600' : 'border-gray-300'}`}
                                        size="large"
                                    >
                                        {preview ? 'Change Image' : 'Click to Upload'}
                                    </Button>
                                </Upload>
                            </Form.Item>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <Form.Item
                                name="isElectric"
                                valuePropName="checked"
                                className="mb-0"
                            >
                                <Checkbox
                                    checked={isElectric}
                                    onChange={(e) => setIsElectric(e.target.checked)}
                                    className="text-base"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isElectric ? 'bg-green-100' : 'bg-gray-100'}`}>
                                            <ThunderboltOutlined className={isElectric ? 'text-green-600' : 'text-gray-400'} />
                                        </div>
                                        <div>
                                            <div className="font-medium">Electric Vehicle</div>
                                            <div className="text-sm text-gray-500">
                                                {isElectric ? 'Environmentally friendly' : 'Standard fuel vehicle'}
                                            </div>
                                        </div>
                                    </div>
                                </Checkbox>
                            </Form.Item>

                            {isElectric && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-green-50 border border-green-200 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-2 text-green-700">
                                        <CheckOutlined />
                                        <span className="font-medium">Eco-friendly choice!</span>
                                    </div>
                                    <div className="text-sm text-green-600 mt-1">
                                        Electric vehicles have lower operating costs
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Form.Item
                            label={
                                <span className="flex items-center gap-2 font-medium text-gray-700">
                                    <CarOutlined className="text-[#4335A7]" />
                                    Description
                                </span>
                            }
                            name="description"
                            rules={[{ required: true, message: "Please enter description" }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Describe the vehicle's condition, features, mileage, and any special notes..."
                                className="rounded-lg hover:border-[#4335A7] focus:border-[#4335A7] focus:ring-1 focus:ring-[#4335A7] transition-all"
                                showCount
                                maxLength={500}
                            />
                        </Form.Item>
                    </motion.div>

                    <Divider className="my-2" />

                    <motion.div variants={itemVariants}>
                        <Form.Item className="mb-0">
                            <div className="flex flex-col sm:flex-row justify-end gap-3">
                                <Button
                                    onClick={() => {
                                        form.resetFields();
                                        setFile(null);
                                        setPreview(null);
                                        setIsElectric(false);
                                    }}
                                    icon={<CloseOutlined />}
                                    className="h-11 px-6 rounded-lg border-gray-300 hover:border-red-300 hover:text-red-500"
                                    size="large"
                                >
                                    Clear All
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                    icon={<PlusOutlined />}
                                    className="h-11 px-8 rounded-lg bg-gradient-to-r from-[#4335A7] to-[#6A4BAA] hover:from-[#372887] hover:to-[#5a3c95] border-0 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                                    size="large"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Vehicle'}
                                </Button>
                            </div>
                        </Form.Item>
                    </motion.div>
                </Form>
            </Card>
        </motion.div>
    );
};

export default AddsCar;