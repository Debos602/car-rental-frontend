
import { baseApi } from "../../api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // 🔹 Get all notifications
        getNotifications: builder.query({
            query: (params) => ({
                url: "/api/notifications",
                method: "GET",
                params,
            }),
            providesTags: ["Booking", "Notification"],
        }),

        getAllNotifications: builder.query({
            query: () => ({
                url: "/api/notifications/admin",
                method: "GET",
            }),
            providesTags: ["Booking", "Notification"],
        }),


        // 🔹 Mark notification as read (example)
        markAsRead: builder.mutation<void, void>({
            query: () => ({
                url: `/api/notifications/mark-read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),
        // Add this mutation to your notification API
        markAsUnread: builder.mutation({
            query: (notificationId: string) => ({
                url: `/api/notifications/mark-unread/${notificationId}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notification'],
        }),

        deleteNotification: builder.mutation<void, { id: string; }>({
            query: ({ id }) => ({
                url: `/api/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification", "Booking"],
        }),

    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useDeleteNotificationMutation,
    useMarkAsUnreadMutation,
    useGetAllNotificationsQuery
} = notificationApi;
