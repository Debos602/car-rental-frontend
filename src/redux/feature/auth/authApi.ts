import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/signin",
                method: "POST",
                body: userInfo,
            }),
        }),
        signup: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/signup",
                method: "POST",
                body: userInfo,
            }),
        }),
        getAllUsers: builder.query({
            query: () => ({
                url: "/auth/all-users",
                method: "GET",
            }),
        }),

        getAdmin: builder.query({
            query: (data) => ({
                url: "/auth/admin",
                method: "GET",
                body: data,
            }),
            providesTags: ["Admin"],
        }),
        getUser: builder.query({
            query: (userInfo) => ({
                url: "/auth/user",
                method: "GET",
                body: userInfo,
            }),
            providesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: "/auth/update-user",
                method: "PUT",
                body: data,
            }),
            // Ensure user data is refreshed after a successful update
            invalidatesTags: ["User"],
        }),
        updateUserRole: builder.mutation({
            query: (user) => ({
                url: `/auth/update-role/${user.userId}`,
                method: "PUT",
                body: user,
            }),
        }),
        forgetPassword: builder.mutation({
            query: (userId) => ({
                url: "/auth/forget-password",
                method: "POST",
                body: userId,
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ payload, token }) => ({
                url: "/auth/reset-password",
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: payload,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useUpdateUserMutation,
    useGetUserQuery,
    useGetAdminQuery,
    useGetAllUsersQuery,
    useUpdateUserRoleMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation,
} = authApi;
