import { Layout } from "antd";

import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "@/pages/Home/Footer";

const { Content } = Layout;

const Main = () => {
    const theme = localStorage.getItem("theme") || "light";
    return (
        <Layout className={`${theme} overerflow-x-hidden`}>
            <Header />
            <Content

            >
                <Outlet />
            </Content>
            <Footer />
        </Layout>
    );
};

export default Main;
