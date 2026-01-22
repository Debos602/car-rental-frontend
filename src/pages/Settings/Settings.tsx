import {
    Card,
    Tabs,
    Form,
    Input,
    Switch,
    Button,
    Select,
    Upload,
    Avatar,
    Divider,
    Row,
    Col,
    Space,
    Badge,
    notification,
    Descriptions,
    List,
    Tag,
    Modal,
    Alert,
    Tooltip
} from "antd";
import {
    SaveOutlined,
    BellOutlined,
    LockOutlined,
    UserOutlined,
    GlobalOutlined,
    DatabaseOutlined,
    ApiOutlined,
    CloudOutlined,
    SettingOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    MailOutlined,
    PhoneOutlined,
    CameraOutlined,
    KeyOutlined,
    CrownFilled
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useForm } from "antd/es/form/Form";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [tabPosition, setTabPosition] = useState<'left' | 'top'>('left');
    const [profileForm] = useForm();
    const [securityForm] = useForm();
    const [notificationForm] = useForm();
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Admin');

    // Mock settings data
    const userProfile = {
        name: 'Admin User',
        email: 'admin@carrental.com',
        phone: '+1 (555) 123-4567',
        role: 'Administrator',
        joinedDate: '2023-01-15',
        lastLogin: '2024-01-15 14:30',
        avatar: avatarUrl,
    };

    const systemSettings = {
        businessName: 'Car Rental Pro',
        currency: 'USD',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        language: 'English',
    };

    const notificationSettings = {
        emailNotifications: true,
        smsNotifications: false,
        bookingAlerts: true,
        paymentAlerts: true,
        maintenanceAlerts: false,
        marketingEmails: true,
    };

    const securityLogs = [
        { id: 1, action: 'Login', device: 'Chrome on Windows', location: 'New York, US', time: '2 hours ago', status: 'success' },
        { id: 2, action: 'Password Change', device: 'Safari on iOS', location: 'Boston, US', time: '1 day ago', status: 'success' },
        { id: 3, action: 'Failed Login', device: 'Firefox on Linux', location: 'Unknown', time: '3 days ago', status: 'failed' },
        { id: 4, action: 'Profile Update', device: 'Chrome on macOS', location: 'San Francisco, US', time: '1 week ago', status: 'success' },
    ];

    const integrations = [
        { name: 'Stripe Payment', status: 'active', description: 'Payment processing' },
        { name: 'Twilio SMS', status: 'active', description: 'SMS notifications' },
        { name: 'Google Maps', status: 'active', description: 'Location services' },
        { name: 'Mailchimp', status: 'inactive', description: 'Email marketing' },
        { name: 'Slack', status: 'active', description: 'Team notifications' },
    ];

    const handleSaveProfile = async (values: any) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            notification.success({
                message: 'Profile Updated',
                description: 'Your profile settings have been saved successfully.',
                placement: 'topRight',
            });
        } catch (error) {
            notification.error({
                message: 'Update Failed',
                description: 'Failed to update profile settings.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSecuritySave = async (values: any) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            notification.success({
                message: 'Security Settings Updated',
                description: 'Your security preferences have been saved.',
                placement: 'topRight',
            });
            securityForm.resetFields();
        } catch (error) {
            notification.error({
                message: 'Update Failed',
                description: 'Failed to update security settings.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationSave = (values: any) => {
        notification.success({
            message: 'Notification Settings Updated',
            description: 'Your notification preferences have been saved.',
        });
    };

    const handleAvatarUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        return false;
    };

    const toggleTwoFactorAuth = () => {
        setTwoFactorAuth(!twoFactorAuth);
        notification.info({
            message: twoFactorAuth ? '2FA Disabled' : '2FA Enabled',
            description: twoFactorAuth
                ? 'Two-factor authentication has been disabled.'
                : 'Two-factor authentication has been enabled.',
        });
    };

    const activityStatus = {
        success: <Tag color="success" icon={<CheckCircleOutlined />}>Success</Tag>,
        failed: <Tag color="error">Failed</Tag>,
    };

    useEffect(() => {
        const handleResize = () => {
            setTabPosition(window.innerWidth < 768 ? 'top' : 'left');
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}

        >
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Settings & Preferences
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage your account, security, and system preferences
                        </p>
                    </div>
                    <Space>
                        <Button
                            icon={<SaveOutlined />}
                            type="primary"
                            className="bg-[#4335A7] hover:bg-[#372887] border-0"
                            loading={loading}
                            onClick={() => {
                                if (activeTab === 'profile') profileForm.submit();
                                if (activeTab === 'security') securityForm.submit();
                                if (activeTab === 'notifications') notificationForm.submit();
                            }}
                        >
                            Save Changes
                        </Button>
                    </Space>
                </div>

                {/* Quick Stats */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12} md={6}>
                        <Card className="h-full shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100">
                                    <CrownFilled className="text-blue-600 text-lg" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Security Score</div>
                                    <div className="text-xl font-bold text-gray-900">85/100</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="h-full shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-100">
                                    <CheckCircleOutlined className="text-green-600 text-lg" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Active Sessions</div>
                                    <div className="text-xl font-bold text-gray-900">3</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="h-full shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-100">
                                    <BellOutlined className="text-purple-600 text-lg" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Unread Alerts</div>
                                    <div className="text-xl font-bold text-gray-900">2</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="h-full shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-100">
                                    <DatabaseOutlined className="text-orange-600 text-lg" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Storage Used</div>
                                    <div className="text-xl font-bold text-gray-900">1.2/5 GB</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Main Settings Area */}
            <Card className="shadow-lg rounded-xl">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    tabPosition={tabPosition}
                    className="settings-tabs"
                >
                    {/* Profile Settings Tab */}
                    <TabPane
                        tab={
                            <span className="flex items-center gap-2">
                                <UserOutlined />
                                Profile
                            </span>
                        }
                        key="profile"
                    >
                        <div className="max-w-4xl">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Information</h2>
                                <p className="text-gray-600">Update your personal and contact information</p>
                            </div>

                            <Row gutter={[32, 32]}>
                                <Col xs={24} md={8}>
                                    <Card className="text-center">
                                        <div className="relative inline-block mb-4">
                                            <Avatar
                                                size={120}
                                                src={avatarUrl}
                                                icon={<UserOutlined />}
                                                className="border-4 border-white shadow-lg"
                                            />
                                            <Upload
                                                beforeUpload={handleAvatarUpload}
                                                showUploadList={false}
                                                accept="image/*"
                                            >
                                                <Button
                                                    shape="circle"
                                                    icon={<CameraOutlined />}
                                                    className="absolute bottom-0 right-0 bg-[#4335A7] text-white border-2 border-white"
                                                    size="small"
                                                />
                                            </Upload>
                                        </div>
                                        <h3 className="font-semibold text-lg">{userProfile.name}</h3>
                                        <p className="text-gray-500">{userProfile.role}</p>
                                        <Divider className="my-4" />
                                        <Descriptions column={1} size="small">
                                            <Descriptions.Item label="Email">{userProfile.email}</Descriptions.Item>
                                            <Descriptions.Item label="Phone">{userProfile.phone}</Descriptions.Item>
                                            <Descriptions.Item label="Joined">{userProfile.joinedDate}</Descriptions.Item>
                                            <Descriptions.Item label="Last Login">{userProfile.lastLogin}</Descriptions.Item>
                                        </Descriptions>
                                    </Card>
                                </Col>

                                <Col xs={24} md={16}>
                                    <Form
                                        form={profileForm}
                                        layout="vertical"
                                        onFinish={handleSaveProfile}
                                        initialValues={userProfile}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Form.Item
                                                label="Full Name"
                                                name="name"
                                                rules={[{ required: true, message: 'Please enter your name' }]}
                                            >
                                                <Input
                                                    prefix={<UserOutlined className="text-gray-400" />}
                                                    placeholder="Enter your full name"
                                                    size="large"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Email Address"
                                                name="email"
                                                rules={[
                                                    { required: true, message: 'Please enter your email' },
                                                    { type: 'email', message: 'Please enter a valid email' }
                                                ]}
                                            >
                                                <Input
                                                    prefix={<MailOutlined className="text-gray-400" />}
                                                    placeholder="Enter your email"
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Form.Item
                                                label="Phone Number"
                                                name="phone"
                                            >
                                                <Input
                                                    prefix={<PhoneOutlined className="text-gray-400" />}
                                                    placeholder="Enter your phone number"
                                                    size="large"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Language"
                                                name="language"
                                            >
                                                <Select size="large">
                                                    <Option value="en">English</Option>
                                                    <Option value="es">Spanish</Option>
                                                    <Option value="fr">French</Option>
                                                    <Option value="de">German</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>

                                        <Form.Item
                                            label="Bio"
                                            name="bio"
                                        >
                                            <TextArea
                                                rows={4}
                                                placeholder="Tell us about yourself..."
                                                maxLength={200}
                                                showCount
                                            />
                                        </Form.Item>

                                        <Alert
                                            message="Profile Information"
                                            description="Your profile information is visible to other administrators in the system."
                                            type="info"
                                            showIcon
                                            className="mb-6"
                                        />
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>

                    {/* Security Settings Tab */}
                    <TabPane
                        tab={
                            <span className="flex items-center gap-2">
                                <LockOutlined />
                                Security
                            </span>
                        }
                        key="security"
                    >
                        <div className="max-w-3xl">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Security Settings</h2>
                                <p className="text-gray-600">Manage your account security and access control</p>
                            </div>

                            <Form
                                form={securityForm}
                                layout="vertical"
                                onFinish={handleSecuritySave}
                            >
                                <Card className="mb-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg">Two-Factor Authentication</h3>
                                            <p className="text-gray-600 text-sm">Add an extra layer of security to your account</p>
                                        </div>
                                        <Switch
                                            checked={twoFactorAuth}
                                            onChange={toggleTwoFactorAuth}
                                            checkedChildren="ON"
                                            unCheckedChildren="OFF"
                                        />
                                    </div>
                                    {twoFactorAuth && (
                                        <Alert
                                            message="2FA is Enabled"
                                            description="You will be required to enter a verification code from your authenticator app when logging in."
                                            type="success"
                                            showIcon
                                        />
                                    )}
                                </Card>

                                <Card className="mb-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <Form.Item
                                            label="Current Password"
                                            name="currentPassword"
                                            rules={[{ required: true, message: 'Please enter current password' }]}
                                        >
                                            <Input.Password
                                                placeholder="Enter current password"
                                                size="large"
                                                prefix={<KeyOutlined className="text-gray-400" />}
                                                iconRender={(visible) =>
                                                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                                                }
                                            />
                                        </Form.Item>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Form.Item
                                                label="New Password"
                                                name="newPassword"
                                                rules={[
                                                    { required: true, message: 'Please enter new password' },
                                                    { min: 8, message: 'Password must be at least 8 characters' }
                                                ]}
                                            >
                                                <Input.Password
                                                    placeholder="Enter new password"
                                                    size="large"
                                                    prefix={<LockOutlined className="text-gray-400" />}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Confirm Password"
                                                name="confirmPassword"
                                                dependencies={['newPassword']}
                                                rules={[
                                                    { required: true, message: 'Please confirm password' },
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            if (!value || getFieldValue('newPassword') === value) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(new Error('Passwords do not match'));
                                                        },
                                                    }),
                                                ]}
                                            >
                                                <Input.Password
                                                    placeholder="Confirm new password"
                                                    size="large"
                                                    prefix={<LockOutlined className="text-gray-400" />}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4">Active Sessions</h3>
                                    <List
                                        dataSource={securityLogs}
                                        renderItem={(item) => (
                                            <List.Item
                                                actions={[
                                                    <Button type="link" danger size="small">
                                                        Revoke
                                                    </Button>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={<GlobalOutlined />} />}
                                                    title={
                                                        <div className="flex items-center gap-2">
                                                            <span>{item.action}</span>
                                                            {activityStatus[item.status as keyof typeof activityStatus]}
                                                        </div>
                                                    }
                                                    description={
                                                        <div className="text-sm text-gray-500">
                                                            {item.device} • {item.location} • {item.time}
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Form>
                        </div>
                    </TabPane>

                    {/* Notifications Tab */}
                    <TabPane
                        tab={
                            <span className="flex items-center gap-2">
                                <BellOutlined />
                                Notifications
                            </span>
                        }
                        key="notifications"
                    >
                        <div className="max-w-3xl">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Notification Preferences</h2>
                                <p className="text-gray-600">Choose how you want to be notified about important events</p>
                            </div>

                            <Form
                                form={notificationForm}
                                layout="vertical"
                                onFinish={handleNotificationSave}
                                initialValues={notificationSettings}
                            >
                                <Card className="shadow-sm">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-4">Email Notifications</h3>
                                            <Form.Item name="emailNotifications" valuePropName="checked">
                                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                                    <div>
                                                        <div className="font-medium">Email Notifications</div>
                                                        <div className="text-sm text-gray-500">Receive notifications via email</div>
                                                    </div>
                                                    <Switch />
                                                </div>
                                            </Form.Item>

                                            <Form.Item name="marketingEmails" valuePropName="checked">
                                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                                    <div>
                                                        <div className="font-medium">Marketing Emails</div>
                                                        <div className="text-sm text-gray-500">Receive promotional emails and updates</div>
                                                    </div>
                                                    <Switch />
                                                </div>
                                            </Form.Item>
                                        </div>

                                        <Divider />

                                        <div>
                                            <h3 className="font-semibold text-lg mb-4">System Alerts</h3>
                                            <Form.Item name="bookingAlerts" valuePropName="checked">
                                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                                    <div>
                                                        <div className="font-medium">Booking Alerts</div>
                                                        <div className="text-sm text-gray-500">Get notified about new bookings</div>
                                                    </div>
                                                    <Switch />
                                                </div>
                                            </Form.Item>

                                            <Form.Item name="paymentAlerts" valuePropName="checked">
                                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                                    <div>
                                                        <div className="font-medium">Payment Alerts</div>
                                                        <div className="text-sm text-gray-500">Receive payment confirmation alerts</div>
                                                    </div>
                                                    <Switch />
                                                </div>
                                            </Form.Item>

                                            <Form.Item name="maintenanceAlerts" valuePropName="checked">
                                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                                    <div>
                                                        <div className="font-medium">Maintenance Alerts</div>
                                                        <div className="text-sm text-gray-500">Get notified about vehicle maintenance</div>
                                                    </div>
                                                    <Switch />
                                                </div>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Card>
                            </Form>
                        </div>
                    </TabPane>

                    {/* System Settings Tab */}
                    <TabPane
                        tab={
                            <span className="flex items-center gap-2">
                                <SettingOutlined />
                                System
                            </span>
                        }
                        key="system"
                    >
                        <div className="max-w-3xl">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">System Settings</h2>
                                <p className="text-gray-600">Configure system-wide preferences and integrations</p>
                            </div>

                            <Card className="mb-6 shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">General Settings</h3>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 mb-2">Business Name</div>
                                                <Input value={systemSettings.businessName} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 mb-2">Default Currency</div>
                                                <Select value={systemSettings.currency} className="w-full">
                                                    <Option value="USD">USD ($)</Option>
                                                    <Option value="EUR">EUR (€)</Option>
                                                    <Option value="GBP">GBP (£)</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 mb-2">Timezone</div>
                                                <Select value={systemSettings.timezone} className="w-full">
                                                    <Option value="America/New_York">EST (New York)</Option>
                                                    <Option value="America/Chicago">CST (Chicago)</Option>
                                                    <Option value="America/Los_Angeles">PST (Los Angeles)</Option>
                                                </Select>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-700 mb-2">Date Format</div>
                                                <Select value={systemSettings.dateFormat} className="w-full">
                                                    <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                                                    <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                                                    <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            <Card className="mb-6 shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">Integrations</h3>
                                <List
                                    dataSource={integrations}
                                    renderItem={(item) => (
                                        <List.Item
                                            actions={[
                                                <Tag color={item.status === 'active' ? 'success' : 'default'}>
                                                    {item.status}
                                                </Tag>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar icon={<ApiOutlined />} />}
                                                title={item.name}
                                                description={item.description}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>

                            <Card className="shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">System Information</h3>
                                <Descriptions bordered column={1}>
                                    <Descriptions.Item label="Version">v2.1.0</Descriptions.Item>
                                    <Descriptions.Item label="Last Updated">January 15, 2024</Descriptions.Item>
                                    <Descriptions.Item label="Database">PostgreSQL 14</Descriptions.Item>
                                    <Descriptions.Item label="Server Status">
                                        <Badge status="success" text="Online" />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Storage">
                                        <div className="flex items-center gap-2">
                                            <span>1.2 GB of 5 GB used</span>
                                            <Tooltip title="Storage Usage">
                                                <InfoCircleOutlined className="text-gray-400" />
                                            </Tooltip>
                                        </div>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </div>
                    </TabPane>
                </Tabs>
            </Card>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
            >
                <Card className="border-red-200 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-red-600 mb-1">Danger Zone</h3>
                            <p className="text-gray-600">Irreversible actions that affect your account</p>
                        </div>
                        <Space>
                            <Button danger icon={<DatabaseOutlined />}>
                                Clear Cache
                            </Button>
                            <Button
                                danger
                                type="primary"
                                icon={<CloudOutlined />}
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Are you sure?',
                                        content: 'This will delete all your personal data and cannot be undone.',
                                        okText: 'Delete Account',
                                        okType: 'danger',
                                        cancelText: 'Cancel',
                                        onOk: () => {
                                            notification.warning({
                                                message: 'Account Deletion',
                                                description: 'Account deletion request has been submitted.',
                                            });
                                        },
                                    });
                                }}
                            >
                                Delete Account
                            </Button>
                        </Space>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}