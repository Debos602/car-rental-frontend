
import { baseApi } from "../../api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // 🔹 Get all notifications
        getNotifications: builder.query({
            query: (params) => ({
                url: "/notifications",
                method: "GET",
                params,
            }),
            providesTags: ["Booking", "Notification"],
        }),

        getAllNotifications: builder.query({
            query: () => ({
                url: "/notifications/admin",
                method: "GET",
            }),
            providesTags: ["Booking", "Notification"],
        }),


        // 🔹 Mark all notifications as read
        // Return type is `any` because some backends return a payload like { success: false, message }
        markAsRead: builder.mutation<any, void>({
            query: () => ({
                url: `/notifications/mark-read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),

        // 🔹 Mark a single notification as read
        markAsReadSingle: builder.mutation<void, string>({
            query: (notificationId: string) => ({
                url: `/notifications/mark-read/${notificationId}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notification'],
        }),
        // Add this mutation to your notification API
        markAsUnread: builder.mutation({
            query: (notificationId: string) => ({
                url: `/notifications/mark-unread/${notificationId}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notification'],
        }),

        deleteNotification: builder.mutation<void, { id: string; }>({
            query: ({ id }) => ({
                url: `/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification", "Booking"],
        }),
        deleteNotificationAdmin: builder.mutation<void, { id: string; }>({
            query: ({ id }) => ({
                url: `/notifications/admin/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification", "Booking"],
        }),

    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAsReadSingleMutation,
    useDeleteNotificationMutation,
    useMarkAsUnreadMutation,
    useGetAllNotificationsQuery,
    useDeleteNotificationAdminMutation
} = notificationApi;
