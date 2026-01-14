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

    console.log("All cars data:", allCars);

    console.log("Cars data:", cars);
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
                                            className="h-full bg-gradient-to-b from-white to-amber-50 shadow-lg group rounded-lg overflow-hidden transform transition-all duration-200 hover:shadow-xl border border-gray-100"
                                            cover={
                                                <div className="relative overflow-hidden h-36 sm:h-40">
                                                    <img
                                                        alt={car.name}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition duration-400"
                                                        src={car.image}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                                    <div className="absolute top-2 right-2">
                                                        <div className="bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                                                            {car.seats} Seats
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            styles={{ body: { padding: '12px' } }}
                                        >
                                            <div className="h-full flex flex-col">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-chocolate transition-colors truncate">
                                                            {car.name}
                                                        </h3>
                                                        <p className="text-gray-500 text-xs mt-0.5 truncate">
                                                            {car.brand} • {car.model}
                                                        </p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chocolate to-amber-900 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ml-2">
                                                        {car.year}
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-grow-0">
                                                    {(car.description || '').slice(0, 80)}...
                                                </p>

                                                <div className="space-y-2 mt-auto">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs line-through text-gray-400 mb-0.5">
                                                                ${getRandomPreviousPrice(car.pricePerHour)}
                                                            </p>
                                                            <p className="text-lg font-bold text-chocolate">
                                                                ${car.pricePerHour}<span className="text-xs font-medium text-gray-600">/hr</span>
                                                            </p>
                                                        </div>
                                                        <Rate
                                                            disabled
                                                            defaultValue={Number(car.rating) || 4}
                                                            className="text-amber-400 [&_.ant-rate-star]:mr-0.5 text-xs"
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex items-center">
                                                                <div
                                                                    className="w-3 h-3 rounded-full border border-gray-300 mr-1"
                                                                    style={{ backgroundColor: car.color }}
                                                                ></div>
                                                                <span className="text-gray-600 text-xs">{car.color}</span>
                                                            </div>
                                                            <span className="text-gray-600 text-xs">•</span>
                                                            <span className="text-gray-600 text-xs">{car.fuelType}</span>
                                                        </div>
                                                        <Link
                                                            to={`/car-details/${car._id}`}
                                                            className="bg-gradient-to-r from-chocolate to-amber-800 hover:from-amber-800 hover:to-chocolate text-white px-6 py-3 rounded-md font-semibold transition-all duration-200 transform hover:scale-105 shadow hover:shadow-md text-xs"
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