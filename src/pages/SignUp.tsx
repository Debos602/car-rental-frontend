import React, { useState } from "react";
import { Button, Form, Input, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import type { FormProps } from "antd";
import { StoreValue } from "rc-field-form/lib/interface";
import { useSignupMutation } from "@/redux/feature/authApi";
import { Rule } from "antd/es/form";
import { motion } from "framer-motion";
import bgImage from "../../src/assets/img-2.jpg";

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
        <div
            style={{ backgroundImage: `url(${bgImage})` }}
            className="bg-cover bg-center bg-no-repeat relative z-20 "
        >
            <div className="absolute inset-0 w-full h-full bg-[#4335A7] opacity-70 -z-10"></div>
            <div className="container mx-auto flex justify-center items-center py-8 px-4 mt-[84px] md:mt-[132px]">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="bg-[#FFF6E9] shadow-lg rounded-lg p-8 w-full max-w-md"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-[#4335A7]">
                        Create Your Account
                    </h2>
                    <Form
                        name="signup"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <div className="md:flex gap-4"><Form.Item<FieldType>
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your name!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter your full name" />
                        </Form.Item>

                            <Form.Item<FieldType>
                                label="Email Address"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        type: "email",
                                        message: "Please input a valid email address!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter your email address" />
                            </Form.Item></div>

                        <div className="md:flex gap-4 ">
                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password!",
                                    },
                                    { validator: validatePassword },
                                ]}
                            >
                                <Input.Password placeholder="Enter a password" />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Confirm Password"
                                name="confirmPassword"
                                dependencies={["password"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please confirm your password!",
                                    },
                                    matchPasswords,
                                ]}
                            >
                                <Input.Password placeholder="Confirm your password" />
                            </Form.Item>
                        </div>

                        <Form.Item<FieldType> label="Phone Number" name="phone">
                            <Input placeholder="Enter your phone number (optional)" />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="terms"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                new Error(
                                                    "You must accept the terms and conditions"
                                                )
                                            ),
                                },
                            ]}
                        >
                            <Checkbox>
                                I agree to the{" "}
                                <a
                                    href="/terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#FF7F3E] underline"
                                >
                                    Terms & Conditions
                                </a>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                htmlType="submit"
                                className=" rounded-xl w-full py-3 bg-[#4335A7] hover:bg-[#80C4E9] text-white font-semibold text-xl transition-all duration-300"
                                loading={loading}
                            >
                                Sign Up
                            </Button>
                        </Form.Item>

                        <div className="text-center mt-4">
                            <p>
                                Already have an account?{" "}
                                <Link to="/login" className="text-[#FF7F3E]">
                                    Sign In Instead
                                </Link>
                            </p>
                        </div>
                    </Form>

                    <footer className="text-center mt-8">
                        <Link
                            to="/privacy-policy"
                            className="text-gray-500 hover:underline"
                        >
                            Privacy Policy
                        </Link>{" "}
                        |{" "}
                        <Link to="/terms" className="text-gray-500 hover:underline">
                            Terms of Service
                        </Link>
                    </footer>
                </motion.div>
            </div>
        </div>
    );
};

export default SignUp;
