import { useState } from "react";
import { motion } from "framer-motion";
import { CarOutlined } from "@ant-design/icons";
import UpdatesCar from "./UpdatesCar";
import AddsCar from "./AddsCar";
import ManageTabs from "./ManageTab";

const ManageCar = () => {
    const [activeTab, setActiveTab] = useState("add");

    return (
        <div className="rounded-lg shadow-lg bg-white">
            {/* Header Section */}
            <div className="md:flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-0">
                    <div className="p-2 md:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm">
                        <CarOutlined className="text-lg md:text-xl text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 m-0">
                            Manage Cars
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base mt-1">
                            Add or update vehicle information
                        </p>
                    </div>
                </div>

                {/* Tabs Component - Takes full width on mobile */}
                <div className="w-full md:w-auto">
                    <ManageTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>
            </div>

            {/* Content Section */}

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="min-h-[400px]"
            >
                {activeTab === "add" && <AddsCar />}
                {activeTab === "update-and-delete" && <UpdatesCar />}
            </motion.div>
        </div>
    );
};

export default ManageCar;