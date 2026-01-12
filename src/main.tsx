import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.ts";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes.tsx";
import NotificationProvider from "@/components/NotificationProvider";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            {" "}
            <PersistGate loading={null} persistor={persistor}>
                <NotificationProvider>
                    <RouterProvider router={router} />
                </NotificationProvider>
            </PersistGate>
            <Toaster />
        </Provider>
    </React.StrictMode>
);
