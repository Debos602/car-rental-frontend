import React from "react";
import { Button, Form, Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/redux/feature/auth/authApi"; // Assuming you're using RTK Query

type FieldType = {
    newPassword: string;
    confirmPassword: string;
};

const ResetPassword: React.FC = () => {
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("id");
    const token = searchParams.get("token");

    const onFinish = async (values: FieldType) => {
        if (values.newPassword !== values.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const payload = {
                _id: userId as string,
                newPassword: values.newPassword,
            };

            // Make the API request to reset password
            const response = await resetPassword({ payload, token }).unwrap();

            toast.success(response.message || "Password reset successfully");
            navigate("/login");
        } catch (error) {
            toast.error("Password reset failed, please try again.");
        }
    };

    return (
        <div className="container mx-auto flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center mb-6 text-black">
                    Reset Your Password
                </h2>
                <Form
                    name="reset-password"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please input your new password!",
                            },
                            {
                                min: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Enter your new password" />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your new password!",
                            },
                            {
                                min: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Confirm your new password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoading}
                            className="w-full"
                        >
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ResetPassword;
