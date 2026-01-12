import { useSocket } from "@/hook/useSocket";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/feature/authSlice";

const SocketTest = () => {
    const user = useAppSelector(selectCurrentUser);
    console.log('Current User in SocketTest:', user);
    const userId = user?.userId;

    const { connected, joinRoom, onMessage } = useSocket(import.meta.env.VITE_SOCKET_SERVER_URL, userId);

    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        // listening for server notification events
        onMessage("new-notification", (payload) => {
            console.log("Received notification:", payload);
            setNotifications((s) => [payload, ...s]);
        });
    }, [onMessage]);

    return (
        <div>
            <h1>Socket.IO Test</h1>
            <p>Status: {connected ? "Connected" : "Disconnected"}</p>
            <p>User ID: {userId || "(no user)"}</p>
            <button onClick={() => joinRoom("room1")}>Join Room 1</button>

            <div style={{ marginTop: 12 }}>
                <h2>Notifications</h2>
                {notifications.length === 0 ? (
                    <p>No notifications yet</p>
                ) : (
                    <ul>
                        {notifications.map((n, i) => (
                            <li key={i}>{typeof n === 'string' ? n : JSON.stringify(n)}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SocketTest;
