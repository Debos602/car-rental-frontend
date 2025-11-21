import { Card, Button, Form, Input, Spin, Table } from "antd";
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
        <div className="min-h-screen px-4 py-4">
            {/* Profile Banner */}
            <motion.div
                className="max-w-full mx-auto mb-6"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-end gap-6 shadow-lg rounded-xl p-6 bg-[#4335A7] bg-opacity-70 ">
                    {/* Profile Image */}
                    <img
                        className="object-cover w-28 h-28 rounded-xl border-4 border-[#FFF6E9] shadow-md"
                        src="https://i.ibb.co/grvH19N/468063584-3886629091578658-8295155366060814102-n.jpg"
                        alt="Profile"
                    />

                    {/* User Details */}
                    <div className="text-[#FFF6E9]">
                        <p className="text-md m-1">
                            <span className="text-[#FFD700]">Name:</span> {name}
                        </p>
                        <p className="text-md m-1">
                            <span className="text-[#FFD700]">Role:</span> {role}
                        </p>
                        <p className="text-md m-1">
                            <span className="text-[#FFD700]">Email:</span> {email}
                        </p>

                    </div>
                </div>
            </motion.div>


            {/* User Information and Booking History */}
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {/* User Information */}
                <Card className="col-span-1 shadow-lg p-6 border-2 border-[#4335A7] border-opacity-10">
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
                <Card className="col-span-2 shadow-lg p-6 border-2 border-[#4335A7] border-opacity-10">
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
