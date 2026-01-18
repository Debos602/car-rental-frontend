import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "@/layout/Footer";

const { Content } = Layout;

const Main = () => {
    const theme = localStorage.getItem("theme") || "light";
    return (
        <Layout className={`${theme}`}>
            <Header />
            <Content className="overflow-hidden">
                <Outlet />
            </Content>
            <Footer />
        </Layout>
    );
};

export default Main;
