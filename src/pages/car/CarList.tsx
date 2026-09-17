import { useState, useEffect } from "react";
import { useGetAllCarsQuery } from "@/redux/feature/car/carManagement.api";
import { TCar } from "@/types/global";
import { Select, Button, Form, Input, Card, Rate, Badge, Pagination } from "antd";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SearchOutlined, FilterOutlined, CloseOutlined } from "@ant-design/icons";

// Define the type for the form values
interface IFilterValues {
    searchTerm?: string;
    carName?: string;
    color?: string;
}

const CarList = () => {
    const [queryParams, setQueryParams] = useState<Record<string, any>>({});
    const { data: cars, isLoading } = useGetAllCarsQuery(queryParams, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });
    const { data: allCars } = useGetAllCarsQuery({ limit: 100 }, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
    });

    // console.log("All cars data:", allCars);

    // console.log("Cars data:", cars);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const [form] = Form.useForm();
    const PAGE_SIZE = 6;
    const [page, setPage] = useState(1);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    useEffect(() => {
        const initialParams: Record<string, any> = {};
        setQueryParams({ ...initialParams, page: 1, limit: PAGE_SIZE });
        setPage(1);
    }, []);

    // Handle filtering logic
    const handleFilter = (values: IFilterValues) => {
        const params: Record<string, any> = {};

        if (values.searchTerm) {
            params.searchTerm = values.searchTerm;
        }

        if (values.carName) {
            params.name = values.carName;
        }

        if (values.color) {
            params.color = values.color;
        }

        setQueryParams({ ...params, page: 1, limit: PAGE_SIZE });
        setPage(1);
        setIsMobileFilterOpen(false);
    };

    // Reset filters and show all cars
    const handleClearFilters = () => {
        form.resetFields();
        setQueryParams({ page: 1, limit: PAGE_SIZE });
        setPage(1);
        setIsMobileFilterOpen(false);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        setQueryParams((prev) => ({ ...prev, page: newPage }));
    };

    const getRandomPreviousPrice = (currentPrice: number) => {
        return (currentPrice + Math.floor(Math.random() * 100 + 50));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-3 border-chocolate border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-chocolate font-semibold text-sm">Loading cars...</p>
                </div>
            </div>
        );
    }

    return (
        <div data-theme="light" className="bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen" ref={ref}>
            <div className="container mx-auto px-3 py-10 sm:px-4 sm:py-12">
                {/* Header Section - Compact */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Discover Your Perfect <span className="text-chocolate">Ride</span>
                    </h1>
                    <p className="text-gray-600 max-w-xl mx-auto text-sm">
                        Explore our premium collection of vehicles tailored to your needs.
                    </p>
                </motion.div>

                {/* Mobile Filter Toggle */}
                <div className="md:hidden mb-4">
                    <Button
                        type="primary"
                        icon={<FilterOutlined />}
                        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                        className="w-full bg-chocolate hover:bg-chocolate-dark border-chocolate hover:border-chocolate-dark h-10 text-base"
                    >
                        {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Filters Section - Compact */}
                    <div className={`md:block ${isMobileFilterOpen ? 'block' : 'hidden'}`}>
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 sticky top-4"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">
                                    <FilterOutlined className="mr-1" />
                                    Filters
                                </h2>
                                <CloseOutlined
                                    className="md:hidden text-gray-500 hover:text-gray-900 cursor-pointer text-sm"
                                    onClick={() => setIsMobileFilterOpen(false)}
                                />
                            </div>

                            <Form
                                form={form}
                                onFinish={handleFilter}
                                layout="vertical"
                                className="space-y-4"
                            >
                                {/* Search Filter */}
                                <Form.Item
                                    name="searchTerm"
                                    label={<span className="text-gray-900 font-semibold text-sm">Search Car</span>}
                                    className="mb-2"
                                >
                                    <Input
                                        placeholder="Search by car name, model..."
                                        prefix={<SearchOutlined className="text-gray-400" />}
                                        className="h-10 border-2 border-gray-900 hover:border-chocolate focus:border-chocolate rounded-lg text-gray-900 placeholder-gray-500 text-sm"
                                    />
                                </Form.Item>

                                {/* Car Name Filter */}
                                <Form.Item
                                    name="carName"
                                    label={<span className="text-gray-900 font-semibold text-sm">Car Name</span>}
                                    className="mb-2"
                                >
                                    <Select
                                        placeholder="Select car name"
                                        allowClear
                                        className="w-full border-2 border-gray-900 hover:border-chocolate rounded-lg [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!h-10 [&_.ant-select-selection-placeholder]:text-gray-500 text-sm"
                                        dropdownStyle={{
                                            border: '2px solid #27272a',
                                            borderRadius: '8px',
                                            padding: '6px'
                                        }}
                                        popupClassName="custom-select-dropdown"
                                    >
                                        {allCars?.data.map((car: TCar) => (
                                            <Select.Option
                                                key={car._id}
                                                value={car.name}
                                                className="hover:bg-amber-50 py-2 px-3 rounded-md transition-colors text-sm"
                                            >
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-chocolate mr-2"></div>
                                                    <span className="text-gray-900">{car.name}</span>
                                                </div>
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                {/* Color Filter */}
                                <Form.Item
                                    name="color"
                                    label={<span className="text-gray-900 font-semibold text-sm">Color</span>}
                                    className="mb-2"
                                >
                                    <Select
                                        placeholder="Select color"
                                        allowClear
                                        className="w-full border-2 border-gray-900 hover:border-chocolate rounded-lg [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!h-10 [&_.ant-select-selection-placeholder]:text-gray-500 text-sm"
                                        dropdownStyle={{
                                            border: '2px solid #27272a',
                                            borderRadius: '8px',
                                            padding: '6px'
                                        }}
                                    >
                                        {Array.from(
                                            new Set(allCars?.data.map((car: TCar) => car.color))
                                        ).map((color) => (
                                            <Select.Option
                                                key={String(color)}
                                                value={color}
                                                className="hover:bg-amber-50 py-2 px-3 rounded-md transition-colors text-sm"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-900">{String(color)}</span>
                                                    <div
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: String(color).toLowerCase() }}
                                                    ></div>
                                                </div>
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <div className="flex flex-col space-y-3 pt-2">
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        className="h-9 bg-gradient-to-r from-chocolate to-amber-800 hover:from-amber-800 hover:to-chocolate border-0 text-white font-semibold text-sm rounded-lg shadow hover:shadow-md transition-all duration-300"
                                    >
                                        Apply Filters
                                    </Button>
                                    <Button
                                        onClick={handleClearFilters}
                                        className="h-9 bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold text-sm rounded-lg transition-all duration-300"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </Form>
                        </motion.div>
                    </div>

                    {/* Cards Section */}
                    <div className="col-span-4">
                        {/* Results Info - Compact */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="mb-6"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow border border-gray-200">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {cars?.data?.length || 0} Cars Available
                                    </h3>
                                    <p className="text-gray-600 text-xs mt-1">
                                        {queryParams.searchTerm
                                            ? `Results for "${queryParams.searchTerm}"`
                                            : queryParams.color || queryParams.carName
                                                ? "Filtered results"
                                                : "All premium cars"}
                                    </p>
                                </div>
                                <div className="mt-2 md:mt-0">
                                    <Badge
                                        count={cars?.meta?.total || 0}
                                        style={{ backgroundColor: '#7c2d12' }}
                                        className="shadow text-xs"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Cars Grid - More Compact */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {cars?.data?.map((car: TCar, index: number) => (
                                <motion.div
                                    key={car._id}
                                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                    animate={
                                        inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }
                                    }
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.08,
                                        type: "spring",
                                        stiffness: 120
                                    }}
                                    whileHover={{
                                        y: -4,
                                        transition: { duration: 0.2 }
                                    }}
                                    className="h-full"
                                >
                                    <Badge.Ribbon
                                        text={car.status}
                                        color="#7c2d12"
                                        className="text-xs"
                                        style={{ fontSize: '10px', padding: '0 8px', height: '20px', lineHeight: '20px' }}
                                    >
                                        <Card
                                            className="h-full bg-gradient-to-b from-white via-amber-50 to-orange-50 shadow-[0_12px_28px_rgba(67,28,16,0.12)] group rounded-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(67,28,16,0.18)] border border-orange-100"
                                            cover={
                                                <div className="relative overflow-hidden h-44 sm:h-48">
                                                    <img
                                                        alt={car.name}
                                                        className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                                                        src={car.image}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"></div>

                                                    <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-white/85 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                                                        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-600">{car.year}</span>
                                                    </div>

                                                    <div className="absolute right-3 top-3">
                                                        <div className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                                            {car.seats} Seats
                                                        </div>
                                                    </div>

                                                    <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 shadow-sm">
                                                        <span className="text-[10px] font-semibold text-gray-700">{car.fuelType}</span>
                                                    </div>
                                                </div>
                                            }
                                            styles={{ body: { padding: '14px 14px 12px' } }}
                                        >
                                            <div className="h-full flex flex-col">
                                                <div className="mb-3 flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate text-base font-bold text-gray-900 transition-colors group-hover:text-chocolate">
                                                            {car.name}
                                                        </h3>
                                                        <p className="mt-1 truncate text-[11px] text-gray-500">
                                                            {car.brand} • {car.model}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">
                                                        <span>★</span>
                                                        <span>{Number(car.rating) || 4.8}</span>
                                                    </div>
                                                </div>

                                                <p className="mb-3 flex-grow text-[12px] leading-5 text-gray-600">
                                                    {(car.description || '').slice(0, 86)}{(car.description || '').length > 86 ? '...' : ''}
                                                </p>

                                                <div className="mt-auto space-y-3">
                                                    <div className="flex items-end justify-between gap-3">
                                                        <div>
                                                            <p className="mb-1 text-[10px] font-medium text-gray-400 line-through">
                                                                ${getRandomPreviousPrice(car.pricePerHour)}
                                                            </p>
                                                            <p className="text-2xl font-black leading-none text-chocolate">
                                                                ${car.pricePerHour}
                                                                <span className="ml-1 text-[11px] font-semibold text-gray-600">/hr</span>
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-1">
                                                            <div
                                                                className="h-3 w-3 rounded-full border border-gray-300"
                                                                style={{ backgroundColor: car.color }}
                                                            ></div>
                                                            <span className="text-[10px] font-medium text-gray-700">{car.color}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between border-t border-orange-100 pt-3">
                                                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                                            <span className="rounded-full bg-stone-100 px-2 py-1">{car.seats} seats</span>
                                                            <span className="rounded-full bg-stone-100 px-2 py-1">{car.transmission || 'Auto'}</span>
                                                        </div>

                                                        <Link
                                                            to={`/car-details/${car._id}`}
                                                            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-chocolate to-amber-800 px-4 py-2 text-[11px] font-bold text-white shadow-md shadow-orange-200 transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg hover:shadow-orange-200"
                                                        >
                                                            Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Badge.Ribbon>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination - Compact */}
                        {cars?.meta?.total && cars.meta.total > PAGE_SIZE && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8"
                            >
                                <Pagination
                                    current={page}
                                    pageSize={PAGE_SIZE}
                                    total={cars?.meta?.total || 0}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showQuickJumper={false}
                                    showLessItems
                                    itemRender={(current, type, originalElement) => {
                                        if (type === 'page') {
                                            return (
                                                <button
                                                    key={`page-${current}`}
                                                    className={`mx-0.5 w-8 h-8 rounded-full ${current === page
                                                        ? 'bg-chocolate text-white'
                                                        : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300'
                                                        } font-semibold transition-colors text-sm`}
                                                >
                                                    {current}
                                                </button>
                                            );
                                        }
                                        if (type === 'prev') {
                                            return (
                                                <button
                                                    key="prev"
                                                    className="mx-0.5 w-8 h-8 rounded-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 font-semibold transition-colors text-sm"
                                                >
                                                    ‹
                                                </button>
                                            );
                                        }
                                        if (type === 'next') {
                                            return (
                                                <button
                                                    key="next"
                                                    className="mx-0.5 w-8 h-8 rounded-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300 font-semibold transition-colors text-sm"
                                                >
                                                    ›
                                                </button>
                                            );
                                        }
                                        return originalElement;
                                    }}
                                    className="[&_.ant-pagination-item-active]:!border-chocolate [&_.ant-pagination-item-active]:!bg-chocolate text-center text-sm"
                                />
                                <div className="text-center mt-2 text-gray-600 text-xs">
                                    Page {page} of {Math.ceil((cars?.meta?.total || 0) / PAGE_SIZE)} • {cars?.meta?.total || 0} cars total
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarList;