import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type TUser = {
    userId: string;
    _id?: string;
    role: "admin" | "user";
    iat: number;
    exp: number;
};

type TAuthState = {
    user: null | TUser;
    token: null | string;
};

const initialState: TAuthState = {
    token: null,
    user: null as TUser | null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { user, token } = action.payload;
            // normalize: derive a consistent userId and _id from possible server fields
            const derivedUserId = user?._id ?? user?.userId ?? user?.id ?? user?.uid ?? undefined;
            const normalizedUser = {
                ...(user || {}),
                userId: user?.userId ?? derivedUserId,
                _id: user?._id ?? derivedUserId,
            };
            state.user = normalizedUser as TUser;
            state.token = token;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
