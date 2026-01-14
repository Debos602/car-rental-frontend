import { useGetUserQuery } from "@/redux/feature/authApi";
import { useGetBookingsQuery } from "@/redux/feature/booking/bookingApi";
import { Card, Statistic, Table, Tag, Spin, Row, Col, Typography, List } from "antd";
import {
    DollarOutlined,
    CarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UserOutlined,
    CalendarOutlined,
    CreditCardOutlined
} from "@ant-design/icons";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";
import { CSSProperties } from "react";

const { Title, Text } = Typography;

// Type definitions
interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    drivingLicense?: string;
    nid?: string;
    createdAt: string;
    updatedAt: string;
}

interface Car {
    _id: string;
    name: string;
    description: string;
    image: string;
    color: string;
    isElectric: boolean;
    features: string[];
    pricePerHour: number;
    status: string;
}

interface Booking {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    user: User;
    car: Car;
    totalCost: number;
    paymentStatus: 'paid' | 'pending' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

// Flexible ChartData interface for different chart types
interface ChartData {
    name?: string;
    value?: number;
    count?: number;
    amount?: number;
    month?: string;
    [key: string]: any; // Allow additional properties
}

// Custom scrollbar styles
const scrollbarStyles: CSSProperties = {
    scrollbarWidth: 'thin',
    scrollbarColor: '#d1d5db #f3f4f6',
};

// Theme colors based on the image
const themeColors = {
    primary: '#1e40af', // Deep blue
    secondary: '#3b82f6', // Medium blue
    accent: '#10b981', // Green
    warning: '#f59e0b', // Amber
    text: '#1f2937', // Dark gray
    lightText: '#6b7280', // Medium gray
    background: '#f8fafc', // Light blue-gray
    card: '#ffffff', // White
    border: '#e5e7eb' // Light gray
};

export default function UserDashBoardOverview() {
    const {
        data: user,
        isLoading: userLoading,
    } = useGetUserQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    const {
        data: bookings,
        isLoading: bookingsLoading,
        refetch,
    } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    if (userLoading || bookingsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const userData: User = user?.data;
    const bookingsData: Booking[] = bookings?.data || [];

    // Calculate statistics
    const totalBookings = bookingsData.length;
    const totalSpent = bookingsData.reduce((sum: number, booking: Booking) =>
        sum + (booking.totalCost || 0), 0
    );
    const paidBookings = bookingsData.filter((booking: Booking) =>
        booking.paymentStatus === 'paid'
    ).length;
    const upcomingBookings = bookingsData.filter((booking: Booking) =>
        new Date(booking.date) > new Date()
    ).length;
    const avgBookingCost = totalBookings > 0 ? totalSpent / totalBookings : 0;

    // Prepare data for charts
    const paymentStatusData: ChartData[] = [
        { name: 'Paid', value: paidBookings },
        { name: 'Pending', value: totalBookings - paidBookings }
    ];

    const carTypeData: ChartData[] = bookingsData.reduce((acc: ChartData[], booking: Booking) => {
        const carName = booking.car?.name || 'Unknown';
        const existing = acc.find(item => item.name === carName);
        if (existing) {
            existing.count = (existing.count || 0) + 1;
        } else {
            acc.push({ name: carName, count: 1 });
        }
        return acc;
    }, []);

    const monthlySpendingData: ChartData[] = bookingsData.reduce((acc: ChartData[], booking: Booking) => {
        const date = new Date(booking.date);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const monthYear = `${month} ${year}`;

        const existing = acc.find(item => item.month === monthYear);
        if (existing) {
            existing.amount = (existing.amount || 0) + booking.totalCost;
        } else {
            acc.push({ month: monthYear, amount: booking.totalCost });
        }
        return acc;
    }, []).sort((a: ChartData, b: ChartData) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const aMonth = a.month?.split(' ')[0] || '';
        const bMonth = b.month?.split(' ')[0] || '';
        return months.indexOf(aMonth) - months.indexOf(bMonth);
    });

    // Calculate booking frequency by day of week
    const bookingByDayData: ChartData[] = bookingsData.reduce((acc: ChartData[], booking: Booking) => {
        const date = new Date(booking.date);
        const day = date.toLocaleString('default', { weekday: 'short' });
        const existing = acc.find(item => item.name === day);
        if (existing) {
            existing.value = (existing.value || 0) + 1;
        } else {
            acc.push({ name: day, value: 1 });
        }
        return acc;
    }, []).sort((a: ChartData, b: ChartData) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.indexOf(a.name || '') - days.indexOf(b.name || '');
    });

    // Colors for charts based on theme
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const PAYMENT_COLORS = ['#10b981', '#f59e0b'];

    // Responsive table columns with breakpoints
    const columns = [
        {
            title: 'Car',
            dataIndex: ['car', 'name'],
            key: 'car',
            width: 180,
            fixed: 'left' as const,
            render: (text: string, record: Booking) => (
                <div className="flex items-center space-x-3">
                    <img
                        src={record.car?.image}
                        alt={text}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                        style={{ borderColor: themeColors.border }}
                    />
                    <div className="min-w-0">
                        <div className="font-medium truncate" style={{ color: themeColors.text }}>{text}</div>
                        <Text type="secondary" className="text-xs truncate" style={{ color: themeColors.lightText }}>{record.car?.color}</Text>
                    </div>
                </div>
            ),
        },
        {
            title: 'Date & Time',
            key: 'datetime',
            width: 150,
            render: (record: Booking) => (
                <div className="min-w-0">
                    <div className="font-medium text-sm" style={{ color: themeColors.text }}>{new Date(record.date).toLocaleDateString()}</div>
                    <Text type="secondary" className="text-xs truncate" style={{ color: themeColors.lightText }}>
                        {record.startTime} - {record.endTime}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Duration',
            key: 'duration',
            width: 100,
            responsive: ['md'] as any,
            render: (record: Booking) => {
                const start = new Date(`${record.date}T${record.startTime}`);
                const end = new Date(`${record.date}T${record.endTime}`);
                const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                return (
                    <div className="font-medium text-sm" style={{ color: themeColors.text }}>
                        {duration.toFixed(1)}h
                    </div>
                );
            },
        },
        {
            title: 'Cost',
            dataIndex: 'totalCost',
            key: 'cost',
            width: 100,
            render: (cost: number) => (
                <span className="font-bold text-sm sm:text-base" style={{ color: themeColors.accent }}>
                    ${cost.toFixed(2)}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'paymentStatus',
            key: 'status',
            width: 110,
            fixed: 'right' as const,
            render: (status: string) => (
                <Tag
                    color={status === 'paid' ? 'success' : 'warning'}
                    icon={status === 'paid' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                    className="text-xs sm:text-sm py-0.5 px-2 font-medium"
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Booked On',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            responsive: ['lg'] as any,
            render: (date: string) => (
                <div className="text-sm" style={{ color: themeColors.text }}>
                    {new Date(date).toLocaleDateString()}
                </div>
            ),
        },
    ];

    // Helper function to find most booked car
    const getMostBookedCar = (): string => {
        if (carTypeData.length === 0) return 'N/A';

        const mostBooked = carTypeData.reduce((prev, current) =>
            (prev.count || 0) > (current.count || 0) ? prev : current
        );
        return mostBooked.name || 'Unknown';
    };

    // Helper function to find favorite booking day
    const getFavoriteBookingDay = (): string => {
        if (bookingByDayData.length === 0) return 'N/A';

        const favoriteDay = bookingByDayData.reduce((prev, current) =>
            (prev.value || 0) > (current.value || 0) ? prev : current
        );
        return favoriteDay.name || 'Unknown';
    };

    // Calculate payment summary
    const totalPaidAmount = bookingsData
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalCost, 0);

    const totalPendingAmount = bookingsData
        .filter(b => b.paymentStatus !== 'paid')
        .reduce((sum, b) => sum + b.totalCost, 0);

    // Mobile friendly booking list component
    const MobileBookingCard = ({ booking }: { booking: Booking; }) => {
        const start = new Date(`${booking.date}T${booking.startTime}`);
        const end = new Date(`${booking.date}T${booking.endTime}`);
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        return (
            <Card
                size="small"
                className="mb-3 hover:shadow-md transition-shadow"
                style={{ borderColor: themeColors.border }}
            >
                <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <img
                            src={booking.car?.image}
                            alt={booking.car?.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            style={{ borderColor: themeColors.border }}
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0">
                                    <div className="font-medium truncate" style={{ color: themeColors.text }}>{booking.car?.name}</div>
                                    <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>{booking.car?.color}</Text>
                                </div>
                                <Tag
                                    color={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                                    className="flex-shrink-0 ml-2 py-0.5 px-2 text-xs font-medium"
                                >
                                    {booking.paymentStatus.toUpperCase()}
                                </Tag>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>Date</Text>
                                    <div style={{ color: themeColors.text }}>{new Date(booking.date).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>Time</Text>
                                    <div style={{ color: themeColors.text }}>{booking.startTime} - {booking.endTime}</div>
                                </div>
                                <div>
                                    <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>Duration</Text>
                                    <div style={{ color: themeColors.text }}>{duration.toFixed(1)}h</div>
                                </div>
                                <div>
                                    <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>Cost</Text>
                                    <div className="font-bold" style={{ color: themeColors.accent }}>${booking.totalCost.toFixed(2)}</div>
                                </div>
                            </div>
                            <div className="mt-2 text-xs" style={{ color: themeColors.lightText }}>
                                Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="p-4 sm:p-6" style={{ backgroundColor: themeColors.background }}>
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <Title level={2} className="text-lg sm:text-2xl" style={{ color: themeColors.text }}>
                    Dashboard Overview
                </Title>
                <Text type="secondary" className="text-sm sm:text-base" style={{ color: themeColors.lightText }}>
                    Welcome back, {userData?.name}! Here's your booking summary.
                </Text>
            </div>

            {/* Stats Cards */}
            <Row gutter={[12, 12]} className="mb-6 sm:mb-8">
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        size="small"
                        className="h-full hover:shadow-md transition-shadow"
                        style={{ borderColor: themeColors.border }}
                    >
                        <Statistic
                            title={<span style={{ color: themeColors.lightText }}>Total Bookings</span>}
                            value={totalBookings}
                            prefix={<CalendarOutlined style={{ color: themeColors.primary }} />}
                            valueStyle={{ color: themeColors.primary, fontSize: '24px', fontWeight: '600' }}
                            className="text-sm"
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        size="small"
                        className="h-full hover:shadow-md transition-shadow"
                        style={{ borderColor: themeColors.border }}
                    >
                        <Statistic
                            title={<span style={{ color: themeColors.lightText }}>Total Spent</span>}
                            value={totalSpent}
                            prefix={<DollarOutlined style={{ color: themeColors.secondary }} />}
                            precision={2}
                            valueStyle={{ color: themeColors.secondary, fontSize: '24px', fontWeight: '600' }}
                            suffix={<span style={{ color: themeColors.text }}>$</span>}
                            className="text-sm"
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        size="small"
                        className="h-full hover:shadow-md transition-shadow"
                        style={{ borderColor: themeColors.border }}
                    >
                        <Statistic
                            title={<span style={{ color: themeColors.lightText }}>Paid Bookings</span>}
                            value={paidBookings}
                            prefix={<CreditCardOutlined style={{ color: themeColors.accent }} />}
                            valueStyle={{ color: themeColors.accent, fontSize: '24px', fontWeight: '600' }}
                            suffix={<span style={{ color: themeColors.lightText }}>/ {totalBookings}</span>}
                            className="text-sm"
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        size="small"
                        className="h-full hover:shadow-md transition-shadow"
                        style={{ borderColor: themeColors.border }}
                    >
                        <Statistic
                            title={<span style={{ color: themeColors.lightText }}>Upcoming</span>}
                            value={upcomingBookings}
                            prefix={<CarOutlined style={{ color: themeColors.warning }} />}
                            valueStyle={{ color: themeColors.warning, fontSize: '24px', fontWeight: '600' }}
                            className="text-sm"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts Section */}
            <Row gutter={[12, 12]} className="mb-6 sm:mb-8">
                <Col xs={24} lg={12}>
                    <Card
                        title="Payment Status"
                        size="small"
                        style={{ borderColor: themeColors.border }}
                        styles={{ header: { borderBottomColor: themeColors.border, color: themeColors.text } }}
                    >
                        <div className="h-64 sm:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => `${entry.name}: ${entry.value}`}
                                        outerRadius={70}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {paymentStatusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [`${value} bookings`, 'Count']}
                                        contentStyle={{
                                            backgroundColor: themeColors.card,
                                            borderColor: themeColors.border,
                                            color: themeColors.text
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title="Monthly Spending"
                        size="small"
                        style={{ borderColor: themeColors.border }}
                        styles={{ header: { borderBottomColor: themeColors.border, color: themeColors.text } }}
                    >
                        <div className="h-64 sm:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlySpendingData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={themeColors.border} />
                                    <XAxis
                                        dataKey="month"
                                        stroke={themeColors.lightText}
                                        tick={{ fill: themeColors.text }}
                                    />
                                    <YAxis
                                        stroke={themeColors.lightText}
                                        tick={{ fill: themeColors.text }}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`$${value}`, 'Amount']}
                                        contentStyle={{
                                            backgroundColor: themeColors.card,
                                            borderColor: themeColors.border,
                                            color: themeColors.text
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke={themeColors.primary}
                                        strokeWidth={3}
                                        activeDot={{ r: 8, fill: themeColors.secondary }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[12, 12]} className="mb-6 sm:mb-8">
                <Col xs={24} lg={12}>
                    <Card
                        title="Bookings by Car"
                        size="small"
                        style={{ borderColor: themeColors.border }}
                        styles={{ header: { borderBottomColor: themeColors.border, color: themeColors.text } }}
                    >
                        <div className="h-64 sm:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={carTypeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={themeColors.border} />
                                    <XAxis
                                        dataKey="name"
                                        stroke={themeColors.lightText}
                                        tick={{ fill: themeColors.text }}
                                    />
                                    <YAxis
                                        stroke={themeColors.lightText}
                                        tick={{ fill: themeColors.text }}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${value} bookings`, 'Count']}
                                        contentStyle={{
                                            backgroundColor: themeColors.card,
                                            borderColor: themeColors.border,
                                            color: themeColors.text
                                        }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill={themeColors.secondary}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card
                        title="Booking by Day"
                        size="small"
                        style={{ borderColor: themeColors.border }}
                        styles={{ header: { borderBottomColor: themeColors.border, color: themeColors.text } }}
                    >
                        <div className="h-64 sm:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bookingByDayData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={themeColors.border} />
                                    <XAxis
                                        dataKey="name"
                                        stroke={themeColors.lightText}
                                        tick={{ fill: themeColors.text }}
                                    />
                                    <YAxis
                                        stroke={themeColors.lightText}
                                        tick={{ fill: themeColors.text }}
                                    />
                                    <Tooltip
                                        formatter={(value) => [`${value} bookings`, 'Count']}
                                        contentStyle={{
                                            backgroundColor: themeColors.card,
                                            borderColor: themeColors.border,
                                            color: themeColors.text
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill={themeColors.warning}
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* User Info Card */}
            <Card
                title="User Information"
                className="mb-6 sm:mb-8"
                size="small"
                style={{ borderColor: themeColors.border }}
                styles={{ header: { borderBottomColor: themeColors.border, color: themeColors.text } }}
            >
                <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12} md={8}>
                        <div className="space-y-1">
                            <Text strong className="text-sm" style={{ color: themeColors.text }}>Full Name:</Text>
                            <div className="flex items-center">
                                <UserOutlined className="mr-2" style={{ color: themeColors.primary }} />
                                <Text className="text-sm" style={{ color: themeColors.text }}>{userData?.name}</Text>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="space-y-1">
                            <Text strong className="text-sm" style={{ color: themeColors.text }}>Email:</Text>
                            <Text className="text-sm" style={{ color: themeColors.text }}>{userData?.email}</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="space-y-1">
                            <Text strong className="text-sm" style={{ color: themeColors.text }}>Phone:</Text>
                            <Text className="text-sm" style={{ color: themeColors.text }}>{userData?.phone}</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="space-y-1">
                            <Text strong className="text-sm" style={{ color: themeColors.text }}>Driving License:</Text>
                            <Text className="text-sm" style={{ color: themeColors.lightText }}>{userData?.drivingLicense || 'Not provided'}</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="space-y-1">
                            <Text strong className="text-sm" style={{ color: themeColors.text }}>NID:</Text>
                            <Text className="text-sm" style={{ color: themeColors.lightText }}>{userData?.nid || 'Not provided'}</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div className="space-y-1">
                            <Text strong className="text-sm" style={{ color: themeColors.text }}>Member Since:</Text>
                            <Text className="text-sm" style={{ color: themeColors.text }}>{userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Recent Bookings - Responsive Section */}
            <Card
                title="Recent Bookings"
                size="small"
                extra={
                    <Text type="secondary" className="text-xs sm:text-sm" style={{ color: themeColors.lightText }}>
                        Showing {Math.min(bookingsData.length, 5)} of {bookingsData.length} bookings
                    </Text>
                }
                className="mb-6 sm:mb-8"
                style={{ borderColor: themeColors.border }}
                styles={{ header: { borderBottomColor: themeColors.border, color: themeColors.text } }}
            >
                {/* Desktop/Tablet View - Horizontal Scroll Table */}
                <div className="hidden md:block">
                    <div className="w-full overflow-x-auto" style={scrollbarStyles}>
                        <div className="min-w-[800px]">
                            <Table
                                columns={columns}
                                dataSource={bookingsData.slice(0, 5)}
                                rowKey="_id"
                                pagination={false}
                                size="small"
                                scroll={{ x: 'max-content', y: 400 }}
                                className="custom-scrollbar"
                                style={{
                                    borderColor: themeColors.border,
                                    backgroundColor: themeColors.card
                                }}
                            />
                        </div>
                    </div>
                    {/* CSS for custom scrollbar */}
                    <style>{`
                        .custom-scrollbar::-webkit-scrollbar {
                            height: 8px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: ${themeColors.background};
                            border-radius: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: ${themeColors.border};
                            border-radius: 4px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: ${themeColors.lightText};
                        }
                    `}</style>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden">
                    <div className="space-y-3">
                        {bookingsData.slice(0, 5).map((booking) => (
                            <MobileBookingCard key={booking._id} booking={booking} />
                        ))}
                    </div>
                </div>
            </Card>

            {/* Quick Stats */}
            <Row gutter={[12, 12]} className="mt-6">
                <Col xs={24} sm={12}>
                    <Card
                        size="small"
                        title="Booking Insights"
                        style={{ borderColor: themeColors.border }}
                        styles={{ header: { borderBottomColor: themeColors.border, color: themeColors.text } }}
                    >
                        <List
                            size="small"
                            dataSource={[
                                { label: 'Average Booking Cost', value: `$${avgBookingCost.toFixed(2)}` },
                                { label: 'Most Booked Car', value: getMostBookedCar() },
                                { label: 'Favorite Booking Day', value: getFavoriteBookingDay() },
                            ]}
                            renderItem={(item) => (
                                <List.Item className="!px-0">
                                    <Text className="text-sm" style={{ color: themeColors.text }}>{item.label}</Text>
                                    <Text strong className="text-sm" style={{ color: themeColors.primary }}>{item.value}</Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card
                        size="small"
                        title="Payment Summary"
                        style={{ borderColor: themeColors.border }}
                        styles={{ header: { borderBottomColor: themeColors.border, color: themeColors.text } }}
                    >
                        <List
                            size="small"
                            dataSource={[
                                {
                                    label: 'Total Amount Paid',
                                    value: `$${totalPaidAmount.toFixed(2)}`,
                                    color: 'success' as const
                                },
                                {
                                    label: 'Pending Payments',
                                    value: `$${totalPendingAmount.toFixed(2)}`,
                                    color: 'warning' as const
                                },
                                {
                                    label: 'Payment Success Rate',
                                    value: `${totalBookings > 0 ? ((paidBookings / totalBookings) * 100).toFixed(1) : 0}%`
                                },
                            ]}
                            renderItem={(item) => (
                                <List.Item className="!px-0">
                                    <Text className="text-sm" style={{ color: themeColors.text }}>{item.label}</Text>
                                    <Text
                                        strong
                                        type={item.color || undefined}
                                        className="text-sm"
                                    >
                                        {item.value}
                                    </Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}