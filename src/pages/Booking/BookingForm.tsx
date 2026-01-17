import { Form, Input, Checkbox, Button, message } from "antd";
import { Link } from "react-router-dom";
import { useDeleteBookingMutation, useGetBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { Bookings, TOrder } from "@/types/global";
import {
    useGetUserQuery,
    useUpdateUserMutation,
} from "@/redux/feature/authApi";
import { motion } from "framer-motion";
import { useCreateOrderMutation } from "@/redux/feature/order/orderApi";
import { toast } from "sonner";
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, CarOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined } from "@ant-design/icons";

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
            // console.error("Error creating order:", error);
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
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-chocolate border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-base text-chocolate-dark font-medium">Loading your booking details...</p>
                </div>
            </div>
        );
    }

    // Check if user or booking data is missing
    if (!user) {
        return (
            <div className="py-12 text-center text-lg text-chocolate bg-gradient-to-b from-stone-50 to-white min-h-screen flex flex-col justify-center">
                <UserOutlined className="text-4xl mb-3 text-chocolate-light mx-auto" />
                <p className="mb-3">User data is empty.</p>
                <Link to="/login" className="text-chocolate hover:text-chocolate-dark underline">
                    Please login to continue
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Complete Your Booking
                    </h1>

                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* User Information Form */}
                    <motion.div
                        className="lg:col-span-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-chocolate/10">
                            <div className="flex items-center mb-6">
                                <div className="bg-chocolate p-2.5 rounded-lg mr-3">
                                    <UserOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Your Information</h2>
                                    <p className="text-gray-600 text-sm">Update your details for smooth rental</p>
                                </div>
                            </div>

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
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Form.Item
                                            label={
                                                <span className="text-gray-700 font-semibold text-sm">
                                                    <UserOutlined className="mr-2 text-chocolate" />
                                                    Full Name
                                                </span>
                                            }
                                            name="name"
                                            rules={[{ required: true, message: "Please enter your full name" }]}
                                        >
                                            <Input
                                                placeholder="Enter your full name"
                                                className="h-10 rounded-lg border-gray-300 hover:border-chocolate/50 focus:border-chocolate focus:ring-1 focus:ring-chocolate/30 transition-all"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label={
                                                <span className="text-gray-700 font-semibold text-sm">
                                                    <MailOutlined className="mr-2 text-chocolate" />
                                                    Email Address
                                                </span>
                                            }
                                            name="email"
                                            rules={[
                                                { required: true, message: "Please enter your email" },
                                                { type: 'email', message: 'Please enter a valid email' }
                                            ]}
                                        >
                                            <Input
                                                placeholder="Enter your email"
                                                type="email"
                                                className="h-10 rounded-lg border-gray-300 hover:border-chocolate/50 focus:border-chocolate focus:ring-1 focus:ring-chocolate/30 transition-all"
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Form.Item
                                            label={
                                                <span className="text-gray-700 font-semibold text-sm">
                                                    <PhoneOutlined className="mr-2 text-chocolate" />
                                                    Phone Number
                                                </span>
                                            }
                                            name="phone"
                                            rules={[{ required: true, message: "Please enter your phone number" }]}
                                        >
                                            <Input
                                                placeholder="Enter your phone number"
                                                className="h-10 rounded-lg border-gray-300 hover:border-chocolate/50 focus:border-chocolate focus:ring-1 focus:ring-chocolate/30 transition-all"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label={
                                                <span className="text-gray-700 font-semibold text-sm">
                                                    <IdcardOutlined className="mr-2 text-chocolate" />
                                                    NID/Passport
                                                </span>
                                            }
                                            name="nid"
                                            rules={[{ required: true, message: "Please enter your NID/Passport number" }]}
                                        >
                                            <Input
                                                placeholder="Enter NID/Passport number"
                                                className="h-10 rounded-lg border-gray-300 hover:border-chocolate/50 focus:border-chocolate focus:ring-1 focus:ring-chocolate/30 transition-all"
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Form.Item
                                            label={
                                                <span className="text-gray-700 font-semibold text-sm">
                                                    <IdcardOutlined className="mr-2 text-chocolate" />
                                                    Driving License
                                                </span>
                                            }
                                            name="drivingLicense"
                                            rules={[{ required: true, message: "Please enter your driving license" }]}
                                        >
                                            <Input
                                                placeholder="Enter driving license number"
                                                className="h-10 rounded-lg border-gray-300 hover:border-chocolate/50 focus:border-chocolate focus:ring-1 focus:ring-chocolate/30 transition-all"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label={
                                                <span className="text-gray-700 font-semibold text-sm">
                                                    Additional Features
                                                </span>
                                            }
                                            name="features"
                                        >
                                            <Checkbox.Group className="w-full">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {["GPS", "Child Seat", "Insurance", "Roadside Assist"].map((feature) => (
                                                        <Checkbox
                                                            key={feature}
                                                            value={feature}
                                                            className="custom-checkbox"
                                                        >
                                                            <span className="text-gray-700 text-sm">{feature}</span>
                                                        </Checkbox>
                                                    ))}
                                                </div>
                                            </Checkbox.Group>
                                        </Form.Item>
                                    </div>

                                    {/* Submit Button */}
                                    <Form.Item className="mb-0">
                                        <Button
                                            htmlType="submit"
                                            loading={isUpdating}
                                            className="w-full md:w-auto bg-chocolate hover:bg-chocolate-dark text-white font-semibold py-3 px-8 rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 border-0"
                                        >
                                            {isUpdating ? "Updating..." : "Update & Continue"}
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    </motion.div>

                    {/* Confirmation Section */}
                    <motion.div
                        className="lg:col-span-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 border border-chocolate/10 sticky top-6">
                            <div className="flex items-center mb-6">
                                <div className="bg-chocolate p-2.5 rounded-lg mr-3">
                                    <CarOutlined className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                                    <p className="text-gray-600 text-sm">Review your booking</p>
                                </div>
                            </div>

                            {bookingHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Car Details Card */}
                                    <div className="bg-stone-50 rounded-lg p-4 border border-chocolate/10">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={car?.image}
                                                    alt={car?.name}
                                                    className="w-32 h-24 object-cover rounded-lg shadow-sm"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-gray-800 mb-1">
                                                    {car?.name || latestBooking.carName}
                                                </h3>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center text-gray-700">
                                                        <CalendarOutlined className="text-chocolate mr-1.5 text-sm" />
                                                        <span>{date || latestBooking.date}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-700">
                                                        <ClockCircleOutlined className="text-chocolate mr-1.5 text-sm" />
                                                        <span>{startTime || latestBooking.startTime} - {endTime || latestBooking.endTime || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-800">Price Breakdown</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Daily Rate</span>
                                                <span className="font-medium">
                                                    ${totalCost ? totalCost.toFixed(2) : (latestBooking.totalCost ? latestBooking.totalCost.toFixed(2) : '0.00')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Tax (10%)</span>
                                                <span className="font-medium">
                                                    ${totalCost ? (totalCost * 0.1).toFixed(2) : '0.00'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                                <span className="text-gray-600 text-sm">Insurance</span>
                                                <span className="text-green-600 font-medium text-sm">Included</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5">
                                                <span className="text-gray-600 text-sm">Discount</span>
                                                <span className="text-green-600 font-medium text-sm">-$0.00</span>
                                            </div>
                                        </div>

                                        {/* Total Amount */}
                                        <div className="bg-chocolate/5 rounded-lg p-3">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold text-gray-800">Total Amount</div>
                                                    <div className="text-xs text-gray-600">Including all charges</div>
                                                </div>
                                                <div className="text-2xl font-bold text-chocolate">
                                                    ${totalCost ? (totalCost * 1.1).toFixed(2) : (latestBooking.totalCost ? (latestBooking.totalCost * 1.1).toFixed(2) : '0.00')}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-3 pt-2">
                                            <Button
                                                onClick={handleCreateOrder}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 border-0"
                                                icon={<DollarOutlined />}
                                            >
                                                Proceed to Payment
                                            </Button>

                                            <Link to="/cars">
                                                <Button
                                                    className="w-full bg-white text-chocolate hover:text-chocolate-dark hover:bg-chocolate/5 font-medium py-3 rounded-lg border border-chocolate/30 hover:border-chocolate/50 transition-all duration-200"
                                                >
                                                    Browse More Cars
                                                </Button>
                                            </Link>
                                        </div>

                                        {/* Security Badge */}
                                        <div className="text-center pt-3 border-t border-gray-100">
                                            <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-500">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                <span>Secure Payment • SSL Encrypted</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <CarOutlined className="text-4xl text-chocolate/40 mb-3" />
                                    <p className="text-base text-gray-700 mb-3">No active booking found</p>
                                    <Link to="/cars">
                                        <Button
                                            type="primary"
                                            className="bg-chocolate hover:bg-chocolate-dark border-0"
                                        >
                                            Browse Available Cars
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Add custom CSS for chocolate theme */}
            <style>{`
                :root {
                    --chocolate: #7B3F00;
                    --chocolate-light: #A0522D;
                    --chocolate-dark: #5C2E00;
                }
                .bg-chocolate { background-color: #7B3F00 !important; }
                .bg-chocolate-dark { background-color: #5C2E00 !important; }
                .bg-chocolate-light { background-color: #A0522D !important; }
                .text-chocolate { color: #7B3F00 !important; }
                .text-chocolate-dark { color: #5C2E00 !important; }
                .text-chocolate-light { color: #A0522D !important; }
                .border-chocolate { border-color: #7B3F00 !important; }
                
                .custom-checkbox .ant-checkbox-inner {
                    border-radius: 3px;
                    border-color: #d4d4d8;
                }
                .custom-checkbox .ant-checkbox-checked .ant-checkbox-inner {
                    background-color: #7B3F00;
                    border-color: #7B3F00;
                }
                .custom-checkbox .ant-checkbox-wrapper:hover .ant-checkbox-inner,
                .custom-checkbox .ant-checkbox:hover .ant-checkbox-inner {
                    border-color: #7B3F00;
                }
                .ant-btn-primary {
                    background-color: #7B3F00 !important;
                    border-color: #7B3F00 !important;
                }
                .ant-btn-primary:hover {
                    background-color: #5C2E00 !important;
                    border-color: #5C2E00 !important;
                }
            `}</style>
        </div >
    );
};

export default BookingForm;