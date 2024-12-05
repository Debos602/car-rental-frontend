import React from "react";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useForgetPasswordMutation } from "@/redux/feature/authApi";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { motion } from "framer-motion";

type FieldType = {
    email: string;
};

const ForgetPassword: React.FC = () => {
    const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

    const onFinish = async (data: FieldType) => {
        try {
            const response = await forgetPassword({
                email: data.email,
            }).unwrap();
            if (response?.success) {
                toast.success("Password reset link has been sent to your email.");
            } else {
                toast.error("Failed to send password reset link.");
            }
        } catch (error) {
            toast.error("Something went wrong, please try again.");
        }
    };

    const onFinishFailed = (errorInfo: ValidateErrorEntity<FieldType>) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div className="container mx-auto flex justify-center items-center min-h-screen" style={{ backgroundColor: "#FFF6E9" }}>
            <motion.div
                className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ backgroundColor: "#FFF6E9" }}
            >
                <h2 className="text-3xl font-semibold text-center mb-6" style={{ color: "#4335A7" }}>
                    Forgot Password
                </h2>
                <p className="text-center mb-4" style={{ color: "#4335A7" }}>
                    Enter your email and we will send you a password reset link.
                </p>
                <Form
                    name="forgot-password"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please input your email!",
                            },
                            {
                                type: "email",
                                message: "The input is not valid E-mail!",
                            },
                        ]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            htmlType="submit"
                            className="w-full py-5 font-semibold text-xl"
                            loading={isLoading}
                            style={{
                                backgroundColor: "#4335A7",
                                color: "white",
                                fontWeight: "bold",
                                transition: "background-color 0.3s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FF7F3E"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4335A7"}
                        >
                            Send Reset Link
                        </Button>
                    </Form.Item>

                    <div className="text-center mt-4">
                        <p>
                            Remembered your password?{" "}
                            <Link to="/login" className="text-blue-600">
                                Login here
                            </Link>
                        </p>
                    </div>
                </Form>
            </motion.div>
        </div>
    );
};

export default ForgetPassword;
