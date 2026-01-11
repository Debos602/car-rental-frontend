import React from 'react';
import { Card, Button, message, Typography } from 'antd';
import { CarOutlined, CreditCardOutlined, FileTextOutlined, BarChartOutlined } from '@ant-design/icons';
import { themeColors } from './profileUtils';

const { Text } = Typography;

const QuickActions = () => {
    const actions = [
        {
            label: "New Booking",
            icon: <CarOutlined />,
            color: themeColors.primary,
            onClick: () => window.location.href = '/cars'
        },
        {
            label: "Make Payment",
            icon: <CreditCardOutlined />,
            color: themeColors.success,
            onClick: () => message.info('Payment feature coming soon!')
        },
        {
            label: "View History",
            icon: <FileTextOutlined />,
            color: themeColors.secondary,
            onClick: () => message.info('Opening booking history')
        },
        {
            label: "Report",
            icon: <BarChartOutlined />,
            color: themeColors.warning,
            onClick: () => message.info('Downloading report...')
        }
    ];

    return (
        <Card
            className="rounded-xl shadow-sm border-0"
            style={{ backgroundColor: themeColors.card }}
        >
            <Title level={4} style={{ color: themeColors.dark, marginBottom: '20px' }}>
                Quick Actions
            </Title>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {actions.map((action, index) => (
                    <div key={index}>
                        <Button
                            type="text"
                            className="flex flex-col items-center justify-center p-4 rounded-lg h-36 w-full"
                            style={{
                                backgroundColor: `${action.color}10`,
                                border: `1px solid ${action.color}30`
                            }}
                            onClick={action.onClick}
                        >
                            <div
                                className="p-3 rounded-full mb-3"
                                style={{ backgroundColor: action.color }}
                            >
                                {React.cloneElement(action.icon, {
                                    style: {
                                        fontSize: '20px',
                                        color: 'white'
                                    }
                                })}
                            </div>
                            <Text style={{
                                color: themeColors.text,
                                fontWeight: 500,
                                textAlign: 'center'
                            }}>
                                {action.label}
                            </Text>
                        </Button>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// small import fix for Title used above
import { Typography as _Typography } from 'antd';
const { Title } = _Typography;

export default QuickActions;
