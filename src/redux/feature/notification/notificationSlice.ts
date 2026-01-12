import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationItem {
    _id: string;
    title: string;
    message: string;
    read?: boolean;
    createdAt?: string;
    [key: string]: any;
}

type NotificationState = {
    items: NotificationItem[];
};

const initialState: NotificationState = {
    items: [],
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications(state, action: PayloadAction<NotificationItem[]>) {
            state.items = action.payload;
        },
        addNotification(state, action: PayloadAction<NotificationItem>) {
            state.items.unshift(action.payload);
        },
        markRead(state, action: PayloadAction<string>) {
            const id = action.payload;
            const item = state.items.find(i => i._id === id);
            if (item) item.read = true;
        },
        markAllRead(state) {
            state.items = state.items.map(i => ({ ...i, read: true }));
        },
        removeNotification(state, action: PayloadAction<string>) {
            state.items = state.items.filter(i => i._id !== action.payload);
        }
    }
});

export const { setNotifications, addNotification, markRead, markAllRead, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

export const selectNotifications = (state: any) => state.notifications.items as NotificationItem[];
export const selectUnreadCount = (state: any): number =>
    state.notifications.items.filter((i: NotificationItem) => !i.read).length;
