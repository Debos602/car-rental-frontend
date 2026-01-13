import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let socketRefCount = 0;

export const useSocket = (serverUrl: string, userId?: string) => {
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Initialize socket once
    useEffect(() => {
        if (!socket) {
            socket = io(serverUrl || undefined, {
                withCredentials: true,
                transports: ["websocket", "polling"],
                reconnection: true,
                reconnectionAttempts: 30,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 10000,
                timeout: 30000,
                autoConnect: true,
                forceNew: false,
            });
            socketRef.current = socket;
            socketRefCount = 1;
        } else {
            socketRef.current = socket;
            socketRefCount++;
        }

        const curSocket = socketRef.current;

        // Connect / disconnect handlers
        const onConnect = () => {
            console.log("Socket connected:", curSocket?.id);
            setConnected(true);
        };
        const onDisconnect = (reason: string) => {
            console.log("Socket disconnected:", reason);
            setConnected(false);
        };

        curSocket?.on("connect", onConnect);
        curSocket?.on("disconnect", onDisconnect);

        // Already connected?
        if (curSocket?.connected) setConnected(true);

        return () => {
            curSocket?.off("connect", onConnect);
            curSocket?.off("disconnect", onDisconnect);

            socketRefCount--;
            if (socketRefCount <= 0 && socket) {
                console.log("No more users, cleaning up socket");
                socket.disconnect();
                socket = null;
                socketRefCount = 0;
            }
        };
    }, [serverUrl]);

    // Join user room safely
    useEffect(() => {
        const cur = socketRef.current;
        if (!cur || !userId) return;

        const joinRoom = () => {
            cur.emit("join", userId);
            console.log("Joined room:", userId);
        };

        if (cur.connected) {
            joinRoom();
        } else {
            cur.once("connect", joinRoom);
            return () => {
                cur.off("connect", joinRoom);
            };
        }
    }, [userId]);

    // Safe listener functions
    const onMessage = useCallback((event: string, callback: (data: any) => void) => {
        socketRef.current?.on(event, callback);
    }, []);

    const offMessage = useCallback((event: string, callback: (data: any) => void) => {
        socketRef.current?.off(event, callback);
    }, []);

    const joinRoom = useCallback((room: string) => {
        socketRef.current?.emit("join", room);
    }, []);

    const sendMessage = useCallback((event: string, data: any) => {
        socketRef.current?.emit(event, data);
    }, []);

    return { connected, joinRoom, sendMessage, onMessage, offMessage };
};
