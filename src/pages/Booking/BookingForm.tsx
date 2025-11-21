import { Form, Input, Checkbox, Button, message } from "antd";
import { Link } from "react-router-dom";
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
            toast.error("Need to admin approval");
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
        <div data-theme="light" className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* User Information Form */}
                <motion.div
                    className="col-span-8 bg-white p-8 shadow-lg border-2 rounded-xl"
                    style={{ borderColor: '#D2691E20' }}
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
                        <h3 className="text-2xl font-bold mb-6" style={{ color: '#D2691E' }}>Your Information</h3>

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
                                className=" bg-[#D2691E] text-md text-white hover:bg-white hover:text-[#D2691E] transition-colors duration-300 border border-transparent hover:border-[#D2691E] px-6 py-2"
                            >
                                Update Profile
                            </Button>
                        </Form.Item>
                    </Form>
                </motion.div>

                {/* Confirmation Section */}
                <div className="col-span-4">
                    <motion.div
                        className="bg-white p-6 shadow-lg rounded-xl border"
                        style={{ borderColor: '#D2691E20' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <h3 className="text-2xl font-bold mb-4" style={{ color: '#111827' }}>Order Summary</h3>

                        {bookingHistory.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <img src={car?.image} alt={car?.name} className="h-20 w-28 object-cover rounded-lg shadow-sm" />
                                    <div className="flex-1">
                                        <div className="font-semibold text-black">{car?.name || latestBooking.carName}</div>
                                        <div className="text-sm text-gray-600">{car?.description?.slice(0, 60) || ''}...</div>
                                        <div className="text-sm text-gray-700 mt-2">Pick-up: <span className="font-medium">{startTime || latestBooking.startTime}</span></div>
                                        <div className="text-sm text-gray-700">Drop-off: <span className="font-medium">{endTime || latestBooking.endTime || 'N/A'}</span></div>
                                    </div>
                                </div>

                                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${totalCost ? totalCost.toFixed(2) : (latestBooking.totalCost ? latestBooking.totalCost.toFixed(2) : '0.00')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                                        <span>Tax</span>
                                        <span>${totalCost ? (totalCost * 0.1).toFixed(2) : '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                                        <span>Discount</span>
                                        <span className="text-green-600">-${0.00.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-lg font-bold">Total</div>
                                    <div className="text-2xl font-bold" style={{ color: '#D2691E' }}>${totalCost ? (totalCost * 1.1).toFixed(2) : (latestBooking.totalCost ? (latestBooking.totalCost * 1.1).toFixed(2) : '0.00')}</div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button className="bg-[#D2691E] text-white py-3 rounded-lg hover:bg-[#a8581a] transition" onClick={handleCreateOrder}>Proceed to Payment</Button>
                                    <Link to="/cars" className="text-center border border-gray-200 rounded-lg py-2 hover:bg-gray-50">Continue Browsing</Link>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xl text-gray-700">No booking history available.</p>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
