import { Button, Input, Form, Select, Checkbox, InputNumber, Upload } from "antd";
import { useState } from "react";
import { TCar } from "@/types/global";
import { useCreateCarMutation } from "@/redux/feature/car/carManagement.api";
import { toast } from "sonner";
import { motion } from "framer-motion"; // Import Framer Motion

const { TextArea } = Input;

const AddsCar = () => {
    const [form] = Form.useForm();
    const [isElectric, setIsElectric] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const [createCar] = useCreateCarMutation();

    const handleSubmit = async (values: TCar) => {
        const data = {
            ...values,
            isElectric,
        };

        const formData = new FormData();
        formData.append("car", JSON.stringify(data)); // Key adjusted to match backend
        if (file) {
            formData.append("image", file);
        }

        try {
            await createCar(formData).unwrap();
            toast.success("Car added successfully");
            form.resetFields();
            setFile(null); // Reset file after successful submission
        } catch (error) {
            toast.error("Failed to add car: " + error || "Unknown error");
        }
    };

    const handleFileChange = (file: File) => {
        setFile(file); // Store the file object
    };

    return (
        <div>

            <motion.div
                initial={{ opacity: 0, y: 20 }} // Start below
                animate={{ opacity: 1, y: 0 }} // Animate to normal position
                transition={{ duration: 0.5 }}
                className="border border-[#4335A7] rounded-2xl p-4 mb-4"
            >
                <motion.h2
                    className="text-2xl font-extrabold text-center mb-4 text-[#4335A7]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    Add a New Car
                </motion.h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className=" text-[#4335A7] "

                >
                    <div className="grid grid-cols-2 gap-4">
                        {/* Car Name */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} // Start below
                            animate={{ opacity: 1, y: 0 }} // Animate to normal position
                            transition={{ duration: 0.5 }}
                        >
                            <Form.Item
                                label="Car Name"
                                name="name"
                                rules={[{ required: true, message: "Please enter car name" }]} >
                                <Input
                                    placeholder="Enter car name"
                                    className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-600"
                                />
                            </Form.Item>
                        </motion.div>

                        {/* Color */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} // Start below
                            animate={{ opacity: 1, y: 0 }} // Animate to normal position
                            transition={{ duration: 0.6 }}
                        >
                            <Form.Item
                                label="Color"
                                name="color"
                                rules={[{ required: true, message: "Please enter car color" }]} >
                                <Input
                                    placeholder="Enter car color"
                                    className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-600"
                                />
                            </Form.Item>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} // Start below
                            animate={{ opacity: 1, y: 0 }} // Animate to normal position
                            transition={{ duration: 0.7 }}
                        >
                            <Form.Item
                                label="Features"
                                name="features"
                                rules={[{ required: true, message: "Please enter car features" }]} >
                                <Select
                                    mode="tags"
                                    placeholder="Enter car features (e.g., Bluetooth, GPS)"
                                    className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 w-full"
                                />
                            </Form.Item>
                        </motion.div>

                        {/* Price Per Hour */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} // Start below
                            animate={{ opacity: 1, y: 0 }} // Animate to normal position
                            transition={{ duration: 0.8 }}
                        >
                            <Form.Item
                                label="Price Per Hour ($)"
                                name="pricePerHour"
                                rules={[{ required: true, message: "Please enter price per hour" }]} >
                                <InputNumber
                                    min={1}
                                    placeholder="Enter price per hour"
                                    className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 w-full"
                                />
                            </Form.Item>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Location */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} // Start below
                            animate={{ opacity: 1, y: 0 }} // Animate to normal position
                            transition={{ duration: 0.9 }}
                        >
                            <Form.Item
                                label="Location"
                                name="location"
                                rules={[{ required: true, message: "Please enter car location" }]} >
                                <Input
                                    placeholder="Enter car location"
                                    className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 w-full"
                                />
                            </Form.Item>
                        </motion.div>

                        {/* Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} // Start below
                            animate={{ opacity: 1, y: 0 }} // Animate to normal position
                            transition={{ duration: 1 }}
                        >
                            <Form.Item
                                label="Car Image"
                                rules={[{ required: true, message: "Please upload a car image" }]} >
                                <Upload
                                    beforeUpload={(file) => {
                                        handleFileChange(file);
                                        return false; // Prevent automatic upload
                                    }}
                                    showUploadList={false}
                                >
                                    <Button className="rounded-xl bg-gray-200 hover:bg-gray-300 transition duration-200">
                                        Upload Car Image
                                    </Button>
                                </Upload>
                            </Form.Item>
                        </motion.div>

                        {/* Electric Car Checkbox */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} // Start below
                            animate={{ opacity: 1, y: 0 }} // Animate to normal position
                            transition={{ duration: 1.1 }}
                        >
                            <Form.Item name="isElectric" valuePropName="checked">
                                <Checkbox
                                    onChange={(e) => setIsElectric(e.target.checked)}
                                    className="text-gray-700 w-full"
                                >
                                    Electric Car
                                </Checkbox>
                            </Form.Item>
                        </motion.div>
                    </div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} // Start below
                        animate={{ opacity: 1, y: 0 }} // Animate to normal position
                        transition={{ duration: 1.2 }}
                    >
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: "Please enter a description" }]} >
                            <TextArea
                                rows={4}
                                placeholder="Enter car description"
                                className="rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 w-full"
                            />
                        </Form.Item>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Form.Item className="flex justify-center mt-6">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-12 py-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                Add Car
                            </Button>
                        </Form.Item>
                    </motion.div>
                </Form>
            </motion.div>
        </div>
    );
};

export default AddsCar;
