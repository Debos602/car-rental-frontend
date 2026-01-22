import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../feature/auth/authSlice";

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
            // Try to read token from redux-persist localStorage as a fallback
            try {
                const persisted = localStorage.getItem("persist:auth");
                if (persisted) {
                    const parsed = JSON.parse(persisted);
                    // parsed.token may be a string or a JSON-stringified value depending on setup
                    let persistedToken = parsed.token;
                    if (!persistedToken && typeof parsed === 'object') {
                        // attempt to parse nested string
                        try {
                            const nested = JSON.parse(parsed);
                            persistedToken = nested.token;
                        } catch (e) {
                            // ignore
                        }
                    }

                    if (persistedToken) {
                        headers.set("authorization", `Bearer ${persistedToken}`);
                        const masked = persistedToken.length > 10 ? `${persistedToken.substring(0, 6)}...${persistedToken.substring(persistedToken.length - 4)}` : "[token]";
                        console.debug("baseApi: Authorization token set from persist (masked):", masked);
                        return headers;
                    }
                }
            } catch (err) {
                console.debug("baseApi: error reading persisted token", err);
            }

            console.log("No token found in Redux or persist - Authorization header not set");
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


        if (result.error.status === 401 || result.error.status === 403) {
            console.log("Access token expired/invalid → Trying refresh");

            type RefreshResult =
                | { data?: { data?: { accessToken?: string; }; }; }
                | { error?: FetchBaseQueryError; }
                | any;

            const refreshResult = (await fetchBaseQuery({
                baseUrl: `${import.meta.env.VITE_BASE_URL}`,
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