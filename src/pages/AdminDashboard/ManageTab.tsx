import { Button } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

// Rename the tabs array to avoid naming conflict
const tabsData = [
    {
        name: "Add Car",
        value: "add",
        icon: <PlusOutlined />,
    },
    {
        name: "Update & Delete",
        value: "update-and-delete",
        icon: <EditOutlined />,
    },
];

interface ProfileTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function ManageTabs({
    activeTab,
    setActiveTab,
}: ProfileTabsProps) {
    return (
        <div className="w-full md:w-auto">
            <div className="rounded-xl p-1.5 md:p-2 w-full flex gap-1 md:gap-2 lg:gap-3 bg-gray-50 border border-gray-200 shadow-sm">
                {tabsData.map((tab) => (
                    <Button
                        key={tab.value}
                        type="default"
                        className={`
                            relative
                            flex-1
                            md:flex-none
                            min-w-0
                            px-3 md:px-6 
                            py-2.5 md:py-3 
                            text-sm md:text-base
                            font-medium
                            transition-all
                            duration-300
                            ease-in-out
                            border-none
                            shadow-none
                            hover:shadow-sm
                            overflow-hidden
                            whitespace-nowrap
                            ${activeTab === tab.value
                                ? "text-white bg-gradient-to-r from-[#4335A7] to-[#6C63FF] shadow-md"
                                : "text-gray-700 bg-white hover:bg-gray-100"
                            }
                        `}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        <span className="mr-1.5 md:mr-2 text-sm">
                            {tab.icon}
                        </span>

                        <span className="hidden xs:inline">
                            {tab.name}
                        </span>

                        <span className="xs:hidden">
                            {tab.value === "add" ? "Add" : "Edit"}
                        </span>

                        {activeTab === tab.value && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-white bg-opacity-70 rounded-full" />
                        )}
                    </Button>
                ))}
            </div>

            <div className="mt-2 md:hidden text-center">
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    {activeTab === "add" ? "Add New Car" : "Update & Delete Cars"}
                </span>
            </div>
        </div>
    );
}