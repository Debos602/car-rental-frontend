import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout, useCurrentToken } from "@/redux/feature/authSlice";
import { verifyToken } from "@/utilities/verifyToken";
import { toast } from "sonner";

interface TUser {
    userId: string;
    role: "admin" | "user";
    // যদি আরও ফিল্ড থাকে, এখানে অ্যাড করো
}

interface TProtectedRoute {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: TProtectedRoute) => {
    const dispatch = useAppDispatch();
    const token = useAppSelector(useCurrentToken);
    const location = useLocation();

    if (!token) {
        toast.warning("Please log in to continue");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    let user: TUser | null = null;

    try {
        user = verifyToken(token) as TUser;
    } catch (error) {
        console.error("Token verification failed:", error);
        toast.error("Session expired or invalid. Please log in again.");
        dispatch(logout());
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role চেক (case-insensitive)
    const userRole = user.role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
        toast.error("You don't have permission to access this page");
        return <Navigate to="/unauthorized" replace />;
    }

    // সব ঠিক থাকলে children রেন্ডার
    return <>{children}</>;
};

export default ProtectedRoute;