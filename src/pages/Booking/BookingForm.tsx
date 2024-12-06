import { Form, Input, Checkbox, Button, message } from "antd";
import { useGetBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { Bookings, TOrder } from "@/types/global";
import {
    useGetUserQuery,
    useUpdateUserMutation,
} from "@/redux/feature/authApi";
import { motion } from "framer-motion";  // Importing framer-motion

const BookingForm = () => {
    const { data: booking, isLoading: isBookingLoading } = useGetBookingsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
        }
    );

    const { data: user, isLoading: isUserLoading } = useGetUserQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            refetchOnFocus: true,
        }
    );

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const bookingHistory =
        booking?.data?.map((booking: Bookings) => ({
            carName: booking?.car?.name,
            startTime: booking?.startTime,
            endTime: booking?.endTime,
            totalCost: booking?.totalCost,
            date: booking?.date,
        })) || [];

    const { carName, startTime, endTime, totalCost, date } =
        bookingHistory[0] || {};

    const [form] = Form.useForm();

    const onFinish = async (values: TOrder) => {
        try {
            const updatedData = {
                ...values,
            };
            await updateUser(updatedData);
            message.success("User data updated successfully!");
        } catch (error) {
            message.error("Failed to update booking.");
        }
    };

    const { name, email, phone } = user?.data || {};

    // Loading spinner
    if (isUserLoading || isBookingLoading || isUpdating) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading......
            </div>
        );
    }
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(endTime));

    // Check if user or booking data is missing
    if (!user) {
        return <div className="py-16 text-center text-xl text-[#FF7F3E]">User booking empty</div>;
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                    className="bg-white p-8 shadow-md rounded-lg col-span-2 border-2 border-[#4335A7] rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            name: name || "",
                            email: email || "",
                            phone: phone || "",
                            nid: "",
                            drivingLicense: "",
                            features: [],
                        }}
                    >
                        <h3 className="text-2xl font-bold mb-6 text-[#4335A7]">
                            User Information
                        </h3>

                        {/* Full Name */}
                        <Form.Item
                            label="Full Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your full name",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Full Name"
                                className="transition-all duration-300 hover:bg-gray-200"
                            />
                        </Form.Item>

                        {/* Email */}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Email"
                                type="email"
                                className="transition-all duration-300 hover:bg-gray-200"
                            />
                        </Form.Item>

                        {/* Phone */}
                        <Form.Item
                            label="Phone Number"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your phone number",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Phone Number"
                                className="transition-all duration-300 hover:bg-gray-200"
                            />
                        </Form.Item>

                        {/* NID/Passport */}
                        <Form.Item
                            label="NID/Passport Number"
                            name="nid"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your NID/Passport number",
                                },
                            ]}
                        >
                            <Input
                                placeholder="NID/Passport Number"
                                className="transition-all duration-300 hover:bg-gray-200"
                            />
                        </Form.Item>

                        {/* Driving License */}
                        <Form.Item
                            label="Driving License"
                            name="drivingLicense"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your driving license",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Driving License"
                                className="transition-all duration-300 hover:bg-gray-200"
                            />
                        </Form.Item>

                        {/* Features */}
                        <Form.Item
                            label="Select Additional Features"
                            name="features"
                        >
                            <Checkbox.Group>
                                <Checkbox value="GPS">GPS</Checkbox>
                                <Checkbox value="Child Seat">Child Seat</Checkbox>
                                <Checkbox value="Insurance">Insurance</Checkbox>
                            </Checkbox.Group>
                        </Form.Item>

                        {/* Submit Button */}
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                block
                                loading={isUpdating}
                                className="uppercase bg-black text-xl text-white hover:bg-white hover:text-black transition-all duration-700"
                                style={{ backgroundColor: "#4335A7" }}
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </motion.div>

                {/* Confirmation Section */}
                <motion.div
                    className="bg-amber-100 p-8 shadow-md border-2 border-[#4335A7] col-span-1 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h3 className="text-2xl font-bold text-[#4335A7] mb-4">
                        Booking Confirmed!
                    </h3>
                    <p className="text-md text-gray-700 mb-2">
                        You have successfully booked {carName} for your trip.
                    </p>
                    <p className="text-md font-semibold text-gray-900">
                        Pick-up Date:{" "}
                        <span className="font-normal">{startTime}</span>
                    </p>
                    <p className="text-md font-semibold text-gray-900">
                        Pick-up Date:{" "}
                        <span className="font-normal">{date}</span>
                    </p>
                    <p className="text-md font-semibold text-gray-900">
                        Drop-off Date:{" "}
                        <span className="font-normal">{formattedDate}</span>
                    </p>
                    <p className="text-md font-semibold text-gray-900">
                        Total Cost: ${" "}
                        <span className="font-normal">{totalCost.toFixed(2)}</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingForm;
