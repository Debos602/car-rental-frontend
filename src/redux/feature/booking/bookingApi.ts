import { baseApi } from "@/redux/api/baseApi";

const bookingApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createBooking: build.mutation({
            query: (data) => ({
                url: "/api/bookings",
                method: "POST",
                body: data,
            }),
            // Invalidate notifications so the UI refetches new notifications immediately
            invalidatesTags: ["Car", "Booking", "Notification"],
        }), // Create a new booking record

        getBookings: build.query({
            query: () => ({ url: "/api/bookings/my-bookings", method: "GET" }),
        }), // Get all booking records
        getAllBookings: build.query({
            query: () => ({ url: "/api/bookings", method: "GET" }),
        }),

        updateBooking: build.mutation({
            query: (data) => ({
                url: `/api/bookings/${data._id}`, // Ensure data._id exists
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Booking"], // Invalidate cache if needed
        }),

        deleteBooking: build.mutation({
            query: (id) => ({
                url: `/api/bookings/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Booking", "Notification"], // Invalidate notifications on booking deletion
        }),
    }),
});
export const {
    useCreateBookingMutation,
    useGetBookingsQuery,
    useDeleteBookingMutation,
    useGetAllBookingsQuery,
    useUpdateBookingMutation,
} = bookingApi;
