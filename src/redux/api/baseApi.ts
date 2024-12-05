import {
    // BaseQueryApi,
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../feature/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        console.log("Headers:", headers);
        return headers;
    },
});

const baseQueryWithRefreshToken: BaseQueryFn<
    FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log(result);
    // Log errors for different statuses
    if (result?.error) {
        console.error("API Error:", result.error);

        if (result.error.status === 500) {
            console.log("Sending refresh token");

            const res = await fetch(
                "http://localhost:5000/api/auth/refresh-token",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await res.json();
            console.log("Refresh token response:", data); // Log the response

            if (data?.data?.accessToken) {
                console.log("Setting new token:", data.data.accessToken);
                const user = (api.getState() as RootState).auth.user;

                api.dispatch(
                    setUser({
                        user,
                        token: data.data.accessToken,
                    })
                );

                // Reattempt the original request with the new token
                result = await baseQuery(args, api, extraOptions);
                console.log("Result after retrying with new token:", result);
            } else {
                console.error("No access token received, dispatching logout.");
                api.dispatch(logout());
            }
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: ["User", "Admin", "Car", "Booking"],
    endpoints: () => ({}),
});
