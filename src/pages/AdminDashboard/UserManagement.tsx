import {
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
} from "@/redux/feature/authApi";
import {
    Table,
    Button,
    message,
    Card,
    Space,
    Spin,
    Tag,
    Avatar,
    Badge,
    Popconfirm,
    Tooltip,
    Row,
    Col,
    Statistic,
    Input,
    Divider
} from "antd";
import {
    UserOutlined,
    MailOutlined,
    CrownOutlined,
    TeamOutlined,
    ReloadOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SettingOutlined,

} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState } from "react";

const { Search } = Input;

// Define the User interface
interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    status?: "active" | "inactive";
    createdAt?: string;
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

    const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
    const [searchTerm, setSearchTerm] = useState("");
    const [userToUpdate, setUserToUpdate] = useState<string | null>(null);

    const users: User[] = usersResponse?.data || [];

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate statistics
    const stats = {
        total: users.length,
        admins: users.filter(user => user.role === "admin").length,
        regular: users.filter(user => user.role === "user").length,
        active: users.filter(user => user.status === "active").length,
    };

    // Handle role update
    const handleUpdateUserRole = async (userId: string, newRole: string) => {
        setUserToUpdate(userId);
        try {
            await updateUserRole({
                userId,
                role: newRole,
            }).unwrap();

            message.success(`User role updated to ${newRole}`);
            refetch();
        } catch (error) {
            message.error("Failed to update user role");
        } finally {
            setUserToUpdate(null);
        }
    };

    // Define columns for the table
    const columns = [
        {
            title: (
                <span className="flex items-center gap-2">
                    <UserOutlined />
                    User
                </span>
            ),
            key: "user",
            render: (record: User) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        className={`border-2 ${record.role === 'admin' ? 'border-yellow-400' : 'border-blue-400'}`}
                        style={{
                            backgroundColor: record.role === 'admin' ? '#fff7e6' : '#e6f7ff'
                        }}
                    />
                    <div>
                        <div className="font-semibold text-gray-800">{record.name}</div>
                        <div className="text-xs text-gray-500">
                            Joined {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <MailOutlined />
                    Contact
                </span>
            ),
            key: "contact",
            render: (record: User) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <MailOutlined className="text-gray-400" />
                        <span className="text-gray-700">{record.email}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        ID: {record._id.slice(-8).toUpperCase()}
                    </div>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string = "active") => (
                <Tag
                    color={status === "active" ? "success" : "error"}
                    className="capitalize px-3 py-1 rounded-full"
                >
                    {status === "active" ? (
                        <span className="flex items-center gap-1">
                            <CheckCircleOutlined />
                            Active
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <CloseCircleOutlined />
                            Inactive
                        </span>
                    )}
                </Tag>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role: string) => (
                <Tag
                    color={role === "admin" ? "gold" : "blue"}
                    icon={role === "admin" ? <CrownOutlined /> : <UserOutlined />}
                    className="px-3 py-1 rounded-full font-medium"
                >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                </Tag>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <SettingOutlined />
                    Actions
                </span>
            ),
            key: "action",
            width: 200,
            render: (record: User) => (
                <Space>
                    {record.role === "admin" ? (
                        <Popconfirm
                            title={
                                <div>
                                    <div className="font-semibold mb-2">Demote to User?</div>
                                    <div className="text-gray-600 text-sm">
                                        This user will lose admin privileges.
                                    </div>
                                </div>
                            }
                            onConfirm={() => handleUpdateUserRole(record._id, "user")}
                            okText="Yes, Demote"
                            cancelText="Cancel"
                            okButtonProps={{
                                danger: true,
                                loading: userToUpdate === record._id && isUpdating
                            }}
                        >
                            <Tooltip title="Remove admin privileges">
                                <Button
                                    type="default"
                                    icon={<UserOutlined />}
                                    loading={userToUpdate === record._id && isUpdating}
                                    className="hover:border-blue-500 hover:text-blue-600"
                                    size="middle"
                                >
                                    Make User
                                </Button>
                            </Tooltip>
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title={
                                <div>
                                    <div className="font-semibold mb-2">Promote to Admin?</div>
                                    <div className="text-gray-600 text-sm">
                                        This user will gain full administrative access.
                                    </div>
                                </div>
                            }
                            onConfirm={() => handleUpdateUserRole(record._id, "admin")}
                            okText="Yes, Promote"
                            cancelText="Cancel"
                            okButtonProps={{
                                className: 'bg-yellow-600 hover:bg-yellow-700 border-0',
                                loading: userToUpdate === record._id && isUpdating
                            }}
                        >
                            <Tooltip title="Grant admin privileges">
                                <Button
                                    type="primary"
                                    icon={<CrownOutlined />}
                                    loading={userToUpdate === record._id && isUpdating}
                                    className="bg-gradient-to-r from-[#4335A7] to-[#6A4BAA] hover:from-[#372887] hover:to-[#5a3c95] border-0"
                                    size="middle"
                                >
                                    Make Admin
                                </Button>
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    // Handle loading and error states
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Loading users..." />
            </div>
        );
    }

    if (isError || !users) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
            >
                <CloseCircleOutlined className="text-4xl text-red-500 mb-4" />
                <h3 className="text-red-600 font-semibold mb-2">Error loading users</h3>
                <p className="text-gray-600">Please try again later</p>
                <Button onClick={refetch} className="mt-4" icon={<ReloadOutlined />}>
                    Retry
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}

        >
            {/* Header Card */}
            <Card className="mb-6 border-0 shadow-lg rounded-xl bg-gradient-to-r from-[#4335A7] to-[#6A4BAA] overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <TeamOutlined className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white m-0">
                                    User Management
                                </h1>
                                <p className="text-white/80 m-0 mt-1">
                                    Manage user roles and permissions
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Badge count={stats.total} showZero overflowCount={99}>
                            <Tag className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                                Total Users
                            </Tag>
                        </Badge>
                        <Badge count={stats.admins} showZero overflowCount={99}>
                            <Tag className="bg-yellow-500/20 backdrop-blur-sm text-white border-yellow-300/30">
                                <CrownOutlined /> Admins
                            </Tag>
                        </Badge>
                        <Badge count={stats.regular} showZero overflowCount={99}>
                            <Tag className="bg-blue-500/20 backdrop-blur-sm text-white border-blue-300/30">
                                <UserOutlined /> Regular
                            </Tag>
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Stats Row */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={6}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Total Users"
                            value={stats.total}
                            prefix={<TeamOutlined className="text-[#4335A7]" />}
                            valueStyle={{ color: '#4335A7' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Administrators"
                            value={stats.admins}
                            prefix={<CrownOutlined className="text-yellow-500" />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Regular Users"
                            value={stats.regular}
                            prefix={<UserOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Active Users"
                            value={stats.active}
                            prefix={<CheckCircleOutlined className="text-green-500" />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Content Card */}
            <Card
                title={
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <SettingOutlined className="text-[#4335A7]" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 m-0">
                                    User Directory
                                </h2>
                                <p className="text-gray-500 text-sm m-0">
                                    Manage user roles and permissions
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Search
                                placeholder="Search users..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64"
                                allowClear
                            />
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={refetch}
                                className="hover:border-[#4335A7] hover:text-[#4335A7]"
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                }
                className="border-0 shadow-lg rounded-xl overflow-hidden"
            >
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-16">
                        <TeamOutlined className="text-4xl text-gray-300 mb-4" />
                        <h3 className="text-gray-500 mb-2">No users found</h3>
                        {searchTerm && (
                            <p className="text-gray-400">Try a different search term</p>
                        )}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Table
                            dataSource={filteredUsers.map(user => ({ ...user, key: user._id }))}
                            columns={columns}
                            pagination={{
                                pageSize: 8,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total) => (
                                    <div className="text-gray-600">
                                        Showing {total} users
                                    </div>
                                ),
                            }}
                            scroll={{ x: 1200 }}
                            className="compact-table"
                            rowClassName={(record) =>
                                record.role === 'admin'
                                    ? 'bg-yellow-50/30 hover:bg-yellow-50'
                                    : 'hover:bg-gray-50'
                            }
                        />
                    </motion.div>
                )}
            </Card>

            {/* Legend */}
            <div className="mt-4 text-sm text-gray-500">
                <Divider orientation="left" className="text-sm">Legend</Divider>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <Tag color="gold" className="px-3 py-1">
                            <CrownOutlined /> Admin
                        </Tag>
                        <span>Full system access</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag color="blue" className="px-3 py-1">
                            <UserOutlined /> User
                        </Tag>
                        <span>Standard user privileges</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserManagement;