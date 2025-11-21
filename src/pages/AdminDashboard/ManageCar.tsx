import { useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import UpdatesCar from "./UpdatesCar";
import AddsCar from "./AddsCar";
import ManageTabs from "./ManageTab";

const ManageCar = () => {
    const [activeTab, setActiveTab] = useState("add");

    return (
        <div>
            {/* Use motion.h1 instead of h1 for animations */}
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mx-4 rounded-xl bg-[#4335A7] bg-opacity-70 text-[#FFF6E9] text-center py-5 px-4 text-xl font-semibold uppercase  m-0"
            >
                Manage Car
            </motion.h1>
            <ManageTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-4 container mx-auto px-4">
                {/* Animated Tab Content with framer-motion */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }} // Transition duration

                >
                    {activeTab === "add" && <AddsCar />}
                    {activeTab === "update-and-delete" && <UpdatesCar />}
                </motion.div>
            </div>
        </div>
    );
};

export default ManageCar;
