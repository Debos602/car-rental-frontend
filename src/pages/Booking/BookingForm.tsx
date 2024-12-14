import { Form, Input, Checkbox, Button, message } from "antd";
import { useDeleteBookingMutation, useGetBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { Bookings, TOrder } from "@/types/global";
import {
    useGetUserQuery,
    useUpdateUserMutation,
} from "@/redux/feature/authApi";
import { motion } from "framer-motion"; // Importing framer-motion
import { useCreateOrderMutation } from "@/redux/feature/order/orderApi";
import { toast } from "sonner";


const BookingForm = () => {
    const [createOrder] = useCreateOrderMutation();
    const { data: booking, isLoading: isBookingLoading } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    const { data: user, isLoading: isUserLoading } = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    const [deleteBooking] = useDeleteBookingMutation();

    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const { endTime, startTime, totalCost, date, user: bookingUser, car, paymentStatus } =
        booking?.data[0] || {};
    const handleCreateOrder = async () => {
        const orderData = {
            carName: car?.name,
            date,
            startTime,
            endTime,
            totalCost,
            name: bookingUser?.name,
            email: bookingUser?.email,
            phone: bookingUser?.phone,
            paymentStatus,
        };

        try {
            const response = await createOrder(orderData).unwrap();
            toast.success("Payment link created successfully");
            deleteBooking(booking?.data[0]?._id);
            window.open(response?.data?.payment_url, "_self");
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    const bookingHistory =
        booking?.data?.map((booking: Bookings) => ({
            carName: booking?.car?.name,
            startTime: booking?.startTime,
            endTime: booking?.endTime,
            totalCost: booking?.totalCost,
            date: booking?.date,
        })) || [];

    const latestBooking = bookingHistory[0] || {};

    const [form] = Form.useForm();

    const onFinish = async (values: TOrder) => {
        try {
            const updatedData = { ...values };
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

    // Check if user or booking data is missing
    if (!user) {
        return <div className="py-16 text-center text-xl text-[#FF7F3E]">User data is empty.</div>;
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* User Information Form */}
                <motion.div
                    className="col-span-8 bg-white p-8 shadow-md border-2 border-[#4335A7]  border-opacity-20 rounded-xl"
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
                        <h3 className="text-2xl font-bold mb-6 text-[#4335A7]">User Information</h3>

                        {/* Form Items */}
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[{ required: true, message: "Please enter your full name" }]}
                            >
                                <Input placeholder="Full Name" className="transition-all duration-300 hover:bg-gray-200" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: "Please enter your email" }]}
                            >
                                <Input placeholder="Email" type="email" className="transition-all duration-300 hover:bg-gray-200" />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                rules={[{ required: true, message: "Please enter your phone number" }]}
                            >
                                <Input placeholder="Phone Number" className="transition-all duration-300 hover:bg-gray-200" />
                            </Form.Item>

                            <Form.Item
                                label="NID/Passport Number"
                                name="nid"
                                rules={[{ required: true, message: "Please enter your NID/Passport number" }]}
                            >
                                <Input placeholder="NID/Passport Number" className="transition-all duration-300 hover:bg-gray-200" />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                label="Driving License"
                                name="drivingLicense"
                                rules={[{ required: true, message: "Please enter your driving license" }]}
                            >
                                <Input placeholder="Driving License" className="transition-all duration-300 hover:bg-gray-200" />
                            </Form.Item>

                            <Form.Item label="Select Additional Features" name="features">
                                <Checkbox.Group>
                                    <Checkbox value="GPS">GPS</Checkbox>
                                    <Checkbox value="Child Seat">Child Seat</Checkbox>
                                    <Checkbox value="Insurance">Insurance</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </div>

                        {/* Submit Button */}
                        <Form.Item>
                            <Button
                                htmlType="submit"

                                loading={isUpdating}
                                className=" bg-[#4335A7] text-md text-white hover:bg-white hover:text-black transition-all duration-700"

                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </motion.div>

                {/* Confirmation Section */}
                <div className="col-span-4">
                    <motion.div
                        className="bg-amber-100  p-8 shadow-md border-2 border-[#4335A7] border-opacity-30 rounded-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {bookingHistory.length > 0 ? (
                            <>
                                <h3 className="text-2xl font-bold text-[#4335A7] mb-4">Booking History</h3>
                                <p className="text-md text-gray-700 mb-2">
                                    You have successfully booked <span className="font-semibold text-orange-700">{latestBooking.carName}</span> for your trip.
                                </p>
                                <p className="text-md font-semibold text-gray-900">
                                    Pick-up Date: <span className="font-normal">{latestBooking.startTime}</span>
                                </p>
                                <p className="text-md font-semibold text-gray-900">
                                    Drop-off Date: <span className="font-normal">{latestBooking.endTime || "N/A"}</span>
                                </p>
                                <p className="text-md font-semibold text-gray-900">
                                    Total Cost: ${" "}
                                    <span className="font-normal">
                                        {latestBooking.totalCost ? latestBooking.totalCost.toFixed(2) : "0.00"}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <p className="text-xl text-gray-700">No booking history available.</p>
                        )}
                        <Button className="bg-[#4335A7] text-white hover:bg-white hover:text-[#4335A7] mt-4" onClick={handleCreateOrder}>Procced To Payment</Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
