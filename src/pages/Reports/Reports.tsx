import {
    Card,
    Row,
    Col,
    Statistic,
    DatePicker,
    Select,
    Button,
    Table,
    Tabs,
    Tag,
    Progress,
    Space,
    Dropdown,
    Avatar,
    Divider,
    Empty
} from "antd";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import {
    DownloadOutlined,
    FilterOutlined,
    CalendarOutlined,
    CarOutlined,
    UserOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    MoreOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
    FileTextOutlined,
    EyeOutlined,
    ShareAltOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState } from "react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// Mock data for reports
const revenueData = [
    { month: 'Jan', revenue: 4200, bookings: 45 },
    { month: 'Feb', revenue: 5200, bookings: 52 },
    { month: 'Mar', revenue: 6100, bookings: 61 },
    { month: 'Apr', revenue: 5800, bookings: 58 },
    { month: 'May', revenue: 7200, bookings: 72 },
    { month: 'Jun', revenue: 8300, bookings: 83 },
    { month: 'Jul', revenue: 9500, bookings: 95 },
];

const vehiclePerformanceData = [
    { name: 'Tesla Model 3', value: 45, color: '#4335A7' },
    { name: 'Toyota Camry', value: 32, color: '#6A4BAA' },
    { name: 'BMW X5', value: 28, color: '#FF7F3E' },
    { name: 'Honda Civic', value: 25, color: '#36BFFA' },
    { name: 'Mercedes C-Class', value: 22, color: '#52C41A' },
];

const bookingStatusData = [
    { status: 'Completed', value: 65, color: '#52C41A' },
    { status: 'Active', value: 25, color: '#1890FF' },
    { status: 'Pending', value: 8, color: '#FAAD14' },
    { status: 'Cancelled', value: 2, color: '#FF4D4F' },
];

const topCustomers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', bookings: 12, totalSpent: 2400, avatarColor: '#4335A7' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', bookings: 9, totalSpent: 1800, avatarColor: '#FF7F3E' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', bookings: 8, totalSpent: 1600, avatarColor: '#36BFFA' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', bookings: 7, totalSpent: 1400, avatarColor: '#52C41A' },
    { id: 5, name: 'David Brown', email: 'david@example.com', bookings: 6, totalSpent: 1200, avatarColor: '#6A4BAA' },
];

const recentBookings = [
    { id: 'BK001', customer: 'Alex Turner', vehicle: 'Tesla Model 3', date: '2024-01-15', amount: 320, status: 'completed' },
    { id: 'BK002', customer: 'Maria Garcia', vehicle: 'Toyota Camry', date: '2024-01-14', amount: 280, status: 'active' },
    { id: 'BK003', customer: 'Robert Kim', vehicle: 'BMW X5', date: '2024-01-13', amount: 450, status: 'pending' },
    { id: 'BK004', customer: 'Lisa Wong', vehicle: 'Honda Civic', date: '2024-01-12', amount: 220, status: 'completed' },
    { id: 'BK005', customer: 'James Miller', vehicle: 'Mercedes C-Class', date: '2024-01-11', amount: 380, status: 'completed' },
];

export default function Reports() {
    const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
    const [reportType, setReportType] = useState('overview');
    const [loading, setLoading] = useState(false);

    // Calculate statistics
    const stats = {
        totalRevenue: 45200,
        totalBookings: 186,
        avgBookingValue: 243,
        activeVehicles: 24,
        revenueChange: 18.5,
        bookingsChange: 12.3,
    };

    const generateReport = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Handle report generation
        }, 1000);
    };

    const exportReport = (format: string) => {
        // Handle export logic
        console.log(`Exporting report as ${format}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'active': return 'processing';
            case 'pending': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const customerColumns = [
        {
            title: 'Customer',
            key: 'customer',
            render: (record: any) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={36}
                        style={{ backgroundColor: record.avatarColor }}
                    >
                        {record.name.charAt(0)}
                    </Avatar>
                    <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-xs text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Bookings',
            dataIndex: 'bookings',
            key: 'bookings',
            align: 'center' as const,
            render: (value: number) => (
                <div className="font-semibold text-[#4335A7]">{value}</div>
            ),
        },
        {
            title: 'Total Spent',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            align: 'right' as const,
            render: (value: number) => (
                <div className="font-bold">${value}</div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Button type="text" icon={<EyeOutlined />} size="small">
                    View
                </Button>
            ),
        },
    ];

    const bookingColumns = [
        {
            title: 'Booking ID',
            dataIndex: 'id',
            key: 'id',
            render: (id: string) => (
                <div className="font-mono text-xs">{id}</div>
            ),
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Vehicle',
            dataIndex: 'vehicle',
            key: 'vehicle',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `$${amount}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)} className="capitalize">
                    {status}
                </Tag>
            ),
        },
    ];

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
                            Reports & Analytics
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Comprehensive insights into your business performance
                        </p>
                    </div>
                    <Space>
                        <Dropdown
                            menu={{
                                items: [
                                    { key: 'pdf', label: 'Export as PDF', icon: <FileTextOutlined /> },
                                    { key: 'excel', label: 'Export as Excel', icon: <FileTextOutlined /> },
                                    { key: 'csv', label: 'Export as CSV', icon: <FileTextOutlined /> },
                                ],
                                onClick: ({ key }) => exportReport(key),
                            }}
                        >
                            <Button icon={<DownloadOutlined />} className="border-[#4335A7] text-[#4335A7] hover:bg-[#4335A7] hover:text-white">
                                Export
                            </Button>
                        </Dropdown>
                        <Button
                            type="primary"
                            icon={<ShareAltOutlined />}
                            className="bg-[#4335A7] hover:bg-[#372887] border-0"
                            onClick={generateReport}
                            loading={loading}
                        >
                            Generate Report
                        </Button>
                    </Space>
                </div>

                {/* Filters */}
                <Card className="mb-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700 mb-2">Date Range</div>
                            <RangePicker
                                value={dateRange as any}
                                onChange={(dates) => setDateRange(dates as any)}
                                className="w-full"
                                suffixIcon={<CalendarOutlined />}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700 mb-2">Report Type</div>
                            <Select
                                value={reportType}
                                onChange={setReportType}
                                className="w-full"
                                suffixIcon={<FilterOutlined />}
                            >
                                <Option value="overview">Overview</Option>
                                <Option value="revenue">Revenue Report</Option>
                                <Option value="bookings">Booking Report</Option>
                                <Option value="vehicles">Vehicle Performance</Option>
                                <Option value="customers">Customer Analysis</Option>
                            </Select>
                        </div>
                        <Button
                            icon={<FilterOutlined />}
                            className="bg-gray-100 hover:bg-gray-200"
                        >
                            More Filters
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Key Metrics */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Total Revenue"
                            value={stats.totalRevenue}
                            prefix={<DollarOutlined className="text-green-500" />}
                            valueStyle={{ color: '#4335A7' }}
                            suffix={
                                <Tag color="success" icon={<ArrowUpOutlined />} className="ml-2">
                                    {stats.revenueChange}%
                                </Tag>
                            }
                        />
                        <div className="text-sm text-gray-500 mt-2">
                            Last 30 days
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Total Bookings"
                            value={stats.totalBookings}
                            prefix={<CarOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#1890ff' }}
                            suffix={
                                <Tag color="processing" icon={<ArrowUpOutlined />} className="ml-2">
                                    {stats.bookingsChange}%
                                </Tag>
                            }
                        />
                        <div className="text-sm text-gray-500 mt-2">
                            {stats.avgBookingValue} avg/booking
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Active Vehicles"
                            value={stats.activeVehicles}
                            prefix={<CarOutlined className="text-orange-500" />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                        <div className="text-sm text-gray-500 mt-2">
                            18 available • 6 in service
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                        <Statistic
                            title="Avg. Utilization"
                            value={78}
                            prefix={<ClockCircleOutlined className="text-purple-500" />}
                            valueStyle={{ color: '#722ed1' }}
                            suffix="%"
                        />
                        <Progress percent={78} size="small" strokeColor="#722ed1" />
                    </Card>
                </Col>
            </Row>

            {/* Charts Section */}
            <Tabs defaultActiveKey="1" className="mb-6">
                <TabPane
                    tab={
                        <span className="flex items-center gap-2">
                            <LineChartOutlined />
                            Revenue Trends
                        </span>
                    }
                    key="1"
                >
                    <Card className="shadow-sm">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Monthly Revenue & Bookings</h3>
                            <p className="text-gray-500">Revenue growth over the last 6 months</p>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [`$${value}`, 'Revenue']}
                                        labelFormatter={(label) => `Month: ${label}`}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Revenue ($)"
                                        stroke="#4335A7"
                                        fill="#4335A7"
                                        fillOpacity={0.3}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="bookings"
                                        name="Bookings"
                                        stroke="#36BFFA"
                                        fill="#36BFFA"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </TabPane>
                <TabPane
                    tab={
                        <span className="flex items-center gap-2">
                            <BarChartOutlined />
                            Vehicle Performance
                        </span>
                    }
                    key="2"
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Card className="h-full shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Most Popular Vehicles</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={vehiclePerformanceData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [`${value} bookings`, 'Bookings']} />
                                            <Bar dataKey="value" name="Total Bookings">
                                                {vehiclePerformanceData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card className="h-full shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">Booking Status Distribution</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={bookingStatusData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {bookingStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane
                    tab={
                        <span className="flex items-center gap-2">
                            <PieChartOutlined />
                            Customer Insights
                        </span>
                    }
                    key="3"
                >
                    <Card className="shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">Top Customers by Spending</h3>
                        <Table
                            bordered
                            dataSource={topCustomers}
                            columns={customerColumns}
                            pagination={false}
                            rowKey="id"
                            className="compact-table"
                        />
                    </Card>
                </TabPane>
            </Tabs>

            {/* Recent Activity & Quick Stats */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <CarOutlined />
                                <span>Recent Bookings</span>
                            </div>
                        }
                        className="shadow-sm"
                        extra={
                            <Button type="link" size="small">
                                View All
                            </Button>
                        }
                    >
                        <Table
                            bordered
                            dataSource={recentBookings}
                            columns={bookingColumns}
                            pagination={false}
                            rowKey="id"
                            className="compact-table"
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <BarChartOutlined />
                                <span>Quick Stats</span>
                            </div>
                        }
                        className="shadow-sm"
                    >
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Peak Hours</div>
                                <div className="font-semibold">10 AM - 2 PM</div>
                                <Progress percent={85} size="small" strokeColor="#4335A7" />
                            </div>
                            <Divider className="my-3" />
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Most Active Day</div>
                                <div className="font-semibold">Saturday</div>
                                <Progress percent={92} size="small" strokeColor="#52C41A" />
                            </div>
                            <Divider className="my-3" />
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Customer Retention</div>
                                <div className="font-semibold">78%</div>
                                <Progress percent={78} size="small" strokeColor="#36BFFA" />
                            </div>
                            <Divider className="my-3" />
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Vehicle Utilization</div>
                                <div className="font-semibold">82%</div>
                                <Progress percent={82} size="small" strokeColor="#FF7F3E" />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Report Cards */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Pre-built Reports</h3>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            className="shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-blue-50">
                                    <DollarOutlined className="text-blue-600" />
                                </div>
                                <div className="font-semibold">Revenue Report</div>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">
                                Detailed revenue breakdown by vehicle, time, and customer
                            </p>
                            <Button type="link" size="small" icon={<EyeOutlined />}>
                                View Report
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            className="shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-green-50">
                                    <CarOutlined className="text-green-600" />
                                </div>
                                <div className="font-semibold">Vehicle Performance</div>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">
                                Vehicle utilization, maintenance, and revenue analysis
                            </p>
                            <Button type="link" size="small" icon={<EyeOutlined />}>
                                View Report
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            className="shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-orange-50">
                                    <UserOutlined className="text-orange-600" />
                                </div>
                                <div className="font-semibold">Customer Analysis</div>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">
                                Customer behavior, preferences, and spending patterns
                            </p>
                            <Button type="link" size="small" icon={<EyeOutlined />}>
                                View Report
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Card
                            hoverable
                            className="shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-lg bg-purple-50">
                                    <BarChartOutlined className="text-purple-600" />
                                </div>
                                <div className="font-semibold">Monthly Summary</div>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">
                                Comprehensive monthly performance overview
                            </p>
                            <Button type="link" size="small" icon={<EyeOutlined />}>
                                View Report
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </div>
        </motion.div>
    );
}