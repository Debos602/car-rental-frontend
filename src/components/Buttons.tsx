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
            className="flex items-center border uppercase rounded-xl border-[#4335A7] text-[#4335A7] bg-white hover:bg-[#4335A7] hover:text-[#FFF6E9] transition duration-300 px-6 py-3  font-bold"
        >
            {children}
            <RightOutlined className="ml-1 text-sm" />
        </Link>
    );
};

export default Buttons;
