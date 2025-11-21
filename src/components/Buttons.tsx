import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface ButtonProps {
    children: React.ReactNode;
    to: string;
    className?: string;
}

const Buttons = ({ children, to, className }: ButtonProps) => {
    const baseClasses =
        "flex items-center border uppercase rounded-xl border-[#D2691E] bg-[#D2691E] text-white hover:bg-[#a8581a] transition duration-300 px-6 py-3 font-bold";

    return (
        <Link to={to} className={`${baseClasses} ${className ?? ""}`.trim()}>
            {children}
            <RightOutlined className="ml-1 text-sm" />
        </Link>
    );
};

export default Buttons;
