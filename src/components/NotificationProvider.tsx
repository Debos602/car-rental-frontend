import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addNotification, selectNotifications } from "@/redux/feature/notification/notificationSlice";
import { useSocket } from "@/hook/useSocket";
import { useAppSelector as useSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/feature/auth/authSlice";
import { message } from "antd";

const NotificationProvider: React.FC<{ children: React.ReactNode; }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const userId = currentUser?.userId;
    const { onMessage, offMessage } = useSocket(import.meta.env.VITE_SOCKET_SERVER_URL, userId);
    const [messageApi, contextHolder] = message.useMessage();
    const [incomingNotif, setIncomingNotif] = useState<{ type: 'info' | 'success' | 'error' | 'warning'; content: string; } | null>(null);

    useEffect(() => {
        // Listen for server-side notifications
        const handleNewNotification = (payload: any) => {
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
            // Only set state here; show toast in effect for Concurrent Mode safety
            setIncomingNotif({ type: 'info', content: item.message || item.title });
        };

        onMessage("new-notification", handleNewNotification);
        return () => {
            offMessage("new-notification", handleNewNotification);
        };
    }, [onMessage, offMessage, dispatch, userId]);

    useEffect(() => {
        if (!incomingNotif) return;
        messageApi.open({ type: incomingNotif.type, content: incomingNotif.content });
        setIncomingNotif(null);
    }, [incomingNotif, messageApi]);

    return (
        <>
            {contextHolder}
            {children}
        </>
    );
};

export default NotificationProvider;
