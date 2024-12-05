import { Button } from "antd";

const Managetabs = [
    {
        name: "Add Car",
        value: "add",
    },
    {
        name: "Update delete car",
        value: "update-and-delete",
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
        <div className="container mx-auto px-4">
            <div className="rounded-xl p-2 w-full flex xs:gap-2 sm:gap-4 mt-4  overflow-x-auto border border-[#4335A7]">
                {Managetabs.map((tab) => (
                    <Button
                        key={tab.value}
                        type="default" // Use a valid type like 'default'
                        className={`text-md ${activeTab === tab.value ? "bg-[#4335A7] text-[#FFF6E9] border border-[#4335A7]" : ""
                            }`} // Add custom classes
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.name}
                    </Button>
                ))}
            </div>
        </div>
    );
}
