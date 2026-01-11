import { Typography } from 'antd';

export const themeColors = {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#1d4ed8',
    secondary: '#8b5cf6',
    secondaryLight: '#a78bfa',
    success: '#10b981',
    successLight: '#34d399',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    danger: '#ef4444',
    dangerLight: '#f87171',
    dark: '#1f2937',
    light: '#f9fafb',
    card: '#ffffff',
    border: '#e5e7eb',
    text: '#374151',
    lightText: '#6b7280',
    background: '#f3f4f6',
    chart1: '#6366f1',
    chart2: '#10b981',
    chart3: '#f59e0b',
    chart4: '#8b5cf6',
};

export const formatCurrency = (value: any): string => {
    const num = parseFloat(String(value || 0));
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
};

export const formatDate = (dateString: any): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    } catch {
        return 'N/A';
    }
};

export const formatTime = (timeString: any): string => {
    if (!timeString) return 'N/A';
    try {
        if (typeof timeString === 'string' && /^\d{1,2}:\d{2}$/.test(timeString)) {
            return timeString;
        }
        const date = new Date(timeString);
        if (!isNaN(date.getTime())) {
            return new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).format(date);
        }
        return String(timeString);
    } catch {
        return 'N/A';
    }
};

export const calculateDuration = (start: string, end: string): string => {
    try {
        const startTime = new Date(`2000-01-01T${start}`);
        const endTime = new Date(`2000-01-01T${end}`);
        const durationMs = endTime.getTime() - startTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        return `${durationHours.toFixed(1)}h`;
    } catch {
        return 'N/A';
    }
};

export interface ProcessedBooking {
    id: string;
    carName: string;
    carImage?: string;
    date: string;
    startTime: string;
    endTime: string;
    totalCost: number;
    transactionId: string;
    paymentStatus: string;
    duration: string;
}

export const { Title, Text } = Typography;
