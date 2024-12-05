import { Avatar, Card, Button, Form, Input, Spin, Table } from "antd";
import { Bookings, TUser } from "@/types/global";
import {
    useGetUserQuery,
    useUpdateUserMutation,
} from "@/redux/feature/authApi";
import { toast } from "sonner";
import { useGetBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { motion } from "framer-motion";

const Profile = () => {
    const {
        data: user,
        isLoading,
        isError,
        refetch,
    } = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    console.log(user);
    const [updateProfile] = useUpdateUserMutation();
    const { data: bookings } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !user?.data) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Error loading user data</p>
            </div>
        );
    }

    const { name, email, phone, role } = user.data as TUser;

    const bookingHistory = bookings?.data?.map((booking: Bookings) => ({
        carName: booking?.car?.name,
        date: booking?.date,
        startTime: booking?.startTime,
        endTime: booking?.endTime,
        totalCost: booking?.totalCost,
        transactionId: booking?.transactionId,
        paymentStatus: booking?.paymentStatus,
    }));

    const totalCost = bookingHistory?.reduce(
        (acc: number, booking: { totalCost: number; }) => acc + booking.totalCost,
        0
    );

    const handleUpdateProfile = async (values: TUser) => {
        try {
            await updateProfile(values).unwrap();
            toast.success("Profile updated successfully");
            refetch();
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    const columns = [
        {
            title: "Car Name",
            dataIndex: "carName",
            key: "carName",
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Start Time",
            dataIndex: "startTime",
            key: "startTime",
        },
        {
            title: "End Time",
            dataIndex: "endTime",
            key: "endTime",
            render: (endTime: string | null) =>
                endTime ? new Intl.DateTimeFormat('en-GB').format(new Date(endTime)) : "Ongoing",
        },
        {
            title: "Total Cost",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (totalCost: number) => `$${totalCost.toFixed(2)}`,
        },
    ];

    return (
        <div className="min-h-screen bg-[#FFF6E9] px-4 py-4">
            {/* Profile Banner */}
            <motion.div
                className="max-w-full mx-auto mb-8"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Card className="text-center from-[#80C4E9] to-[#FFF6E9] bg-gradient-to-b font-normal uppercase rounded-xl shadow-lg">
                    <Avatar
                        size={120}
                        src="https://i.ibb.co.com/grvH19N/468063584-3886629091578658-8295155366060814102-n.jpg"
                        className="border-4 border-[#FF7F3E]"
                    />
                    <h1 className="text-3xl font-bold mt-4 text-[#4335A7]">{name}</h1>
                    <p className="text-md text-gray-500">
                        <strong>Designation:</strong> {role}
                    </p>
                </Card>
            </motion.div>

            {/* User Information and Booking History */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {/* User Information */}
                <Card className="shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-[#4335A7] mb-4">
                        User Information
                    </h2>
                    <Form layout="vertical" onFinish={handleUpdateProfile}>
                        <Form.Item label="Name" name="name" initialValue={name}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email" initialValue={email}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Phone" name="phone" initialValue={phone}>
                            <Input />
                        </Form.Item>
                        <Form.Item className="text-center">
                            <Button
                                className="bg-[#4335A7] text-white hover:bg-[#FF7F3E]"
                                htmlType="submit"
                            >
                                Update Profile
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Booking History */}
                <Card className="shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-[#4335A7] mb-4 text-center">
                        Booking History
                    </h2>
                    <Table
                        dataSource={bookingHistory}
                        columns={columns}
                        rowKey="transactionId"
                        pagination={false}
                        className="shadow-md overflow-x-auto"
                    />
                    <p className="mt-4 text-lg font-semibold text-center text-[#FF7F3E]">
                        Total Cost: ${totalCost?.toFixed(2)}
                    </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default Profile;
