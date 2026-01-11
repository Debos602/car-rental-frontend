import { useState } from "react";
import { motion } from "framer-motion";
import { CarOutlined } from "@ant-design/icons";
import UpdatesCar from "./UpdatesCar";
import AddsCar from "./AddsCar";
import ManageTabs from "./ManageTab";

const ManageCar = () => {
    const [activeTab, setActiveTab] = useState("add");

    return (
        <div className="rounded-md shadow-md">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center justify-center gap-4 p-6">
                    <CarOutlined className="text-lg text-[#4335A7]" />
                    <h1 className="text-xl font-bold text-gray-800 m-0">
                        Manage Cars
                    </h1>
                </div>
                <ManageTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
            >
                {activeTab === "add" && <AddsCar />}
                {activeTab === "update-and-delete" && <UpdatesCar />}
            </motion.div>
        </div>
    );
};

export default ManageCar;