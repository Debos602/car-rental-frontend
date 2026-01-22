
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
import { CSSProperties, ReactNode } from "react";
import { formatOnlyTime } from "@/lib/time";
import { Bookings } from "@/types/global";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useGetUserQuery } from "@/redux/feature/auth/authApi";

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
    [key: string]: any;
}

// Custom scrollbar styles
const scrollbarStyles: CSSProperties = {
    scrollbarWidth: 'thin',
    scrollbarColor: '#d1d5db #f3f4f6',
};

// Theme colors based on the image
const themeColors = {
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#10b981',
    warning: '#f59e0b',
    text: '#1f2937',
    lightText: '#6b7280',
    background: '#f8fafc',
    card: '#ffffff',
    border: '#e5e7eb'
};

// Animation variants
const pageVariants = {
    initial: { opacity: 1 },
    animate: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20
        }
    }
};

const statCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

const chartVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 15,
            delay: 0.1
        }
    }
};

const loadingVariants = {
    animate: {
        rotate: 360,
        transition: {
            repeat: Infinity,
            duration: 1,
            ease: "linear"
        }
    }
};

// AnimatedCounter component for numbers
interface AnimatedCounterProps {
    value: number;
    prefix?: string;
    suffix?: string;
    precision?: number;
}
const AnimatedCounter = ({ value, prefix, suffix, precision = 0 }: AnimatedCounterProps) => {
    return (
        <motion.span
            key={value}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 15
            }}
        >
            {prefix}{value.toFixed(precision)}{suffix}
        </motion.span>
    );
};

// AnimatedStatistic component
const AnimatedStatistic = ({
    title,
    value,
    prefix,
    suffix,
    precision = 0,
    valueStyle
}: {
    title: string;
    value: number;
    prefix?: React.ReactNode;
    suffix?: string;
    precision?: number;
    valueStyle?: React.CSSProperties;
}) => {
    return (
        <Statistic
            title={<span style={{ color: themeColors.lightText }}>{title}</span>}
            value={value}
            prefix={prefix}
            precision={precision}
            valueStyle={valueStyle}
            suffix={suffix}
            className="text-sm"
            formatter={() => (
                <AnimatedCounter
                    value={value}
                    prefix={typeof prefix === 'string' ? prefix : undefined}
                    suffix={suffix}
                    precision={precision}
                />
            )}
        />
    );
};

// AnimatedCard wrapper component
const AnimatedCard = ({
    children,
    variants,
    whileHover,
    whileTap,
    className = "",
    initial = "hidden",
    animate = "visible",
    ...props
}: {
    children: ReactNode;
    variants?: any;
    whileHover?: any;
    whileTap?: any;
    className?: string;
    initial?: string;
    animate?: string;
}) => {
    return (
        <motion.div
            variants={variants}
            initial={initial}
            animate={animate}
            whileHover={whileHover}
            whileTap={whileTap}
            className={className}
        >
            {children}
        </motion.div>
    );
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
    } = useGetBookingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    // Refs for scroll animations
    const statsRef = useRef(null);
    const chartsRef = useRef(null);
    const userInfoRef = useRef(null);
    const bookingsRef = useRef(null);
    const insightsRef = useRef(null);

    const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
    const isChartsInView = useInView(chartsRef, { once: true, amount: 0.2 });
    const isUserInfoInView = useInView(userInfoRef, { once: true, amount: 0.3 });
    const isBookingsInView = useInView(bookingsRef, { once: true, amount: 0.2 });
    const isInsightsInView = useInView(insightsRef, { once: true, amount: 0.3 });

    if (userLoading || bookingsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <motion.div
                    variants={loadingVariants}
                    animate="animate"
                    className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                />
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
    const PAYMENT_COLORS = ['#10b981', '#f59e0b'];
    const computeDurationHours = (dateStr?: string, start?: string, end?: string) => {
        if (!start || !end) return 0;

        const makeDate = (d?: string, t?: string) => {
            if (!d || !t) return null;
            if (t.includes('T')) return new Date(t);
            if (d.includes('T')) return new Date(d);
            try {
                return new Date(`${d}T${t}`);
            } catch (e) {
                return null;
            }
        };

        const sd = makeDate(dateStr, start);
        const ed = makeDate(dateStr, end);
        if (!sd || !ed) return 0;
        const s = sd.getTime();
        const e = ed.getTime();
        if (!Number.isFinite(s) || !Number.isFinite(e)) return 0;
        const diffHours = (e - s) / (1000 * 60 * 60);
        if (!Number.isFinite(diffHours) || Number.isNaN(diffHours) || diffHours <= 0) return 0;
        return Math.round((diffHours + Number.EPSILON) * 10) / 10;
    };

    // Responsive table columns with breakpoints
    const columns = [
        {
            title: 'Car',
            dataIndex: ['car', 'name'],
            key: 'car',
            width: 180,
            fixed: 'left' as const,
            render: (text: string, record: Booking) => (
                <motion.div
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <motion.img
                        src={record.car?.image}
                        alt={text}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                        style={{ borderColor: themeColors.border }}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    />
                    <div className="min-w-0">
                        <div className="font-medium truncate" style={{ color: themeColors.text }}>{text}</div>
                        <Text type="secondary" className="text-xs truncate" style={{ color: themeColors.lightText }}>{record.car?.color}</Text>
                    </div>
                </motion.div>
            ),
        },
        {
            title: "Start Time",
            key: "startTime",
            render: (record: Bookings) => (
                <motion.span
                    className="font-medium"
                    whileHover={{ scale: 1.05 }}
                >
                    {formatOnlyTime(record.startTime)}
                </motion.span>
            ),
        },
        {
            title: "End Time",
            key: "endTime",
            render: (record: Bookings) => (
                <motion.span
                    className="font-medium"
                    whileHover={{ scale: 1.05 }}
                >
                    {formatOnlyTime(record.endTime)}
                </motion.span>
            ),
        },
        {
            title: <span style={{ color: themeColors.text, fontWeight: 600 }}>Duration</span>,
            key: 'duration',
            width: 90,
            responsive: ['lg'] as any,
            render: (record: Bookings) => {
                const duration = computeDurationHours(record.date, record.startTime, record.endTime);
                return (
                    <motion.div
                        className="text-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <div className="text-xs font-bold" style={{ color: themeColors.primary }}>
                            {duration > 0 ? `${duration.toFixed(1)}h` : "—"}
                        </div>
                    </motion.div>
                );
            },
        },
        {
            title: 'Cost',
            dataIndex: 'totalCost',
            key: 'cost',
            width: 100,
            render: (cost: number) => (
                <motion.span
                    className="font-bold text-sm sm:text-base"
                    style={{ color: themeColors.accent }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    ${cost.toFixed(2)}
                </motion.span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'paymentStatus',
            key: 'status',
            width: 110,
            fixed: 'right' as const,
            render: (status: string) => (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Tag
                        color={status === 'paid' ? 'success' : 'warning'}
                        icon={status === 'paid' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                        className="text-xs sm:text-sm py-0.5 px-2 font-medium"
                    >
                        {status.toUpperCase()}
                    </Tag>
                </motion.div>
            ),
        },
        {
            title: 'Booked On',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            responsive: ['lg'] as any,
            render: (date: string) => (
                <motion.div
                    className="text-sm"
                    style={{ color: themeColors.text }}
                    whileHover={{ scale: 1.05 }}
                >
                    {new Date(date).toLocaleDateString()}
                </motion.div>
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
    const MobileBookingCard = ({ booking, index }: { booking: Booking; index: number; }) => {
        const start = new Date(`${booking.date}T${booking.startTime}`);
        const end = new Date(`${booking.date}T${booking.endTime}`);
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Card
                    size="small"
                    className="mb-3 hover:shadow-md transition-shadow"
                    style={{ borderColor: themeColors.border }}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                            <motion.img
                                src={booking.car?.image}
                                alt={booking.car?.name}
                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                style={{ borderColor: themeColors.border }}
                                whileHover={{ scale: 1.1, rotate: 3 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0">
                                        <div className="font-medium truncate" style={{ color: themeColors.text }}>{booking.car?.name}</div>
                                        <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>{booking.car?.color}</Text>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Tag
                                            color={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                                            className="flex-shrink-0 ml-2 py-0.5 px-2 text-xs font-medium"
                                        >
                                            {booking.paymentStatus.toUpperCase()}
                                        </Tag>
                                    </motion.div>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>Date</Text>
                                        <div style={{ color: themeColors.text }}>{new Date(booking.date).toLocaleDateString()}</div>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>Time</Text>
                                        <div style={{ color: themeColors.text }}>{booking.startTime} - {booking.endTime}</div>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>Duration</Text>
                                        <div style={{ color: themeColors.text }}>{duration.toFixed(1)}h</div>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Text type="secondary" className="text-xs" style={{ color: themeColors.lightText }}>Cost</Text>
                                        <div className="font-bold" style={{ color: themeColors.accent }}>${booking.totalCost.toFixed(2)}</div>
                                    </motion.div>
                                </div>
                                <div className="mt-2 text-xs" style={{ color: themeColors.lightText }}>
                                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        );
    };

    return (
        <AnimatePresence>
            <motion.div
                initial="initial"
                animate="animate"
                variants={pageVariants}
                className="opacity-100"
            >
                {/* Header - Always visible immediately */}
                <div className="mb-6 sm:mb-8">
                    <Title level={2} className="text-lg sm:text-2xl" style={{ color: themeColors.text }}>
                        Dashboard Overview
                    </Title>
                    <Text type="secondary" className="text-sm sm:text-base" style={{ color: themeColors.lightText }}>
                        Welcome back, <span className="font-bold" style={{ color: themeColors.primary }}>{userData?.name}</span>! Here's your booking summary.
                    </Text>
                </div>

                {/* Stats Cards */}
                <motion.div
                    ref={statsRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isStatsInView ? "visible" : "visible"}
                >
                    <Row gutter={[12, 12]} className="mb-6 sm:mb-8">
                        {[
                            {
                                xs: 12, sm: 12, lg: 6,
                                title: "Total Bookings",
                                value: totalBookings,
                                prefix: <CalendarOutlined style={{ color: themeColors.primary }} />,
                                valueStyle: { color: themeColors.primary, fontSize: '24px', fontWeight: '600' }
                            },
                            {
                                xs: 12, sm: 12, lg: 6,
                                title: "Total Spent",
                                value: totalSpent,
                                prefix: <DollarOutlined style={{ color: themeColors.secondary }} />,
                                valueStyle: { color: themeColors.secondary, fontSize: '24px', fontWeight: '600' },
                                suffix: '$',
                                precision: 2
                            },
                            {
                                xs: 12, sm: 12, lg: 6,
                                title: "Paid Bookings",
                                value: paidBookings,
                                prefix: <CreditCardOutlined style={{ color: themeColors.accent }} />,
                                valueStyle: { color: themeColors.accent, fontSize: '24px', fontWeight: '600' },
                                suffix: `/ ${totalBookings}`
                            },
                            {
                                xs: 12, sm: 12, lg: 6,
                                title: "Upcoming",
                                value: upcomingBookings,
                                prefix: <CarOutlined style={{ color: themeColors.warning }} />,
                                valueStyle: { color: themeColors.warning, fontSize: '24px', fontWeight: '600' }
                            }
                        ].map((stat, index) => (
                            <Col key={index} xs={stat.xs} sm={stat.sm} lg={stat.lg}>
                                <AnimatedCard
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="h-full"
                                >
                                    <Card
                                        size="small"
                                        className="h-full hover:shadow-md transition-shadow cursor-pointer"
                                        style={{ borderColor: themeColors.border }}
                                    >
                                        <AnimatedStatistic
                                            title={stat.title}
                                            value={stat.value}
                                            prefix={stat.prefix}
                                            suffix={stat.suffix}
                                            precision={stat.precision}
                                            valueStyle={stat.valueStyle}
                                        />
                                    </Card>
                                </AnimatedCard>
                            </Col>
                        ))}
                    </Row>
                </motion.div>

                {/* Charts Section */}
                <motion.div
                    ref={chartsRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isChartsInView ? "visible" : "visible"}
                >
                    <Row gutter={[12, 12]} className="mb-6 sm:mb-8">
                        <Col xs={24} lg={12}>
                            <AnimatedCard
                                variants={chartVariants}
                                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                            >
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
                            </AnimatedCard>
                        </Col>
                        <Col xs={24} lg={12}>
                            <AnimatedCard
                                variants={chartVariants}
                                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                            >
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
                            </AnimatedCard>
                        </Col>
                    </Row>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Row gutter={[12, 12]} className="mb-6 sm:mb-8">
                        <Col xs={24} lg={12}>
                            <AnimatedCard
                                variants={chartVariants}
                                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                            >
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
                            </AnimatedCard>
                        </Col>
                        <Col xs={24} lg={12}>
                            <AnimatedCard
                                variants={chartVariants}
                                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                            >
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
                            </AnimatedCard>
                        </Col>
                    </Row>
                </motion.div>

                {/* User Info Card */}
                <motion.div
                    ref={userInfoRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isUserInfoInView ? "visible" : "visible"}
                >
                    <AnimatedCard
                        variants={cardVariants}
                        whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                    >
                        <Card
                            title="User Information"
                            className="mb-6 sm:mb-8"
                            size="small"
                            style={{ borderColor: themeColors.border }}
                            styles={{ header: { borderBottomColor: themeColors.border, color: themeColors.text } }}
                        >
                            <Row gutter={[12, 12]}>
                                {[
                                    { label: 'Full Name', value: userData?.name, icon: <UserOutlined />, iconColor: themeColors.primary },
                                    { label: 'Email', value: userData?.email },
                                    { label: 'Phone', value: userData?.phone },
                                    { label: 'Driving License', value: userData?.drivingLicense || 'Not provided', color: themeColors.lightText },
                                    { label: 'NID', value: userData?.nid || 'Not provided', color: themeColors.lightText },
                                    { label: 'Member Since', value: userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A' }
                                ].map((item, index) => (
                                    <Col key={index} xs={24} sm={12} md={8}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ scale: 1.02 }}
                                            className="space-y-1 p-2 rounded-lg hover:bg-gray-50"
                                        >
                                            <Text strong className="text-sm" style={{ color: themeColors.text }}>{item.label}:</Text>
                                            <div className="flex items-center">
                                                {item.icon && (
                                                    <span className="mr-2" style={{ color: item.iconColor }}>
                                                        {item.icon}
                                                    </span>
                                                )}
                                                <Text
                                                    className="text-sm"
                                                    style={{ color: item.color || themeColors.text }}
                                                >
                                                    {item.value}
                                                </Text>
                                            </div>
                                        </motion.div>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </AnimatedCard>
                </motion.div>

                {/* Recent Bookings - Responsive Section */}
                <motion.div
                    ref={bookingsRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isBookingsInView ? "visible" : "visible"}
                >
                    <AnimatedCard
                        variants={cardVariants}
                        whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                    >
                        <Card
                            title="Recent Bookings"
                            size="small"
                            extra={
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Text type="secondary" className="text-xs sm:text-sm" style={{ color: themeColors.lightText }}>
                                        Showing {Math.min(bookingsData.length, 5)} of {bookingsData.length} bookings
                                    </Text>
                                </motion.div>
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
                                            bordered
                                            columns={columns}
                                            dataSource={bookingsData.slice(0, 5).map((booking, index) => ({
                                                ...booking,
                                                key: booking._id,
                                                index
                                            }))}
                                            rowKey="_id"
                                            pagination={false}
                                            size="small"
                                            scroll={{ x: 'max-content', y: 400 }}
                                            className="custom-scrollbar"
                                            style={{
                                                borderColor: themeColors.border,
                                                backgroundColor: themeColors.card
                                            }}
                                            onRow={(record: any) => ({
                                                style: {
                                                    animation: `fadeInLeft 0.5s ease forwards ${record.index * 0.1}s`
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                                {/* CSS for custom scrollbar and animations */}
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
                                    
                                    @keyframes fadeInLeft {
                                        from {
                                            opacity: 0;
                                            transform: translateX(-20px);
                                        }
                                        to {
                                            opacity: 1;
                                            transform: translateX(0);
                                        }
                                    }
                                `}</style>
                            </div>

                            {/* Mobile View - Cards */}
                            <div className="md:hidden">
                                <motion.div className="space-y-3">
                                    {bookingsData.slice(0, 5).map((booking, index) => (
                                        <MobileBookingCard key={booking._id} booking={booking} index={index} />
                                    ))}
                                </motion.div>
                            </div>
                        </Card>
                    </AnimatedCard>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    ref={insightsRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInsightsInView ? "visible" : "visible"}
                >
                    <Row gutter={[12, 12]} className="mt-6">
                        <Col xs={24} sm={12}>
                            <AnimatedCard
                                variants={cardVariants}
                                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                                whileTap={{ scale: 0.98 }}
                            >
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
                                        renderItem={(item, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <List.Item className="!px-0">
                                                    <Text className="text-sm" style={{ color: themeColors.text }}>{item.label}</Text>
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        <Text strong className="text-sm" style={{ color: themeColors.primary }}>{item.value}</Text>
                                                    </motion.div>
                                                </List.Item>
                                            </motion.div>
                                        )}
                                    />
                                </Card>
                            </AnimatedCard>
                        </Col>
                        <Col xs={24} sm={12}>
                            <AnimatedCard
                                variants={cardVariants}
                                whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                                whileTap={{ scale: 0.98 }}
                            >
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
                                        renderItem={(item, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <List.Item className="!px-0">
                                                    <Text className="text-sm" style={{ color: themeColors.text }}>{item.label}</Text>
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ type: "spring", stiffness: 300 }}
                                                    >
                                                        <Text
                                                            strong
                                                            type={item.color || undefined}
                                                            className="text-sm"
                                                        >
                                                            {item.value}
                                                        </Text>
                                                    </motion.div>
                                                </List.Item>
                                            </motion.div>
                                        )}
                                    />
                                </Card>
                            </AnimatedCard>
                        </Col>
                    </Row>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}