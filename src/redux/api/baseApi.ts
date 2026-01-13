import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../feature/authSlice";

// Base query with proxy support in dev
const baseQuery = fetchBaseQuery({
    // Dev-এ empty baseUrl দিয়ে proxy ব্যবহার করো (vite.config.ts-এ /api proxy আছে)
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
            try {
                const masked = token.length > 10 ? `${token.substring(0, 6)}...${token.substring(token.length - 4)}` : "[token]";
                console.debug("baseApi: Authorization token set (masked):", masked);
            } catch (e) {
                console.debug("baseApi: Authorization token set");
            }

        } else {
            console.log("No token found in Redux - Authorization header not set");
        }

        return headers;
    },
});

const baseQueryWithRefreshToken: BaseQueryFn<
    FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error) {
        console.error("API Error:", result.error);

        // 401 বা 403-এ refresh চেষ্টা করো (500-এর পরিবর্তে, কারণ auth error সাধারণত 401)
        if (result.error.status === 401 || result.error.status === 403) {
            console.log("Access token expired/invalid → Trying refresh");

            type RefreshResult =
                | { data?: { data?: { accessToken?: string; }; }; }
                | { error?: FetchBaseQueryError; }
                | any;

            const refreshResult = (await fetchBaseQuery({
                baseUrl: import.meta.env.DEV ? "/" : import.meta.env.VITE_BASE_URL,
                credentials: "include",
            })(
                {
                    url: "/api/auth/refresh-token",
                    method: "POST",
                },
                api,
                extraOptions
            )) as RefreshResult;

            if (refreshResult && 'data' in refreshResult && refreshResult.data?.data?.accessToken) {
                const newToken = refreshResult.data.data.accessToken;
                const user = (api.getState() as RootState).auth.user;

                console.log("New token received:", newToken.substring(0, 10) + "...");

                api.dispatch(
                    setUser({
                        user,
                        token: newToken,
                    })
                );

                // Retry original request
                result = await baseQuery(args, api, extraOptions);
            } else {
                console.error("Refresh failed, logging out");
                api.dispatch(logout());
            }
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: ["User", "Admin", "Car", "Booking", "Notification"],
    endpoints: () => ({}),
});