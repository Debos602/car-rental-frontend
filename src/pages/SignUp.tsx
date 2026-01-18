import React, { useState } from "react";
import { Button, Form, Input, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import type { FormProps } from "antd";
import { StoreValue } from "rc-field-form/lib/interface";
import { useSignupMutation } from "@/redux/feature/authApi";
import { Rule } from "antd/es/form";
import { motion } from "framer-motion";
import bgImage from "../../src/assets/img-2.jpg";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import logo from "@/assets/car_lgo.png";

// Define the type for form fields
type FieldType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string; // Phone is optional
    terms: boolean;
};

const SignUp: React.FC = () => {
    const [userSignup] = useSignupMutation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle form submission
    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        setLoading(true);
        try {
            await userSignup(values).unwrap();
            message.success("Registration successful!");
            navigate("/login");
        } catch (error: unknown) {
            if (error instanceof Error) {
                message.error(error.message);
            } else if (typeof error === "object" && error !== null) {
                const { status, data } = error as {
                    status?: number;
                    data?: { message?: string; };
                };
                if (status === 400 && data?.message) {
                    message.error(data.message);
                } else {
                    message.error("An unexpected error occurred.");
                }
            } else {
                message.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {
        message.error("Please correct the errors in the form.");
    };

    const validatePassword = (_: Rule, value: StoreValue) => {
        if (value && value.length < 6) {
            return Promise.reject(
                new Error("Password must be at least 6 characters long.")
            );
        }
        return Promise.resolve();
    };

    const matchPasswords = ({
        getFieldValue,
    }: {
        getFieldValue: (name: string) => StoreValue;
    }) => ({
        validator(_: Rule, value: StoreValue) {
            if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error("Passwords do not match."));
        },
    });

    return (
        <div className="h-screen grid grid-cols-1 md:grid-cols-2">

            {/* Left: full-height image panel */}
            <div className="w-full hidden md:block">
                <div
                    className="relative h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${bgImage})` }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-br from-[#D2691E] to-transparent transform skew-x-[-12deg] -translate-x-6 hidden md:block" />
                    <div className="relative z-10 h-full flex items-center justify-center p-8 md:p-10">
                        <div>
                            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group mb-2">
                                <img
                                    src={logo}
                                    className="h-12 lg:h-14 object-contain group-hover:scale-105 transition-transform duration-300"
                                    alt="Car Rental Logo"
                                />
                                <div className="hidden lg:block">
                                    <h1 className="text-xl font-lora font-bold text-white">Car Rental</h1>
                                    <p className="text-xs text-white">Premium Car Rentals</p>
                                </div>
                            </Link>
                            <motion.h2
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                className="text-4xl md:text-5xl font-extrabold mb-4 text-white"
                            >
                                Join Us <span className="text-[#f16704]">Today!</span>
                            </motion.h2>
                            <motion.p
                                initial={{ y: 8, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-md text-white/80 max-w-sm"
                            >
                                Create an account and start your journey with us.
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: full-height form panel */}
            <div className="w-full flex items-center justify-center bg-white">
                <div className="w-full max-w-md p-6 md:p-10 relative">
                    <div className="absolute top-2 right-4">
                        <Button type="default" icon={<HomeOutlined />} onClick={() => navigate('/')}>Home</Button>
                    </div>
                    <h2 className="text-3xl font-extrabold text-center mb-2 mt-4 md:mt-0 text-[#111827] tracking-wide">Create Your Account</h2>
                    <p className="text-center text-gray-600 mb-6 text-base">Sign up to get started</p>
                    <Form
                        name="signup"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                        className="text-lg"
                    >
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <Form.Item<FieldType>
                                label={<span className="text-lg font-medium text-gray-700">Name</span>}
                                name="name"
                                rules={[{ required: true, message: "Please input your name!" }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-gray-400 text-lg" />}
                                    placeholder="Enter your full name"
                                    className="rounded-md py-3 px-4 text-base"
                                />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label={<span className="text-lg font-medium text-gray-700">Email Address</span>}
                                name="email"
                                rules={[{ required: true, type: "email", message: "Please input a valid email address!" }]}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-gray-400 text-lg" />}
                                    placeholder="Enter your email address"
                                    className="rounded-md py-3 px-4 text-base"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <Form.Item<FieldType>
                                label={<span className="text-lg font-medium text-gray-700">Password</span>}
                                name="password"
                                rules={[{ required: true, message: "Please input your password!" }, { validator: validatePassword }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400 text-lg" />}
                                    placeholder="Enter a password"
                                    className="rounded-md py-3 px-4 text-base"
                                />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label={<span className="text-lg font-medium text-gray-700">Confirm Password</span>}
                                name="confirmPassword"
                                dependencies={["password"]}
                                rules={[{ required: true, message: "Please confirm your password!" }, matchPasswords]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400 text-lg" />}
                                    placeholder="Confirm your password"
                                    className="rounded-md py-3 px-4 text-base"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item<FieldType> label={<span className="text-lg font-medium text-gray-700">Phone Number</span>} name="phone">
                            <Input
                                prefix={<PhoneOutlined className="text-gray-400 text-lg" />}
                                placeholder="Enter your phone number (optional)"
                                className="rounded-md py-3 px-4 text-base"
                            />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="terms"
                            valuePropName="checked"
                            rules={[{ validator: (_, value) => (value ? Promise.resolve() : Promise.reject(new Error("You must accept the terms and conditions"))) }]}
                        >
                            <Checkbox className="text-base">
                                I agree to the{' '}
                                <Link to="/terms" className="text-[#D2691E] font-medium underline">Terms & Conditions</Link>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button htmlType="submit" className="w-full rounded-md py-3 bg-[#D2691E] hover:bg-[#a9572d] text-white font-semibold text-lg" loading={loading}>
                                    Sign Up
                                </Button>
                            </motion.div>
                        </Form.Item>

                        <div className="text-center mt-4">
                            <p className="text-base">Already have an account?{' '}<Link to="/login" className="text-[#D2691E] font-medium hover:underline">Sign In Instead</Link></p>
                        </div>
                    </Form>

                    <div className="text-center mt-6 text-gray-600 text-sm">
                        <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>{' '}
                        |{' '}
                        <Link to="/terms" className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;