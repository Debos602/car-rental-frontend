import React from 'react';
import { Card, Typography } from 'antd';
import { DollarOutlined, ClockCircleOutlined, CheckCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { themeColors, formatCurrency, ProcessedBooking } from './profileUtils';

const { Title, Text } = Typography;

const PaymentSummary = ({ bookings }: { bookings: ProcessedBooking[]; }) => {
    const totalSpent = bookings.reduce((acc, b) => acc + b.totalCost, 0);
    const pendingAmount = bookings
        .filter(b => b.paymentStatus === 'pending')
        .reduce((acc, b) => acc + b.totalCost, 0);
    const paidAmount = bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((acc, b) => acc + b.totalCost, 0);
    const refundedAmount = bookings
        .filter(b => b.paymentStatus === 'refunded')
        .reduce((acc, b) => acc + b.totalCost, 0);

    const items = [
        { label: "Total Spent", value: totalSpent, color: themeColors.primary, icon: <DollarOutlined /> },
        { label: "Pending Payments", value: pendingAmount, color: themeColors.warning, icon: <ClockCircleOutlined /> },
        { label: "Amount Paid", value: paidAmount, color: themeColors.success, icon: <CheckCircleOutlined /> },
        { label: "Refunded", value: refundedAmount, color: themeColors.danger, icon: <WalletOutlined /> }
    ];

    return (
        <Card
            className="rounded-xl shadow-sm border-0"
            style={{ backgroundColor: themeColors.card }}
        >
            <Title level={4} style={{ color: themeColors.dark, marginBottom: '20px' }}>
                Payment Summary
            </Title>
            <div className="space-y-4">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${item.color}15` }}
                            >
                                {React.cloneElement(item.icon, {
                                    style: { color: item.color }
                                })}
                            </div>
                            <div>
                                <Text style={{
                                    color: themeColors.lightText,
                                    fontSize: '14px'
                                }}>
                                    {item.label}
                                </Text>
                            </div>
                        </div>
                        <Text style={{
                            color: themeColors.text,
                            fontWeight: 600,
                            fontSize: '16px'
                        }}>
                            {formatCurrency(item.value)}
                        </Text>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-6 border-t" style={{ borderColor: themeColors.border }}>
                <div className="flex items-center justify-between">
                    <Text style={{ color: themeColors.lightText }}>Average Booking Value</Text>
                    <Text strong style={{ color: themeColors.dark }}>
                        {formatCurrency(bookings.length > 0 ? totalSpent / bookings.length : 0)}
                    </Text>
                </div>
            </div>
        </Card>
    );
};

export default PaymentSummary;
