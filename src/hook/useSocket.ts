// src/hooks/useSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

type UseSocketReturn = {
    connected: boolean;
    joinRoom: (room: string) => void;
    sendMessage: (event: string, data: any) => void;
    onMessage: (event: string, callback: (data: any) => void) => void;
    offMessage: (event: string, callback: (data: any) => void) => void;
};

/**
 * useSocket hook
 * - serverUrl: Socket.IO server URL (can be empty to use current origin)
 * - userId: optional user id to auto-join the user's room after connect
 */
export const useSocket = (serverUrl: string, userId?: string): UseSocketReturn => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // only create one shared socket instance per app
        if (!socket) {
            socket = io(serverUrl || undefined, {
                withCredentials: true,
                transports: ["websocket", "polling"],
                // reconnection options - tweak as needed
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
            });

            socket.on("connect", () => {
                console.log("Connected to server with id:", socket?.id);
                setConnected(true);
                // if userId is available, join their private room
                if (userId) {
                    socket?.emit("join", userId);
                    console.log("Auto-joining room:", userId);
                }
            });

            socket.on("disconnect", (reason) => {
                console.log("Disconnected from server", reason);
                setConnected(false);
            });

            socket.on("connect_error", (err) => {
                console.error("Socket connect_error:", err);
            });
        } else {
            // If socket already exists but userId just became available, join now
            if (socket.connected && userId) {
                socket.emit("join", userId);
            }
        }

        // cleanup on unmount - remove listeners and disconnect if appropriate
        return () => {
            if (socket) {
                socket.removeAllListeners();
                try {
                    socket.disconnect();
                } catch (e) {
                    // ignore
                }
                socket = null;
            }
            setConnected(false);
        };
    }, [serverUrl, userId]);

    const joinRoom = (room: string) => {
        socket?.emit("join", room);
        console.log("Joining room:", room);
    };

    const sendMessage = (event: string, data: any) => {
        socket?.emit(event, data);
    };

    const onMessage = (event: string, callback: (data: any) => void) => {
        socket?.on(event, callback);
    };

    const offMessage = (event: string, callback: (data: any) => void) => {
        socket?.off(event, callback);
    };

    return { connected, joinRoom, sendMessage, onMessage, offMessage };
};