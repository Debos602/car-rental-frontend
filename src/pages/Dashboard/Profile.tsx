import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Spin, Table, Typography, Avatar, Tabs, Badge, Row, Col, message, Divider, Upload } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { Bookings, TUser } from "@/types/global";
import {
    useGetUserQuery,
    useUpdateUserMutation,
} from "@/redux/feature/auth/authApi";
import { toast } from "sonner";
import { useGetBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { motion } from "framer-motion";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CarOutlined,

    EditOutlined,
    UploadOutlined,
    HistoryOutlined,

    CloseCircleOutlined,
    SafetyOutlined,
    CreditCardOutlined,
    LogoutOutlined,
    TrophyOutlined,
    DashboardOutlined,

    EyeOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
import DashboardStats from './components/DashboardStats';
import QuickActions from './components/QuickActions';
import PaymentSummary from './components/PaymentSummary';
import { themeColors, formatCurrency, formatDate, formatTime, calculateDuration, ProcessedBooking } from './components/profileUtils';

const Profile = () => {
    const [form] = Form.useForm();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        data: user,
        isLoading,
        isError,
        refetch,
    } = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    // console.log("Fetched User Data:", user);

    const [updateProfile] = useUpdateUserMutation();

    const { data: bookings, isLoading: isLoadingBookings } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        setPreviewUrl((user?.data as TUser)?.image || null);
    }, [user?.data?.image]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: themeColors.background }}>
                <Spin size="large" style={{ color: themeColors.primary }} />
            </div>
        );
    }

    if (isError || !user?.data) {
        return (
            <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: themeColors.background }}>
                <div className="text-center">
                    <CloseCircleOutlined style={{ fontSize: '48px', color: themeColors.danger, marginBottom: '16px' }} />
                    <Title level={3} style={{ color: themeColors.dark }}>Error Loading Profile</Title>
                    <Text style={{ color: themeColors.lightText }}>Please try refreshing the page</Text>
                    <div className="mt-4">
                        <Button
                            type="primary"
                            onClick={() => window.location.reload()}
                            style={{
                                backgroundColor: themeColors.primary,
                                borderColor: themeColors.primary
                            }}
                        >
                            Refresh Page
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const { name, email, phone, role } = user.data as TUser;



    // Process bookings data
    const safeBookingHistory: ProcessedBooking[] = Array.isArray(bookings?.data) ?
        bookings.data.map((booking: Bookings): ProcessedBooking => ({
            id: booking._id || '',
            carName: booking?.car?.name || 'Unknown Car',
            carImage: booking?.car?.image,
            date: booking?.date || '',
            startTime: booking?.startTime || '',
            endTime: booking?.endTime || '',
            totalCost: parseFloat(String(booking?.totalCost || 0)),
            transactionId: booking?.transactionId || 'N/A',
            paymentStatus: booking?.paymentStatus || 'pending',
            duration: calculateDuration(booking?.startTime || '', booking?.endTime || '')
        })) : [];

    // Calculate statistics
    const totalCost = safeBookingHistory.reduce((acc: number, booking: ProcessedBooking) =>
        acc + booking.totalCost, 0);
    const paidBookings = safeBookingHistory.filter((booking: ProcessedBooking) =>
        booking.paymentStatus === 'paid');
    const pendingBookings = safeBookingHistory.filter((booking: ProcessedBooking) =>
        booking.paymentStatus !== 'paid');

    const handleUpdateProfile = async (values: any) => {
        try {
            const formData = new FormData();
            if (values.name) formData.append('name', values.name);
            if (values.email) formData.append('email', values.email);
            if (values.phone) formData.append('phone', values.phone);
            if (selectedImage) formData.append('image', selectedImage);

            const result = await updateProfile(formData as any).unwrap();
            // console.log("result", result);
            if (result.success) {
                toast.success("Profile updated successfully");
                setSelectedImage(null);
                // let getUser query update
                refetch();
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error: any) {
            // console.error("Update profile error:", error);
            toast.error(error?.data?.message || "Failed to update profile. Please try again.");
        }
    };

    const navigationItems = [
        { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', active: activeTab === 'dashboard' },
        { key: 'profile', icon: <UserOutlined />, label: 'Profile', active: activeTab === 'profile' },
        { key: 'bookings', icon: <HistoryOutlined />, label: 'Bookings', badge: safeBookingHistory.length, active: activeTab === 'bookings' },
        { key: 'payment', icon: <CreditCardOutlined />, label: 'Payment', active: activeTab === 'payment' },
        { key: 'security', icon: <SafetyOutlined />, label: 'Security', active: activeTab === 'security' },
    ];

    const columns: ColumnsType<ProcessedBooking> = [
        {
            title: "Car Details",
            key: "carDetails",
            render: (record: ProcessedBooking) => (
                <div className="flex items-center space-x-3">
                    {record.carImage ? (
                        <img
                            src={record.carImage}
                            alt={record.carName}
                            className="w-12 h-12 object-cover rounded-lg"
                            style={{
                                border: `2px solid ${themeColors.border}`,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        />
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center rounded-lg" style={{
                            backgroundColor: themeColors.light,
                            border: `2px solid ${themeColors.border}`
                        }}>
                            <CarOutlined style={{ color: themeColors.primary }} />
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-sm" style={{ color: themeColors.text }}>
                            {record.carName}
                        </div>
                        <div className="text-xs" style={{ color: themeColors.lightText }}>
                            {record.duration}
                        </div>
                    </div>
                </div>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        {
            title: "Date & Time",
            key: "datetime",
            render: (record: ProcessedBooking) => (
                <div>
                    <div className="flex items-center space-x-2">
                        <CalendarOutlined style={{ color: themeColors.secondary, fontSize: '12px' }} />
                        <span style={{ color: themeColors.text, fontSize: '13px' }}>{formatDate(record.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                        <ClockCircleOutlined style={{ color: themeColors.secondary, fontSize: '12px' }} />
                        <span style={{ color: themeColors.lightText, fontSize: '12px' }}>
                            {formatTime(record.startTime)} - {formatTime(record.endTime)}
                        </span>
                    </div>
                </div>
            ),
            responsive: ['sm'],
        },
        {
            title: "Amount",
            dataIndex: "totalCost",
            key: "totalCost",
            render: (totalCost: number) => (
                <div className="font-semibold" style={{ color: themeColors.dark }}>
                    {formatCurrency(totalCost)}
                </div>
            ),
            responsive: ['xs'],
        },
        {
            title: "Status",
            dataIndex: "paymentStatus",
            key: "paymentStatus",
            render: (status: string) => {
                const statusColors = {
                    paid: { color: themeColors.success, text: 'PAID' },
                    pending: { color: themeColors.warning, text: 'PENDING' },
                    failed: { color: themeColors.danger, text: 'FAILED' },
                    refunded: { color: themeColors.primary, text: 'REFUNDED' }
                };
                const currentStatus = statusColors[status as keyof typeof statusColors] || statusColors.pending;

                return (
                    <Badge
                        color={currentStatus.color}
                        text={currentStatus.text}
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '20px'
                        }}
                    />
                );
            },
            responsive: ['xs'],
        },
        {
            title: "Action",
            key: "action",
            render: (record: ProcessedBooking) => (
                <Button
                    type="link"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => {
                        message.info(`Viewing booking ${record.transactionId}`);
                    }}
                    style={{
                        color: themeColors.primary,
                        fontWeight: 500
                    }}
                >
                    View
                </Button>
            ),
            responsive: ['md'],
        },
    ];

    return (
        <div className="p-6" style={{ backgroundColor: themeColors.background }}>
            <div>
                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-800 rounded-xl p-6 mb-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {name}!</h2>
                                <p className="text-blue-100 mb-3">Booking & payment dashboard</p>
                                <div className="flex gap-3">
                                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                                        {safeBookingHistory.length} Bookings
                                    </span>
                                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                                        {paidBookings.length} Completed
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.href = '/cars'}
                                className="bg-white text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-100"
                            >
                                Book Car
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="lg:w-1/4 space-y-6 lg:sticky lg:top-8 lg:self-start"
                    >
                        <Card
                            className="rounded-xl shadow-sm border-0 overflow-hidden"
                            style={{ backgroundColor: themeColors.card }}
                        >
                            <div className="flex flex-col items-center py-6 px-4">
                                <Avatar
                                    size={80}
                                    src={previewUrl || (user?.data as TUser)?.image}
                                    icon={<UserOutlined />}
                                    style={{
                                        backgroundColor: themeColors.primary,
                                        fontSize: '32px',
                                        marginBottom: '16px',
                                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                    }}
                                />
                                <Title level={4} style={{ color: themeColors.dark, marginBottom: '4px' }}>
                                    {name}
                                </Title>
                                <Text style={{
                                    color: themeColors.lightText,
                                    textAlign: 'center',
                                    fontSize: '14px'
                                }}>
                                    {email}
                                </Text>
                                <div className="mt-4">
                                    <Badge
                                        count={role?.toUpperCase()}
                                        style={{
                                            backgroundColor: role === 'admin' ? themeColors.secondary : themeColors.success,
                                            color: 'white',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            padding: '4px 12px',
                                            borderRadius: '20px'
                                        }}
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Navigation */}
                        <Card
                            className="rounded-xl shadow-sm border-0"
                            style={{ backgroundColor: themeColors.card }}
                        >
                            <nav className="space-y-1">
                                {navigationItems.map((item) => (
                                    <motion.div
                                        key={item.key}
                                        whileHover={{ x: 4 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Button
                                            type="text"
                                            block
                                            className={`flex items-center justify-between h-12 px-4 rounded-lg transition-all ${item.active ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                }`}
                                            style={{
                                                color: item.active ? themeColors.primary : themeColors.text,
                                                textAlign: 'left',
                                                fontWeight: item.active ? 600 : 400,
                                                border: item.active ? `1px solid ${themeColors.primary}30` : '1px solid transparent'
                                            }}
                                            onClick={() => setActiveTab(item.key)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-base" style={{
                                                    color: item.active ? themeColors.primary : themeColors.lightText
                                                }}>
                                                    {item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                            </div>
                                            {item.badge && (
                                                <Badge
                                                    count={item.badge}
                                                    style={{
                                                        backgroundColor: themeColors.primary,
                                                        fontSize: '10px',
                                                        fontWeight: 600,
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            )}
                                        </Button>
                                    </motion.div>
                                ))}
                            </nav>
                            <Divider style={{ margin: '16px 0' }} />
                            <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Button
                                    type="text"
                                    block
                                    className="flex items-center space-x-3 h-12 px-4 rounded-lg transition-all hover:bg-gray-50"
                                    style={{
                                        color: themeColors.danger,
                                        textAlign: 'left',
                                        fontWeight: 400
                                    }}
                                    onClick={() => message.info('Logging out...')}
                                >
                                    <LogoutOutlined style={{ color: themeColors.danger, fontSize: '16px' }} />
                                    <span>Logout</span>
                                </Button>
                            </motion.div>
                        </Card>

                        {/* Quick Stats */}
                        <Card
                            className="rounded-xl shadow-sm border-0"
                            style={{ backgroundColor: themeColors.card }}
                        >
                            <Title level={5} style={{
                                color: themeColors.dark,
                                marginBottom: '16px',
                                fontSize: '16px'
                            }}>
                                Your Stats
                            </Title>
                            <div className="space-y-4">
                                {[
                                    { label: 'Total Bookings', value: safeBookingHistory.length, color: themeColors.primary },
                                    { label: 'Completed', value: paidBookings.length, color: themeColors.success },
                                    { label: 'Pending', value: pendingBookings.length, color: themeColors.warning },
                                    { label: 'Total Spent', value: formatCurrency(totalCost), color: themeColors.dark }
                                ].map((stat, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                                        <Text style={{ color: themeColors.lightText, fontSize: '14px' }}>
                                            {stat.label}
                                        </Text>
                                        <Text strong style={{
                                            color: stat.color,
                                            fontSize: '14px'
                                        }}>
                                            {stat.value}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="lg:w-3/4 space-y-8"
                    >
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            className="profile-tabs"
                            style={{ color: themeColors.text }}
                        >
                            {/* Dashboard Tab */}
                            <TabPane
                                tab={
                                    <span className="flex items-center space-x-2">
                                        <DashboardOutlined />
                                        <span>Dashboard</span>
                                    </span>
                                }
                                key="dashboard"
                            >
                                <DashboardStats bookings={safeBookingHistory} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <QuickActions />
                                    <PaymentSummary bookings={safeBookingHistory} />
                                </div>

                                {/* Recent Bookings */}
                                <Card
                                    className="rounded-xl shadow-sm border-0 mt-6"
                                    style={{ backgroundColor: themeColors.card }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <Title level={4} style={{ color: themeColors.dark, margin: 0 }}>
                                                Recent Bookings
                                            </Title>
                                            <Text style={{ color: themeColors.lightText }}>
                                                Your latest rental activities
                                            </Text>
                                        </div>
                                        <Button
                                            type="primary"
                                            icon={<EyeOutlined />}
                                            style={{
                                                backgroundColor: themeColors.primary,
                                                borderColor: themeColors.primary
                                            }}
                                            onClick={() => setActiveTab('bookings')}
                                        >
                                            View All
                                        </Button>
                                    </div>

                                    {safeBookingHistory.length > 0 ? (
                                        <Table
                                            dataSource={safeBookingHistory.slice(0, 5)}
                                            columns={columns}
                                            rowKey="id"
                                            pagination={false}
                                            className="rounded-lg"
                                            style={{
                                                border: `1px solid ${themeColors.border}`,
                                                borderRadius: '8px'
                                            }}
                                            scroll={{ x: 'max-content' }}
                                        />
                                    ) : (
                                        <div className="text-center py-12">
                                            <HistoryOutlined style={{
                                                fontSize: '48px',
                                                color: themeColors.lightText,
                                                marginBottom: '16px',
                                                opacity: 0.5
                                            }} />
                                            <Title level={5} style={{ color: themeColors.dark, marginBottom: '8px' }}>
                                                No Bookings Yet
                                            </Title>
                                            <Text style={{ color: themeColors.lightText }}>
                                                Start your first booking journey!
                                            </Text>
                                        </div>
                                    )}
                                </Card>
                            </TabPane>

                            {/* Profile Tab */}
                            <TabPane
                                tab={
                                    <span className="flex items-center space-x-2">
                                        <UserOutlined />
                                        <span>Personal Information</span>
                                    </span>
                                }
                                key="profile"
                            >
                                <Card
                                    className="rounded-xl shadow-sm border-0"
                                    style={{ backgroundColor: themeColors.card }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <Title level={4} style={{ color: themeColors.dark, margin: 0 }}>
                                                Edit Profile
                                            </Title>
                                            <Text style={{ color: themeColors.lightText }}>
                                                Update your personal information
                                            </Text>
                                        </div>
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                            style={{
                                                backgroundColor: themeColors.primary,
                                                borderColor: themeColors.primary
                                            }}
                                            onClick={() => {
                                                form.submit();
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </div>

                                    <Form form={form} layout="vertical" onFinish={handleUpdateProfile} initialValues={{ name, email, phone }}>
                                        <Row gutter={24}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Full Name"
                                                    name="name"
                                                    initialValue={name}
                                                    rules={[
                                                        { required: true, message: 'Please enter your name' },
                                                        { min: 2, message: 'Name must be at least 2 characters' }
                                                    ]}
                                                >
                                                    <Input
                                                        size="large"
                                                        prefix={<UserOutlined style={{ color: themeColors.lightText }} />}
                                                        placeholder="Enter your full name"
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Email Address"
                                                    name="email"
                                                    initialValue={email}
                                                    rules={[
                                                        { required: true, message: 'Please enter your email' },
                                                        { type: 'email', message: 'Please enter a valid email' }
                                                    ]}
                                                >
                                                    <Input
                                                        size="large"
                                                        prefix={<MailOutlined style={{ color: themeColors.lightText }} />}
                                                        placeholder="Enter your email"
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={24}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Phone Number"
                                                    name="phone"
                                                    initialValue={phone}
                                                    rules={[
                                                        { pattern: /^[+]?[\d\s\-()]+$/, message: 'Please enter a valid phone number' }
                                                    ]}
                                                >
                                                    <Input
                                                        size="large"
                                                        prefix={<PhoneOutlined style={{ color: themeColors.lightText }} />}
                                                        placeholder="Enter your phone number"
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    label="Account Type"
                                                >
                                                    <Input
                                                        size="large"
                                                        value={role?.toUpperCase()}
                                                        disabled
                                                        prefix={<TrophyOutlined style={{ color: themeColors.lightText }} />}
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Row gutter={24} className="mt-4">
                                            <Col xs={24} md={12}>
                                                <Form.Item label="Profile Image">
                                                    <Upload
                                                        beforeUpload={(file) => {
                                                            setSelectedImage(file as File);
                                                            setPreviewUrl(URL.createObjectURL(file as File));
                                                            return false; // prevent auto upload
                                                        }}
                                                        showUploadList={false}
                                                        accept="image/*"
                                                    >
                                                        <Button icon={<UploadOutlined />}>Choose Image</Button>
                                                    </Upload>
                                                    {previewUrl && (
                                                        <div className="mt-3">
                                                            <img src={previewUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg" />
                                                        </div>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card>
                            </TabPane>

                            {/* Bookings Tab */}
                            <TabPane
                                tab={
                                    <span className="flex items-center space-x-2">
                                        <HistoryOutlined />
                                        <span>Booking History</span>
                                        {safeBookingHistory.length > 0 && (
                                            <Badge
                                                count={safeBookingHistory.length}
                                                style={{
                                                    backgroundColor: themeColors.primary,
                                                    fontSize: '10px',
                                                    fontWeight: 600
                                                }}
                                            />
                                        )}
                                    </span>
                                }
                                key="bookings"
                            >
                                <Card
                                    className="rounded-xl shadow-sm border-0"
                                    style={{ backgroundColor: themeColors.card }}
                                >
                                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                                        <div>
                                            <Title level={4} style={{ color: themeColors.dark, margin: 0 }}>
                                                Booking History
                                            </Title>
                                            <Text style={{ color: themeColors.lightText }}>
                                                All your rental activities
                                            </Text>
                                        </div>
                                        <Button
                                            type="primary"
                                            icon={<CarOutlined />}
                                            style={{
                                                backgroundColor: themeColors.primary,
                                                borderColor: themeColors.primary
                                            }}
                                            onClick={() => window.location.href = '/cars'}
                                        >
                                            Book New Car
                                        </Button>
                                    </div>

                                    {isLoadingBookings ? (
                                        <div className="flex justify-center items-center py-12">
                                            <Spin size="large" style={{ color: themeColors.primary }} />
                                        </div>
                                    ) : safeBookingHistory.length > 0 ? (
                                        <Table
                                            dataSource={safeBookingHistory}
                                            columns={columns}
                                            rowKey="id"
                                            pagination={{
                                                pageSize: 10,
                                                showSizeChanger: true,
                                                showTotal: (total, range) =>
                                                    `${range[0]}-${range[1]} of ${total} bookings`
                                            }}
                                            className="rounded-lg"
                                            style={{ border: `1px solid ${themeColors.border}` }}
                                            scroll={{ x: 'max-content' }}
                                        />
                                    ) : (
                                        <div className="text-center py-12">
                                            <HistoryOutlined style={{ fontSize: '64px', color: themeColors.lightText, marginBottom: '16px', opacity: 0.5 }} />
                                            <Title level={5} style={{ color: themeColors.dark, marginBottom: '8px' }}>
                                                No Bookings Yet
                                            </Title>
                                            <Text style={{ color: themeColors.lightText }} className="block mb-6">
                                                You haven't made any bookings yet. Start your journey with us!
                                            </Text>
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<CarOutlined />}
                                                style={{
                                                    backgroundColor: themeColors.primary,
                                                    borderColor: themeColors.primary,
                                                    padding: '0 32px',
                                                    height: '48px'
                                                }}
                                                onClick={() => window.location.href = '/cars'}
                                            >
                                                Browse Available Cars
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            </TabPane>

                            {/* Payment Tab */}
                            <TabPane
                                tab={
                                    <span className="flex items-center space-x-2">
                                        <CreditCardOutlined />
                                        <span>Payment History</span>
                                    </span>
                                }
                                key="payment"
                            >
                                <Card
                                    className="rounded-xl shadow-sm border-0"
                                    style={{ backgroundColor: themeColors.card }}
                                >
                                    <Title level={4} style={{ color: themeColors.dark, marginBottom: '24px' }}>
                                        Payment History
                                    </Title>
                                    <PaymentSummary bookings={safeBookingHistory} />
                                </Card>
                            </TabPane>

                            {/* Security Tab */}
                            <TabPane
                                tab={
                                    <span className="flex items-center space-x-2">
                                        <SafetyOutlined />
                                        <span>Security</span>
                                    </span>
                                }
                                key="security"
                            >
                                <Card
                                    className="rounded-xl shadow-sm border-0"
                                    style={{ backgroundColor: themeColors.card }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <Title level={4} style={{ color: themeColors.dark, margin: 0 }}>
                                                Security Settings
                                            </Title>
                                            <Text style={{ color: themeColors.lightText }}>
                                                Manage your password and security preferences
                                            </Text>
                                        </div>
                                    </div>
                                    <div className="text-center py-12">
                                        <SafetyOutlined style={{ fontSize: '48px', color: themeColors.lightText, marginBottom: '16px', opacity: 0.5 }} />
                                        <Title level={5} style={{ color: themeColors.dark, marginBottom: '8px' }}>
                                            Security Features Coming Soon
                                        </Title>
                                        <Text style={{ color: themeColors.lightText }}>
                                            We're working on adding password management and two-factor authentication.
                                        </Text>
                                    </div>
                                </Card>
                            </TabPane>
                        </Tabs>
                    </motion.div>
                </div>
            </div>

            {/* Enhanced Custom CSS */}
            <style>{`
                .profile-tabs .ant-tabs-nav {
                    margin: 0 0 32px 0;
                    background: ${themeColors.card};
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                
                .profile-tabs .ant-tabs-tab {
                    padding: 12px 24px;
                    font-weight: 500;
                    color: ${themeColors.lightText};
                    transition: all 0.3s ease;
                    border-radius: 8px;
                }
                
                .profile-tabs .ant-tabs-tab:hover {
                    color: ${themeColors.primary};
                    background: ${themeColors.light};
                }
                
                .profile-tabs .ant-tabs-tab-active {
                    color: ${themeColors.primary} !important;
                    background: ${themeColors.light};
                }
                
                .profile-tabs .ant-tabs-ink-bar {
                    background: ${themeColors.primary};
                    height: 3px;
                    border-radius: 3px;
                }
                
                .ant-table-thead > tr > th {
                    background-color: ${themeColors.light} !important;
                    color: ${themeColors.text} !important;
                    font-weight: 600;
                    border-bottom: 2px solid ${themeColors.border} !important;
                    padding: 16px !important;
                }
                
                .ant-table-tbody > tr > td {
                    border-bottom: 1px solid ${themeColors.border} !important;
                    padding: 16px !important;
                    transition: all 0.3s ease;
                }
                
                .ant-table-tbody > tr:hover > td {
                    background-color: ${themeColors.light} !important;
                    transform: translateY(-1px);
                }
                
                .ant-form-item-label > label {
                    color: ${themeColors.text} !important;
                    font-weight: 500;
                    font-size: 14px;
                }
                
                .ant-input-affix-wrapper {
                    border-radius: 8px;
                    border: 1px solid ${themeColors.border};
                    transition: all 0.3s;
                    height: 48px;
                }
                
                .ant-input-affix-wrapper:hover,
                .ant-input-affix-wrapper:focus,
                .ant-input-affix-wrapper-focused {
                    border-color: ${themeColors.primary} !important;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
                }
                
                .ant-statistic-title {
                    color: ${themeColors.lightText} !important;
                    font-size: 14px !important;
                }
                
                .ant-statistic-content {
                    font-size: 28px !important;
                }
                
                .ant-card {
                    transition: box-shadow 0.3s ease, transform 0.3s ease;
                    border-radius: 12px;
                }
                
                .ant-card:hover {
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
                    transform: translateY(-2px);
                }
                
                .ant-btn-primary {
                    background: ${themeColors.primary};
                    border-color: ${themeColors.primary};
                    height: 40px;
                    padding: 0 20px;
                    font-weight: 500;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                
                .ant-btn-primary:hover {
                    background: ${themeColors.primaryDark};
                    border-color: ${themeColors.primaryDark};
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }
                
                .ant-badge-count {
                    box-shadow: 0 0 0 1px ${themeColors.card};
                }
                
                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                
                ::-webkit-scrollbar-track {
                    background: ${themeColors.light};
                    border-radius: 3px;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: ${themeColors.lightText};
                    border-radius: 3px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: ${themeColors.text};
                }
                
                @media (max-width: 768px) {
                    .profile-tabs .ant-tabs-nav {
                        padding: 8px 16px;
                    }
                    
                    .profile-tabs .ant-tabs-tab {
                        padding: 8px 16px;
                        font-size: 14px;
                    }
                    
                    .ant-table-thead > tr > th,
                    .ant-table-tbody > tr > td {
                        padding: 12px 8px !important;
                        font-size: 13px;
                    }
                    
                    .ant-card {
                        margin: 8px 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default Profile; 