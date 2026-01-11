import React from 'react';
import { Card, Badge, Typography } from 'antd';
import { HistoryOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { themeColors, formatCurrency, ProcessedBooking } from './profileUtils';

const { Title, Text } = Typography;

const DashboardStats = ({ bookings }: { bookings: ProcessedBooking[]; }) => {
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((acc, booking) => acc + booking.totalCost, 0);
    const paidBookings = bookings.filter(b => b.paymentStatus === 'paid').length;
    const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length;

    const stats = [
        {
            title: "Total Bookings",
            value: totalBookings,
            icon: <HistoryOutlined />,
            color: themeColors.primary,
            trend: "+12%",
            description: "All-time bookings"
        },
        {
            title: "Total Spent",
            value: totalSpent,
            icon: <DollarOutlined />,
            color: themeColors.success,
            formatter: formatCurrency,
            description: "Lifetime spending"
        },
        {
            title: "Completed Trips",
            value: paidBookings,
            icon: <CheckCircleOutlined />,
            color: themeColors.secondary,
            trend: "+8%",
            description: "Successfully completed"
        },
        {
            title: "Pending Payments",
            value: pendingPayments,
            icon: <ClockCircleOutlined />,
            color: themeColors.warning,
            description: "Awaiting payment"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index}>
                    <Card
                        className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-0"
                        style={{
                            backgroundColor: themeColors.card,
                            borderLeft: `4px solid ${stat.color}`
                        }}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <Text className="block text-sm font-medium mb-2" style={{ color: themeColors.lightText }}>
                                    {stat.title}
                                </Text>
                                <div className="flex items-end space-x-2">
                                    <Title level={3} style={{ color: themeColors.dark, margin: 0 }}>
                                        {stat.formatter ? stat.formatter(stat.value) : stat.value}
                                    </Title>
                                    {stat.trend && (
                                        <Badge
                                            count={stat.trend}
                                            style={{
                                                backgroundColor: themeColors.successLight,
                                                color: '#065f46',
                                                fontSize: '10px',
                                                padding: '2px 6px'
                                            }}
                                        />
                                    )}
                                </div>
                                <Text className="block mt-2 text-xs" style={{ color: themeColors.lightText }}>
                                    {stat.description}
                                </Text>
                            </div>
                            <div
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: `${stat.color}15` }}
                            >
                                {React.cloneElement(stat.icon, {
                                    style: {
                                        fontSize: '20px',
                                        color: stat.color
                                    }
                                })}
                            </div>
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
