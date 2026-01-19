import { useState } from "react";
import { motion } from "framer-motion";
import TotalBookings from "./TotalBookings";
import AvailableCar from "./AvailableCar";
import TotalRevenue from "./TotalRevenue";
import { Typography, Card, Row, Col } from "antd";
import {
    CarOutlined,
    DollarOutlined,
    UserOutlined,
    BookOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,

} from "@ant-design/icons";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    AreaChart,
    Area,
    Tooltip as RechartsTooltip
} from "recharts";

const { Title, Text } = Typography;

const DashBoardOverview = () => {
    const [activeTab, setActiveTab] = useState("bookings");

    // Stats Data
    const statsData = [
        {
            title: "Total Bookings",
            value: 156,
            icon: <BookOutlined style={{ fontSize: '20px', color: '#4335A7' }} />,
            change: "+12%",
            trend: "up",
            color: "#4335A7",
            bgColor: "rgba(67, 53, 167, 0.1)"
        },
        {
            title: "Available Cars",
            value: 48,
            icon: <CarOutlined style={{ fontSize: '20px', color: '#D2691E' }} />,
            change: "+8%",
            trend: "up",
            color: "#D2691E",
            bgColor: "rgba(210, 105, 30, 0.1)"
        },
        {
            title: "Total Revenue",
            value: "$42,580",
            icon: <DollarOutlined style={{ fontSize: '20px', color: '#10B981' }} />,
            change: "+23%",
            trend: "up",
            color: "#10B981",
            bgColor: "rgba(16, 185, 129, 0.1)"
        },
        {
            title: "Active Users",
            value: 234,
            icon: <UserOutlined style={{ fontSize: '20px', color: '#8B5CF6' }} />,
            change: "+5%",
            trend: "up",
            color: "#8B5CF6",
            bgColor: "rgba(139, 92, 246, 0.1)"
        }
    ];

    // Chart Data - Compact version
    const bookingTrendsData = [
        { day: 'Mon', bookings: 45 },
        { day: 'Tue', bookings: 52 },
        { day: 'Wed', bookings: 48 },
        { day: 'Thu', bookings: 60 },
        { day: 'Fri', bookings: 68 },
        { day: 'Sat', bookings: 72 },
        { day: 'Sun', bookings: 55 },
    ];

    const carCategoryData = [
        { name: 'Economy', value: 35, color: '#4335A7' },
        { name: 'SUV', value: 25, color: '#D2691E' },
        { name: 'Luxury', value: 20, color: '#10B981' },
        { name: 'Sports', value: 15, color: '#8B5CF6' },
        { name: 'Van', value: 5, color: '#F59E0B' },
    ];

    const monthlyRevenueData = [
        { month: 'Jan', revenue: 4500 },
        { month: 'Feb', revenue: 5200 },
        { month: 'Mar', revenue: 4800 },
        { month: 'Apr', revenue: 6100 },
        { month: 'May', revenue: 6800 },
        { month: 'Jun', revenue: 7200 },
        { month: 'Jul', revenue: 6500 },
        { month: 'Aug', revenue: 5800 },
        { month: 'Sep', revenue: 6200 },
        { month: 'Oct', revenue: 6900 },
        { month: 'Nov', revenue: 7500 },
        { month: 'Dec', revenue: 8200 },
    ];

    const satisfactionData = [
        { name: 'Excellent', value: 45, color: '#10B981' },
        { name: 'Good', value: 35, color: '#3B82F6' },
        { name: 'Average', value: 15, color: '#F59E0B' },
        { name: 'Poor', value: 5, color: '#EF4444' },
    ];

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
                    <p className="font-semibold text-gray-800 mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-xs" style={{ color: entry.color }}>
                            {entry.dataKey}: {entry.dataKey === 'revenue' ? `$${entry.value}` : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Pie Chart Tooltip
    const PieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
                    <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
                    <p className="text-gray-600">{payload[0].value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header Section - More Compact */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4"
            >
                <div className="p-4 bg-gradient-to-r from-[#4335A7] via-[#5A4BC2] to-[#6A5ACD] rounded-2xl shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                            <Title level={4} className="!m-0 !text-white !font-bold">
                                Admin Dashboard Overview
                            </Title>
                            <Text className="text-white/80 text-sm mt-1 block">
                                Real-time car rental analytics
                            </Text>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs">
                                <CheckCircleOutlined className="text-green-300 text-xs" />
                                <Text className="text-white text-xs">Online</Text>
                            </div>
                            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-xs">
                                <ClockCircleOutlined className="text-amber-300 text-xs" />
                                <Text className="text-white text-xs">Updated now</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Overview Cards - More Compact */}
            <Row gutter={[16, 16]} className="mb-8">
                {statsData.map((stat, index) => (
                    <Col xs={24} sm={12} lg={6} key={stat.title}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card
                                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                                style={{ borderLeft: `4px solid ${stat.color}` }}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Text className="text-gray-500 text-sm font-medium">{stat.title}</Text>
                                        <Title level={3} className="!m-0 !mt-2 !font-bold" style={{ color: stat.color }}>
                                            {stat.value}
                                        </Title>
                                        <div className="flex items-center gap-1 mt-2">
                                            {stat.trend === "up" ? (
                                                <ArrowUpOutlined className="text-green-500" />
                                            ) : (
                                                <ArrowDownOutlined className="text-red-500" />
                                            )}
                                            <Text
                                                className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                                            >
                                                {stat.change} from last month
                                            </Text>
                                        </div>
                                    </div>
                                    <div
                                        className="p-3 rounded-xl"
                                        style={{ backgroundColor: stat.bgColor }}
                                    >
                                        {stat.icon}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* Charts Grid Layout - More Compact */}
            <Row gutter={[8, 8]} className="mb-4">
                {/* Car Categories */}
                <Col xs={24} lg={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card
                            className="border-0 shadow rounded-lg"
                            styles={{ body: { padding: '12px' } }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <PieChartOutlined style={{ color: '#D2691E', fontSize: '14px' }} />
                                <Text className="font-semibold text-gray-800 text-sm">Car Categories</Text>
                            </div>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={carCategoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={60}
                                            innerRadius={20}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {carCategoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip content={<PieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-center mt-2">
                                {carCategoryData.map((cat) => (
                                    <div key={cat.name} className="flex items-center gap-1 text-xs">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <Text className="text-gray-600">{cat.name}</Text>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </Col>

                {/* Monthly Revenue */}
                <Col xs={24} lg={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card
                            className="border-0 shadow rounded-lg"
                            styles={{ body: { padding: '12px' } }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <BarChartOutlined style={{ color: '#10B981', fontSize: '14px' }} />
                                    <Text className="font-semibold text-gray-800 text-sm">Revenue Trend</Text>
                                </div>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                    +38%
                                </span>
                            </div>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyRevenueData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#666"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#666"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10B981"
                                            fill="url(#colorRevenue)"
                                            strokeWidth={1.5}
                                        />
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>
                </Col>

                {/* Bookings Trend */}
                <Col xs={24} lg={8}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Card
                            className="border-0 shadow rounded-lg"
                            styles={{ body: { padding: '12px' } }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <LineChartOutlined style={{ color: '#4335A7', fontSize: '14px' }} />
                                    <Text className="font-semibold text-gray-800 text-sm">Weekly Bookings</Text>
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                    Peak: 72
                                </span>
                            </div>
                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={bookingTrendsData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" vertical={false} />
                                        <XAxis
                                            dataKey="day"
                                            stroke="#666"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#666"
                                            fontSize={10}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="bookings"
                                            stroke="#4335A7"
                                            strokeWidth={1.5}
                                            dot={{ r: 2 }}
                                            activeDot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            {/* Customer Satisfaction - Compact */}
            <Row gutter={[8, 8]} className="mb-4">
                <Col xs={24}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card
                            className="border-0 shadow rounded-lg"
                            styles={{ body: { padding: '12px' } }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <PieChartOutlined style={{ color: '#8B5CF6', fontSize: '14px' }} />
                                    <Text className="font-semibold text-gray-800 text-sm">Customer Satisfaction</Text>
                                </div>
                                <div className="text-sm font-bold text-[#8B5CF6]">⭐ 4.5/5</div>
                            </div>
                            <Row gutter={[8, 8]}>
                                <Col xs={24} md={12}>
                                    <div className="h-52">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={satisfactionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={80}
                                                    innerRadius={40}
                                                    paddingAngle={1}
                                                    dataKey="value"
                                                >
                                                    {satisfactionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip content={<PieTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Col>
                                <Col xs={24} md={12}>
                                    <div className="space-y-2">
                                        {satisfactionData.map((item) => (
                                            <div key={item.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <Text className="text-sm font-medium text-gray-800">{item.name}</Text>
                                                </div>
                                                <div className="flex items-center gap-3 w-32">
                                                    <div className="flex-1">
                                                        <div className="bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="h-2 rounded-full"
                                                                style={{
                                                                    width: `${item.value}%`,
                                                                    backgroundColor: item.color
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Text className="font-bold text-gray-800 text-sm w-8 text-right">
                                                        {item.value}%
                                                    </Text>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="bg-blue-50 p-3 rounded mt-3">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Text className="text-blue-700 text-xs">Response Time</Text>
                                                    <Text className="text-base font-bold text-blue-900">4.2/5</Text>
                                                </div>
                                                <div>
                                                    <Text className="text-blue-700 text-xs">Vehicle Quality</Text>
                                                    <Text className="text-base font-bold text-blue-900">4.7/5</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            {/* Main Content Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-4"
            >
                <Card
                    className="border-0 shadow rounded-lg"
                    styles={{ body: { padding: 0 } }}
                >
                    {/* Custom Tabs Header */}
                    <div className="border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-wrap">
                            {[
                                { key: "bookings", label: "Bookings", icon: <BookOutlined className="text-sm" /> },
                                { key: "cars", label: "Cars", icon: <CarOutlined className="text-sm" /> },
                                { key: "revenue", label: "Revenue", icon: <DollarOutlined className="text-sm" /> },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`
                                        flex items-center gap-2 px-4 py-3 text-lg font-bold transition-all duration-200
                                        ${activeTab === tab.key
                                            ? "text-[#4335A7] border-b-2 border-[#4335A7] bg-white"
                                            : "text-gray-600 hover:text-[#4335A7] hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className=" bg-white">
                        {activeTab === "bookings" && <TotalBookings />}
                        {activeTab === "cars" && <AvailableCar />}
                        {activeTab === "revenue" && <TotalRevenue />}
                    </div>
                </Card>
            </motion.div>


        </div>
    );
};

export default DashBoardOverview;