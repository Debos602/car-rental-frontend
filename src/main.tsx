import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.ts";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes.tsx";
import { PersistGate } from "redux-persist/integration/react";
import { ConfigProvider } from "antd";
import antdTheme from "./theme/antdTheme";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ConfigProvider theme={antdTheme}>
                    <RouterProvider router={router} />
                </ConfigProvider>
            </PersistGate>
            <Toaster />
        </Provider>
    </React.StrictMode>
);
