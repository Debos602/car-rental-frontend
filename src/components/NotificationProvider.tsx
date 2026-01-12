import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addNotification, selectNotifications } from "@/redux/feature/notification/notificationSlice";
import { useSocket } from "@/hook/useSocket";
import { useAppSelector as useSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/feature/authSlice";
import { message } from "antd";

const NotificationProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const userId = currentUser?.userId;
    const { onMessage } = useSocket(import.meta.env.VITE_SOCKET_SERVER_URL, userId);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        // Listen for server-side notifications
        onMessage("new-notification", (payload: any) => {
            // Normalize payload to expected shape
            const item = {
                _id: payload._id || payload.id || String(Date.now()),
                title: payload.title || payload.type || "Notification",
                message: payload.message || payload.body || "",
                read: !!payload.read,
                createdAt: payload.createdAt || new Date().toISOString(),
                ...payload,
            };

            dispatch(addNotification(item));
            // small toast
            messageApi.open({ type: 'info', content: item.message || item.title });
        });
    }, [onMessage, dispatch, messageApi, userId]);

    return (
        <>
            {contextHolder}
            {children}
        </>
    );
};

export default NotificationProvider;
