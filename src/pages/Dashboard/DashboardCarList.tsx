import { useState, useEffect } from "react";
import { useGetAllCarsQuery } from "@/redux/feature/car/carManagement.api";
import { TCar } from "@/types/global";
import {
    Button,
    Form,
    Input,
    Select,
    Card,
    Row,
    Col,
    Tag,
    Badge,
    Rate,
    InputNumber,
    DatePicker,
    TimePicker,
    Modal,
    message,
    Pagination,
    Spin,
    notification as AntNotification
} from "antd";
import {
    SearchOutlined,
    FilterOutlined,
    CarOutlined,
    UserOutlined,
    EnvironmentOutlined,
    ReloadOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    SafetyOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useCreateBookingMutation } from "@/redux/feature/booking/bookingApi";
import { motion } from "framer-motion";
import { useSocket } from "@/hook/useSocket";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/feature/authSlice";

const { RangePicker } = DatePicker;

// Define the type for the form values
interface IFilterValues {
    searchTerm?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    fuelType?: string;
    dateRange?: [Dayjs | null, Dayjs | null];
}

// Booking form values
interface IBookingValues {
    pickupDate: Dayjs;
    returnDate: Dayjs;
    pickupTime: Dayjs;
    returnTime: Dayjs;
    pickupLocation: string;
    returnLocation: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const DashboardCarList = () => {
    const [queryParams, setQueryParams] = useState<Record<string, any>>({});
    const { data: cars, isLoading, refetch } = useGetAllCarsQuery(queryParams, {
        refetchOnMountOrArgChange: true,
    });

    const { data: allCars } = useGetAllCarsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
    const [form] = Form.useForm();
    const [bookingForm] = Form.useForm();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<TCar | null>(null);
    const [pageSize] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDates, setSelectedDates] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [optimisticBookedIds, setOptimisticBookedIds] = useState<string[]>([]);

    // Socket: auto-join user's room and allow emitting booking events
    const currentUser = useAppSelector(selectCurrentUser);
    const userId = currentUser?.userId;
    const { sendMessage, onMessage, connected } = useSocket(import.meta.env.VITE_SOCKET_SERVER_URL, userId);

    useEffect(() => {
        const handleNewNotification = (data: any) => {
            AntNotification.success({
                message: data.title || 'New Notification',
                description: data.message || 'You have a new update.',
                placement: 'topRight',
                duration: 5,  // Auto-close after 5 seconds
            });
        };

        onMessage('new-notification', handleNewNotification);

        return () => {
            if (socket) {
                socket.off('new-notification', handleNewNotification);
            }
        };
    }, [onMessage]);

    // Initialize query params
    useEffect(() => {
        setQueryParams({ page: 1, limit: pageSize });
    }, [pageSize]);

    // Handle filtering
    const handleFilter = (values: IFilterValues) => {
        const params: Record<string, any> = {
            page: 1,
            limit: pageSize
        };

        if (values.searchTerm) {
            params.searchTerm = values.searchTerm;
        }
        if (values.brand) {
            params.brand = values.brand;
        }
        if (values.minPrice !== undefined) {
            params.minPrice = values.minPrice;
        }
        if (values.maxPrice !== undefined) {
            params.maxPrice = values.maxPrice;
        }
        if (values.fuelType) {
            params.fuelType = values.fuelType;
        }
        if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
            setSelectedDates(values.dateRange);
        }

        setQueryParams(params);
        setCurrentPage(1);
        setIsFilterModalOpen(false);
        message.success('Filters applied successfully');
    };

    // Reset filters
    const handleResetFilters = () => {
        form.resetFields();
        setSelectedDates([null, null]);
        setQueryParams({ page: 1, limit: pageSize });
        setCurrentPage(1);
        message.info('Filters reset');
    };

    // Refresh data
    const handleRefresh = () => {
        refetch();
        setOptimisticBookedIds([]); // Reset optimistic updates on refresh
        message.success('Data refreshed');
    };

    // Calculate available cars count
    const getAvailableCarsCount = () => {
        if (!cars?.data) return 0;

        return cars.data.filter((car: TCar) => {
            // Use optimistic status for display
            const displayStatus = getDisplayStatus(car);
            return displayStatus === 'available';
        }).length;
    };

    const getDisplayStatus = (car: TCar) => {
        if (optimisticBookedIds.includes(car._id)) return 'unavailable';
        return car.status || 'available';
    };

    // Handle book now button click
    const handleBookNow = (car: TCar) => {
        // Check if car is actually available (not just optimistically)
        if (car.status !== 'available') {
            message.error(`Car is currently ${car.status}. Cannot book.`);
            return;
        }

        setSelectedCar(car);
        setIsBookingModalOpen(true);

        // Set default values for booking form
        if (selectedDates[0] && selectedDates[1]) {
            bookingForm.setFieldsValue({
                pickupDate: selectedDates[0],
                returnDate: selectedDates[1],
                pickupTime: selectedDates[0].hour(9).minute(0),
                returnTime: selectedDates[1].hour(17).minute(0),
                pickupLocation: 'Main Office',
                returnLocation: 'Main Office'
            });
        } else {
            // Set default dates (today and tomorrow)
            bookingForm.setFieldsValue({
                pickupDate: dayjs(),
                returnDate: dayjs().add(1, 'day'),
                pickupTime: dayjs().hour(9).minute(0),
                returnTime: dayjs().hour(17).minute(0),
                pickupLocation: 'Main Office',
                returnLocation: 'Main Office'
            });
        }
    };

    // Handle booking submission
    const handleBookingSubmit = async (values: IBookingValues) => {
        if (!selectedCar) return;

        // Build start/end datetimes using selected dates + times
        const start = values.pickupDate.hour(values.pickupTime.hour()).minute(values.pickupTime.minute());
        const end = values.returnDate.hour(values.returnTime.hour()).minute(values.returnTime.minute());

        if (!start || !end || end.isBefore(start) || end.isSame(start)) {
            message.error('Please ensure end time is after start time');
            return;
        }

        const hours = Math.max(1, end.diff(start, 'hour'));
        const totalCost = selectedCar.pricePerHour * hours;

        const bookingData = {
            carId: selectedCar._id,
            date: values.pickupDate.format('YYYY-MM-DD'),
            startTime: start.format('HH:mm'),
            endTime: end.format('HH:mm'),
            extras: [],
            totalCost: totalCost,
        } as const;

        try {
            // Add optimistic update immediately
            setOptimisticBookedIds(prev => [...prev, selectedCar._id]);


            // Create booking
            const result = await createBooking(bookingData).unwrap();

            message.success(`Booking created for ${selectedCar.name}`);

            // Emit a booking-created event (server may use this or ignore)
            try {
                sendMessage('booking-created', { booking: result });
                // console.log('Emitted booking-created event via socket', result);
            } catch (e) {
                // ignore emit errors
            }

            // Force refetch after successful booking
            refetch();

            setIsBookingModalOpen(false);
            bookingForm.resetFields();
        } catch (err) {
            // Remove optimistic update on error
            setOptimisticBookedIds(prev => prev.filter(id => id !== selectedCar._id));

            // console.error('Create booking failed', err);
            message.error('Failed to create booking. Please try again.');
        }
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setQueryParams(prev => ({ ...prev, page }));
    };

    // Calculate total price for display
    const calculateTotalPrice = (pricePerHour: number, days: number = 1) => {
        return pricePerHour * 24 * days;
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'available': return 'green';
            case 'booked': return 'orange';
            case 'unavailable': return 'red';
            case 'maintenance': return 'red';
            default: return 'gray';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    const availableCarsCount = getAvailableCarsCount();
    const totalCarsCount = cars?.data?.length || 0;
    const bookedCarsCount = totalCarsCount - availableCarsCount;

    const stats = [
        { value: totalCarsCount, label: "Total Cars", color: "blue", icon: <CarOutlined /> },
        { value: availableCarsCount, label: "Available Now", color: "green", icon: <CalendarOutlined /> },
        { value: bookedCarsCount, label: "Currently Booked", color: "amber", icon: <ClockCircleOutlined /> },
        { value: Array.from(new Set(cars?.data?.map((car: TCar) => car.brand))).length || 0, label: "Brands", color: "purple", icon: <CarOutlined /> }
    ];

    return (
        <div
            className="user-dashboard-cars-page p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
        >
            {/* Header Section */}
            <div
                className="mb-4"
            >
                <div
                    className="mb-4"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Find Your Perfect <span className="text-[#4234a3]">Car</span>
                    </h1>
                    <p
                        className="text-gray-600 max-w-2xl text-lg"
                    >
                        Book from our wide selection of premium vehicles. Filter by your preferences and book instantly.
                    </p>
                </div>

                {/* Quick Stats */}
                <Row gutter={[16, 16]} className="mb-6">
                    {stats.map((stat, index) => (
                        <Col key={stat.label} xs={24} sm={12} md={6}>
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                                    <div
                                        className="text-3xl font-bold mb-2"
                                        style={{ color: `var(--ant-${stat.color}-6)` }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-gray-600">
                                        <div>
                                            {stat.icon}
                                        </div>
                                        <span className="text-sm">{stat.label}</span>
                                    </div>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Filters Bar */}
            <div
                className="bg-white rounded-xl shadow-md p-4 mb-6 backdrop-blur-sm bg-white/90"
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                        <div>
                            <Input
                                placeholder="Search by car name, model, or brand..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                className="w-full lg:w-96 h-12 rounded-lg"
                                onPressEnter={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    const value = (e.target as HTMLInputElement).value;
                                    if (value) {
                                        handleFilter({ searchTerm: value });
                                    }
                                }}
                                allowClear
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        handleResetFilters();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <div>
                            <Button
                                icon={<FilterOutlined />}
                                onClick={() => setIsFilterModalOpen(true)}
                                className="h-10 rounded-lg"
                                style={{
                                    borderColor: '#4234a3',
                                    color: '#4234a3',
                                    background: 'rgba(66, 52, 163, 0.1)'
                                }}
                            >
                                Filters
                            </Button>
                        </div>
                        <div>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleRefresh}
                                className="h-10 rounded-lg"
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Range Selection */}
            <div
                className="bg-white rounded-xl shadow-md p-4 mb-6 backdrop-blur-sm bg-white/90"
            >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div>
                                <CalendarOutlined className="text-[#4234a3] text-lg" />
                            </div>
                            <span className="font-medium text-gray-900 text-lg">
                                Select Booking Dates
                            </span>
                        </div>
                        <div>
                            <RangePicker
                                value={selectedDates}
                                onChange={(dates: any) => {
                                    if (!dates) {
                                        setSelectedDates([null, null]);
                                    } else {
                                        const start: Dayjs | null = dates[0] ?? null;
                                        const end: Dayjs | null = dates[1] ?? null;
                                        setSelectedDates([start, end]);
                                        if (start && end) {
                                            handleFilter({ dateRange: [start, end] });
                                        }
                                    }
                                }}
                                className="w-full md:w-80 h-10 rounded-lg"
                                format="MMM D, YYYY"
                            />
                        </div>
                    </div>
                    {selectedDates[0] && selectedDates[1] && (
                        <div
                            className="text-sm text-gray-600 bg-[#4234a3]/10 px-3 py-2 rounded-lg"
                        >
                            <ClockCircleOutlined className="mr-2" />
                            {selectedDates[1].diff(selectedDates[0], 'day')} days selected
                        </div>
                    )}
                </div>
            </div>

            {/* Cars Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {cars?.data?.map((car: TCar, index: number) => {
                    const days = selectedDates[0] && selectedDates[1]
                        ? selectedDates[1].diff(selectedDates[0], 'day')
                        : 1;
                    const totalPrice = calculateTotalPrice(car.pricePerHour, days);
                    const displayStatus = getDisplayStatus(car);

                    return (
                        <motion.div
                            key={car._id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div>
                                <Card
                                    className="hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                        borderRadius: '16px'
                                    }}
                                    cover={
                                        <div
                                            className="relative h-48 overflow-hidden"
                                        >
                                            <img
                                                alt={car.name}
                                                src={car.image}
                                                className="w-full h-full object-cover"
                                            />
                                            <div>
                                                <Badge.Ribbon
                                                    text={displayStatus}
                                                    color={getStatusColor(displayStatus)}
                                                    className="text-xs font-semibold"
                                                />
                                            </div>
                                            <div
                                                className="absolute top-2 right-2"
                                            >
                                                <Tag
                                                    className="font-semibold px-3 py-1 rounded-full shadow-lg"
                                                    style={{
                                                        background: 'rgba(66, 52, 163, 0.9)',
                                                        color: 'white',
                                                        border: 'none',
                                                        backdropFilter: 'blur(10px)'
                                                    }}
                                                >
                                                    ${car.pricePerHour}<span className="text-xs ml-1">/hr</span>
                                                </Tag>
                                            </div>
                                            <div
                                                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                                            />
                                        </div>
                                    }
                                >
                                    <div className="space-y-4">
                                        {/* Car Info */}
                                        <div>
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3
                                                        className="text-xl font-bold text-gray-900 mb-1"
                                                    >
                                                        {car.name}
                                                    </h3>

                                                </div>
                                                <div>
                                                    <Rate
                                                        disabled
                                                        defaultValue={car.rating || 4}
                                                        className="text-amber-400"
                                                    />
                                                </div>
                                            </div>
                                            <p
                                                className="text-gray-700 text-sm line-clamp-2"
                                            >
                                                {car.description}
                                            </p>
                                        </div>

                                        {/* Specifications */}
                                        <div
                                            className="grid grid-cols-2 gap-3 text-sm p-3 rounded-lg"
                                            style={{
                                                background: 'rgba(66, 52, 163, 0.05)',
                                                border: '1px solid rgba(66, 52, 163, 0.1)'
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <SafetyOutlined className="text-[#4234a3]" />
                                                </div>
                                                <span className="text-gray-700">{car.fuelType}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <UserOutlined className="text-[#4234a3]" />
                                                </div>
                                                <span className="text-gray-700">{car.seats} seats</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <CarOutlined className="text-[#4234a3]" />
                                                </div>
                                                <span className="text-gray-700">{car.color}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    <EnvironmentOutlined className="text-[#4234a3]" />
                                                </div>
                                                <span className="text-gray-700">{car.category || 'Standard'}</span>
                                            </div>
                                        </div>

                                        {/* Price and Action */}
                                        <div className="pt-4" style={{ borderTop: '1px solid rgba(66, 52, 163, 0.1)' }}>
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        Estimated total for {days} days
                                                    </div>
                                                    <div
                                                        className="text-2xl font-bold"
                                                        style={{ color: '#4234a3' }}
                                                    >
                                                        ${totalPrice.toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500">Per hour</div>
                                                    <div className="text-lg font-semibold text-gray-900">
                                                        ${car.pricePerHour}<span className="text-xs text-gray-600 ml-1">/hr</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div
                                                    className="flex-1"
                                                >
                                                    <Button
                                                        type="primary"
                                                        className="w-full font-semibold h-10 rounded-lg shadow-lg"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #4234a3, #5a4ac9)',
                                                            border: 'none'
                                                        }}
                                                        onClick={() => handleBookNow(car)}
                                                        disabled={displayStatus !== 'available'}
                                                        loading={isBookingLoading && selectedCar?._id === car._id}
                                                    >
                                                        {displayStatus === 'available' ? 'Book Now' : 'Not Available'}
                                                    </Button>
                                                </div>
                                                <div
                                                    className="flex-1"
                                                >
                                                    <Link to={`/car-details/${car._id}`}>
                                                        <Button
                                                            className="w-full font-semibold h-10 rounded-lg"
                                                            style={{
                                                                borderColor: '#4234a3',
                                                                color: '#4234a3',
                                                                background: 'transparent'
                                                            }}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Pagination */}
            {cars?.meta?.total && cars.meta.total > pageSize && (
                <div
                    className="flex justify-center mb-8"
                >
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={cars?.meta?.total || 0}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        showQuickJumper
                        className="[&_.ant-pagination-item-active]:!border-[#4234a3] [&_.ant-pagination-item-active]:!bg-[#4234a3] [&_.ant-pagination-item]:rounded-lg"
                    />
                </div>
            )}

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <Modal
                    title={
                        <div
                            className="flex items-center"
                        >
                            <FilterOutlined className="mr-2 text-[#4234a3]" />
                            <span className="text-lg font-semibold">Filter Cars</span>
                        </div>
                    }
                    open={isFilterModalOpen}
                    onCancel={() => setIsFilterModalOpen(false)}
                    footer={[
                        <div key="reset">
                            <Button onClick={handleResetFilters} className="rounded-lg">
                                Reset
                            </Button>
                        </div>,
                        <div key="cancel">
                            <Button onClick={() => setIsFilterModalOpen(false)} className="rounded-lg">
                                Cancel
                            </Button>
                        </div>,
                        <div key="apply">
                            <Button
                                type="primary"
                                onClick={() => form.submit()}
                                className="rounded-lg"
                                style={{ background: '#4234a3', borderColor: '#4234a3' }}
                            >
                                Apply Filters
                            </Button>
                        </div>,
                    ]}
                    width={500}
                    centered
                    styles={{
                        body: { padding: '24px' },
                        header: { borderBottom: '1px solid rgba(66, 52, 163, 0.1)', padding: '16px 24px' },
                        footer: { borderTop: '1px solid rgba(66, 52, 163, 0.1)', padding: '16px 24px' }
                    }}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFilter}
                        >
                            <div>
                                <div>
                                    <Form.Item label="Brand" name="brand">
                                        <Select
                                            placeholder="Select brand"
                                            allowClear
                                            options={Array.from(
                                                new Set(allCars?.data?.map((car: TCar) => car.brand))
                                            ).map(brand => ({ label: brand, value: brand }))}
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                </div>

                                <div>
                                    <Form.Item label="Fuel Type" name="fuelType">
                                        <Select
                                            placeholder="Select fuel type"
                                            allowClear
                                            options={Array.from(
                                                new Set(allCars?.data?.map((car: TCar) => car.fuelType))
                                            ).map(fuel => ({ label: fuel, value: fuel }))}
                                            className="rounded-lg"
                                        />
                                    </Form.Item>
                                </div>

                                <div>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Min Price ($/hr)" name="minPrice">
                                                <InputNumber
                                                    placeholder="Min"
                                                    min={0}
                                                    className="w-full rounded-lg"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Max Price ($/hr)" name="maxPrice">
                                                <InputNumber
                                                    placeholder="Max"
                                                    min={0}
                                                    className="w-full rounded-lg"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Form>
                    </motion.div>
                </Modal>
            )}

            {/* Booking Modal */}
            {isBookingModalOpen && (
                <Modal
                    title={
                        <div
                            className="flex items-center"
                        >
                            <CarOutlined className="mr-2 text-[#4234a3]" />
                            <span className="text-lg font-semibold">Book {selectedCar?.name}</span>
                        </div>
                    }
                    open={isBookingModalOpen}
                    onCancel={() => {
                        setIsBookingModalOpen(false);
                        bookingForm.resetFields();
                    }}
                    footer={null}
                    width={500}
                    centered
                    styles={{
                        body: { padding: '24px' },
                        header: { borderBottom: '1px solid rgba(66, 52, 163, 0.1)', padding: '16px 24px' }
                    }}
                >
                    {selectedCar && (
                        <motion.div
                            className="pt-4"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Car Summary */}
                            <div
                                className="flex items-center gap-4 mb-6 p-3 rounded-lg"
                                style={{
                                    background: 'rgba(66, 52, 163, 0.05)',
                                    border: '1px solid rgba(66, 52, 163, 0.1)'
                                }}
                            >
                                <img
                                    src={selectedCar.image}
                                    alt={selectedCar.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{selectedCar.name}</h4>
                                    <p className="text-[#4234a3] font-bold">
                                        ${selectedCar.pricePerHour}<span className="text-sm font-normal text-gray-600 ml-1">/hour</span>
                                    </p>
                                </div>
                            </div>

                            {/* Booking Form */}
                            <Form
                                form={bookingForm}
                                layout="vertical"
                                onFinish={handleBookingSubmit}
                            >
                                <div>
                                    <div>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Pickup Date"
                                                    name="pickupDate"
                                                    rules={[{ required: true, message: 'Please select pickup date' }]}
                                                >
                                                    <DatePicker className="w-full rounded-lg" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Return Date"
                                                    name="returnDate"
                                                    rules={[{ required: true, message: 'Please select return date' }]}
                                                >
                                                    <DatePicker className="w-full rounded-lg" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Pickup Time"
                                                    name="pickupTime"
                                                    rules={[{ required: true, message: 'Please select pickup time' }]}
                                                >
                                                    <TimePicker className="w-full rounded-lg" format="HH:mm" minuteStep={15} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="Return Time"
                                                    name="returnTime"
                                                    rules={[{ required: true, message: 'Please select return time' }]}
                                                >
                                                    <TimePicker className="w-full rounded-lg" format="HH:mm" minuteStep={15} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div>
                                        <Form.Item
                                            label="Pickup Location"
                                            name="pickupLocation"
                                            rules={[{ required: true, message: 'Please enter pickup location' }]}
                                        >
                                            <Input placeholder="Enter pickup location" className="rounded-lg" />
                                        </Form.Item>
                                    </div>

                                    <div>
                                        <Form.Item
                                            label="Return Location"
                                            name="returnLocation"
                                            rules={[{ required: true, message: 'Please enter return location' }]}
                                        >
                                            <Input placeholder="Enter return location" className="rounded-lg" />
                                        </Form.Item>
                                    </div>

                                    <div>
                                        {/* Price Summary */}
                                        <div
                                            className="mt-6 p-4 rounded-lg border"
                                            style={{
                                                background: 'rgba(66, 52, 163, 0.05)',
                                                borderColor: 'rgba(66, 52, 163, 0.2)'
                                            }}
                                        >
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-700">Price per day:</span>
                                                <span className="font-semibold text-[#4234a3]">
                                                    ${(selectedCar.pricePerHour * 24).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span>(${selectedCar.pricePerHour} × 24 hours)</span>
                                            </div>
                                            <div className="border-t pt-2 mt-2" style={{ borderColor: 'rgba(66, 52, 163, 0.2)' }}>
                                                <div className="flex justify-between font-bold text-lg">
                                                    <span className="text-gray-900">Estimated Total:</span>
                                                    <span className="text-[#4234a3]">
                                                        ${bookingForm.getFieldValue('pickupDate') && bookingForm.getFieldValue('returnDate')
                                                            ? calculateTotalPrice(
                                                                selectedCar.pricePerHour,
                                                                bookingForm.getFieldValue('returnDate').diff(
                                                                    bookingForm.getFieldValue('pickupDate'),
                                                                    'day'
                                                                )
                                                            ).toFixed(2)
                                                            : '0.00'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mt-6 flex justify-end gap-3">
                                            <div>
                                                <Button onClick={() => setIsBookingModalOpen(false)} className="rounded-lg">
                                                    Cancel
                                                </Button>
                                            </div>
                                            <div>
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={isBookingLoading}
                                                    className="rounded-lg shadow-lg"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #4234a3, #5a4ac9)',
                                                        border: 'none'
                                                    }}
                                                >
                                                    Confirm Booking
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </motion.div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default DashboardCarList;