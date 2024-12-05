import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { FormProps } from "antd";
import { useLoginMutation } from "@/redux/feature/authApi";
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/feature/authSlice";
import { toast } from "sonner";
import bgImage from "../../src/assets/img-1.jpg";
import { motion } from "framer-motion";

type FieldType = {
    email?: string;
    password?: string;
    remember?: string;
    credentials?: boolean;
};

const Login: React.FC = () => {
    const [userLogin, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [form] = Form.useForm(); // Get the form instance

    const handleSetAdmin = () => {
        // Set the admin credentials in the form
        form.setFieldsValue({
            email: "debos.das.02@gmail.com",
            password: "123456",
        });
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (data) => {
        try {
            const response = await userLogin(data).unwrap();
            const { data: user, token } = response;
            if (user && token) {
                dispatch(setUser({ user, token }));
                toast.success("Login Successful");

                const redirectPath =
                    location.state?.from?.pathname ||
                    (user.role === "admin" ? "/admin-dashboard" : "/dashboard");
                navigate(redirectPath, { replace: true });
            } else {
                toast.error("Invalid response from server.");
            }
        } catch (error) {
            toast.error("Login failed, please try again.");
        }
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
        errorInfo
    ) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div
            style={{ backgroundImage: `url(${bgImage})` }}
            className="bg-cover bg-center bg-no-repeat relative z-20"
        >
            <div className="absolute inset-0 w-full h-full bg-[#4335A7] opacity-50 -z-10"></div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="container mx-auto flex justify-center items-center min-h-screen mt-[84px] md:mt-[133px] px-4"
            >
                <div className="bg-[#FFF6E9] shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h2 className=" text-2xl md:text-3xl font-semibold text-center mb-6 text-[#4335A7]">
                        Login to Your Account
                    </h2>
                    <Form
                        form={form} // Assign form instance
                        name="basic"
                        initialValues={{ remember: true }}
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
                            <Input
                                placeholder="Enter your email"
                                className="rounded-md"
                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Enter your password"
                                className="rounded-md"
                            />
                        </Form.Item>

                        <div className="flex justify-between">
                            <Form.Item<FieldType>
                                name="remember"
                                valuePropName="checked"
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                            <span onClick={handleSetAdmin} className="underline text-sm mt-1">Admin Credential</span>
                        </div>

                        <div className="text-right mb-4">
                            <Link
                                to="/forgot-password"
                                className="text-[#FF7F3E] hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Form.Item>
                            <Button
                                htmlType="submit"
                                className="w-full rounded-xl py-5 bg-[#4335A7] hover:bg-[#80C4E9] text-white font-semibold text-xl"
                                loading={isLoading}
                            >
                                Log in
                            </Button>
                        </Form.Item>

                        <div className="text-center mt-4">
                            <p>
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-[#FF7F3E] hover:underline"
                                >
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </Form>

                    <div className="text-center mt-6">
                        <Link
                            to="/privacy-policy"
                            className="text-gray-600 hover:underline"
                        >
                            Privacy Policy
                        </Link>{" "}
                        |{" "}
                        <Link
                            to="/terms-of-service"
                            className="text-gray-600 hover:underline"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
