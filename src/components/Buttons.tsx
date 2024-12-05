import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

interface ButtonProps {
    children: React.ReactNode;
    to: string;
}

const Buttons = ({ children, to }: ButtonProps) => {
    return (
        <Link
            to={to}
            className="flex items-center justify-center  border-2  border-[#4335A7] bg-white text-[#4335A7] uppercase hover:bg-white hover:text-[#4335A7] transition-all duration-700 px-8 py-3 rounded-2xl font-bold text-xl"
        >
            {children}
            <RightOutlined className="ml-1  text-sm" />
        </Link>
    );
};

export default Buttons;
