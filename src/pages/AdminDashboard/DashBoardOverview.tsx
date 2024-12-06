import { useState } from "react";
import { motion } from "framer-motion";
import OverviewTab from "./OverviewTab";
import TotalBookings from "./TotalBookings";
import AvailableCar from "./AvailableCar";
import TotalRevenue from "./TotalRevenue";
import { Flex, Progress, Slider, Typography } from "antd";

const DashBoardOverview = () => {
    const [activeTab, setActiveTab] = useState("bookings");
    const [stepsCount, setStepsCount] = useState<number>(5);
    const [stepsGap, setStepsGap] = useState<number>(7);

    return (
        <div className="text-center bg-gray-100 min-h-screen">
            {/* Animated Heading */}
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mx-4 rounded-xl bg-gradient-to-r from-[#4335A7] to-[#6A4BAA] text-white py-8 px-4 text-5xl font-semibold uppercase shadow-lg m-0"
            >
                Welcome to Admin Dashboard
            </motion.h1>

            <div className="p-4 container mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Custom Sliders */}
                    <motion.div

                        className="border-2 border-[#4335A7] p-4 rounded-xl bg-gradient-to-br from-[#FFF6E9] to-[#F8EDEB] shadow-md"
                    >
                        <Typography.Title
                            level={5}
                            className="text-[#4335A7] text-lg font-semibold mb-2"
                        >
                            Custom Count:
                        </Typography.Title>
                        <Slider
                            min={2}
                            max={10}
                            value={stepsCount}
                            onChange={setStepsCount}
                            trackStyle={{ backgroundColor: '#4335A7' }}
                            handleStyle={{
                                borderColor: '#4335A7',
                                backgroundColor: '#FFF6E9',
                            }}
                            railStyle={{ backgroundColor: 'rgba(67, 53, 167, 0.2)' }}
                        />
                        <Typography.Title
                            level={5}
                            className="text-[#4335A7] text-lg font-semibold mt-6 mb-2"
                        >
                            Custom Gap:
                        </Typography.Title>
                        <Slider
                            step={4}
                            min={0}
                            max={40}
                            value={stepsGap}
                            onChange={setStepsGap}
                            trackStyle={{ backgroundColor: '#6A4BAA' }}
                            handleStyle={{
                                borderColor: '#6A4BAA',
                                backgroundColor: '#FFF6E9',
                            }}
                            railStyle={{ backgroundColor: 'rgba(106, 75, 170, 0.2)' }}
                        />
                    </motion.div>


                    {/* Animated Progress */}
                    <Flex wrap gap="middle" className="border-2 border-gray-300 p-4 rounded-xl bg-white shadow-md">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Progress
                                type="dashboard"
                                steps={8}
                                percent={50}
                                trailColor="rgba(0, 0, 0, 0.06)"
                                strokeWidth={15}
                                strokeColor="#4335A7"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Progress
                                type="circle"
                                percent={100}
                                steps={{ count: stepsCount, gap: stepsGap }}
                                trailColor="rgba(0, 0, 0, 0.06)"
                                strokeWidth={15}
                                strokeColor="#6A4BAA"
                            />
                        </motion.div>
                    </Flex>
                </motion.div>
            </div>

            {/* Tabs Section */}
            <OverviewTab
                {...{ activeTab, setActiveTab }}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div className="container mx-auto p-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="border border-[#4335A7] rounded-xl shadow-lg"
                >
                    {activeTab === "bookings" && <TotalBookings />}
                    {activeTab === "cars" && <AvailableCar />}
                    {activeTab === "revenue" && <TotalRevenue />}
                </motion.div>
            </div>
        </div>
    );
};

export default DashBoardOverview;
