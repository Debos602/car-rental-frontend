import React from "react";
import { Button, Checkbox, Form, Input, Tooltip } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { FormProps } from "antd";
import { useLoginMutation } from "@/redux/feature/authApi";
import { useAppDispatch } from "@/redux/hook";
import { setUser } from "@/redux/feature/authSlice";
import { toast } from "sonner";
import bgImage from "../../src/assets/img-1.jpg";
import { motion } from "framer-motion";
import { MailOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";

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
    const handleSetUser = () => {
        // Set the admin credentials in the form
        form.setFieldsValue({
            email: "Rupash.das.02@gmail.com",
            password: "debos123",
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
        <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Left: full-height image panel */}
            <div className="w-full">
                <div
                    className="relative h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgImage})` }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-br from-[#D2691E] to-transparent transform skew-x-[-12deg] -translate-x-6 hidden md:block" />
                    <div className="relative z-10 h-full flex items-center justify-center p-8 md:p-10">
                        <div>
                            <motion.h2
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                className="text-4xl md:text-5xl font-extrabold mb-3 text-white"
                            >
                                Welcome Back!
                            </motion.h2>
                            <motion.p
                                initial={{ y: 8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-md text-white/80 max-w-sm"
                            >
                                Please login to your account and continue your journey with us.
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: full-height form panel */}
            <div className="w-full flex items-center justify-center bg-white">
                <div className="w-full max-w-md p-6 md:p-10 relative">
                    <div className="absolute top-4 right-4">
                        <Button type="default" icon={<HomeOutlined />} onClick={() => navigate('/')}>
                            Home
                        </Button>
                    </div>
                    <h2 className="text-3xl font-extrabold text-center mb-2 text-[#111827] tracking-wide">Log in</h2>
                    <p className="text-center text-gray-600 mb-6 text-base">Sign in to continue</p>
                    <Form
                        form={form}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                        className="text-lg"
                    >
                        <Form.Item<FieldType>
                            label={<span className="text-lg font-medium text-gray-700">Email</span>}
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }]}
                        >
                            <Input prefix={<MailOutlined className="text-gray-400 text-lg" />} placeholder="Enter your email" className="rounded-md py-3 px-4 text-base" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label={<span className="text-lg font-medium text-gray-700">Password</span>}
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password prefix={<LockOutlined className="text-gray-400 text-lg" />} placeholder="Enter your password" className="rounded-md py-3 px-4 text-base" />
                        </Form.Item>

                        <Form.Item<FieldType> name="remember" valuePropName="checked" className="mb-2">
                            <Checkbox className="text-base">Remember me</Checkbox>
                        </Form.Item>

                        <div className="flex justify-between items-center mb-4">
                            <Tooltip title="Fill with admin credentials">
                                <Button type="link" onClick={handleSetAdmin} className="p-0 text-base text-[#D2691E] hover:text-[#a9572d]">Admin Credential</Button>
                            </Tooltip>
                            <Tooltip title="Fill with user credentials">
                                <Button type="link" onClick={handleSetUser} className="p-0 text-base text-[#D2691E] hover:text-[#a9572d]">User Credential</Button>
                            </Tooltip>
                        </div>

                        <div className="text-right mb-6">
                            <Link to="/forgot-password" className="text-[#D2691E] font-medium hover:underline text-base">Forgot Password?</Link>
                        </div>

                        <Form.Item>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button htmlType="submit" className="w-full rounded-md py-3 bg-[#D2691E] hover:bg-[#a9572d] text-white font-semibold text-lg" loading={isLoading}>Log in</Button>
                            </motion.div>
                        </Form.Item>

                        <div className="text-center mt-4">
                            <p className="text-base">Don't have an account?{' '}<Link to="/register" className="text-[#D2691E] font-medium hover:underline">Register here</Link></p>
                        </div>
                    </Form>

                    <div className="text-center mt-6 text-gray-600 text-sm">
                        <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>{' '}
                        |{' '}
                        <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;