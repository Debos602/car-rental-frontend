import {
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
} from "@/redux/feature/authApi";
import { Table, Button, message, Card, Space, Spin } from "antd";
import { UserOutlined, MailOutlined, CrownOutlined } from "@ant-design/icons";
import "antd/dist/reset.css"; // Make sure Ant Design styles are imported
import { motion } from "framer-motion";

// Define the User interface
interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin"; // Ensure roles are lowercase to match the data
}

const UserManagement = () => {
    const {
        data: usersResponse,
        isLoading,
        isError,
        refetch,
    } = useGetAllUsersQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const [updateUserRole] = useUpdateUserRoleMutation(); // Note the correct spelling here
    const users: User[] = usersResponse?.data || [];

    // Example API call for updating user role
    const handleUpdateUserRole = async (userId: string, newRole: string) => {
        try {
            // Call the mutation to update the user role
            const result = await updateUserRole({
                userId,
                role: newRole,
            }).unwrap();

            // Show success message
            message.success(`User role updated to ${result.data.role}`);
            refetch();
            // Optionally, you can refetch users or do something else to reflect the change in the UI
            // This is useful if you want to ensure the state is consistent with the backend
            // await refetch(); // Uncomment if you want to refetch
        } catch (error) {
            message.error("Failed to update user role");
        }
    };

    // Define columns for the table
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name: string) => (
                <div className="flex items-center">
                    <UserOutlined className="mr-2 text-blue-500" />
                    <span className="font-semibold">{name}</span>
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email: string) => (
                <div className="flex items-center">
                    <MailOutlined className="mr-2 text-red-500" />
                    <span>{email}</span>
                </div>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string) => (
                <div className="flex items-center">
                    {role === "admin" ? (
                        <CrownOutlined className="mr-2 text-yellow-500" />
                    ) : (
                        <UserOutlined className="mr-2 text-green-500" />
                    )}
                    <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (record: User) => (
                <Space>
                    {record.role === "admin" ? (
                        <Button
                            type="default"
                            className="bg-gray-200 hover:bg-gray-300 text-black"
                            onClick={() =>
                                handleUpdateUserRole(record._id, "user")
                            }
                        >
                            Make User
                        </Button>
                    ) : (
                        <Button
                            className="bg-[#4335A7] text-white hover:bg-white hover:text-black transition-all duration-700"
                            onClick={() =>
                                handleUpdateUserRole(record._id, "admin")
                            }
                        >
                            Make Admin
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (isError || !users) {
        return (
            <div className="text-center text-red-500 font-semibold">
                Error loading users
            </div>
        );
    }

    return (
        <div>
            <motion.h1
                initial={{ opacity: 0, translateY: -50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }} className="bg-gradient-to-r from-[#4335A7] to-[#6A4BAA] text-[#FFF6E9] text-center py-8 px-4 text-5xl font-semibold uppercase shadow-lg mb-4 mx-4 rounded-xl">
                User Management
            </motion.h1>
            <motion.div initial={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.8, ease: "easeIn" }}>
                <Card className="shadow-xl rounded-xl border border-[#4335A7] mx-4">
                    <Table
                        dataSource={users}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 5 }} // Set pagination
                        rowClassName={() => "text-[#4335A7]"}
                        className="overflow-x-auto"
                    />
                </Card>
            </motion.div>

        </div>
    );
};

export default UserManagement;
