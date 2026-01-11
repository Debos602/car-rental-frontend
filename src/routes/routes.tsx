import App from "@/App";
import { routeGenerator } from "@/utilities/routeGenarator";
import { createBrowserRouter } from "react-router-dom";
import { navPaths } from "./navRoutes";
import Login from "@/pages/Login";
import CarDetails from "@/pages/car/CarDetails";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ProtectedRoute from "@/layout/ProtectedRoute";
import ErrorPage from "@/layout/ErrorPage";
import Profile from "@/pages/Dashboard/Profile";
import Custombooking from "@/pages/Custombooking";
import DashBoardOverview from "@/pages/AdminDashboard/DashBoardOverview";
import ManageCar from "@/pages/AdminDashboard/ManageCar";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";
import ManageBooking from "@/pages/AdminDashboard/ManageBooking";
import ManageReturnCars from "@/pages/AdminDashboard/ManageReturnCars";
import UserManagement from "@/pages/AdminDashboard/UserManagement";
import ManagePayment from "@/pages/Dashboard/ManagePayment";
import BookingList from "@/pages/Booking/BookingList";
import ForgetPassword from "@/pages/ForgetPassword";
import ResetPassword from "@/pages/ResetPassword";
import Settings from "@/pages/Settings/Settings";
import Documentation from "@/pages/Documentation/Documentation";
import Reports from "@/pages/Reports/Reports";
import UserDashBoardOverview from "@/pages/Dashboard/UserDashboardOverview";
import History from "@/pages/Dashboard/Notifications";
import CarList from "@/pages/car/CarList";
import DashboardCarList from "@/pages/Dashboard/DashboardCarList";
import Notifications from "@/pages/Dashboard/Notifications";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            ...routeGenerator(navPaths),
            {
                path: "/car-details/:id",
                element: <CarDetails />,
            },
            {
                path: "/booking-list",
                element: <BookingList />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
        ],
    },
    {
        path: "/register",
        element: <SignUp />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/forgot-password",
        element: <ForgetPassword />,
    },
    {
        path: "/reset-password",
        element: <ResetPassword />,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute allowedRoles={["user"]}>
                <Dashboard />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <UserDashBoardOverview />,
            },

            {
                path: "profile",
                element: <Profile />,
            },
            {
                path: "booking",
                element: <Custombooking />,
            },
            {
                path: "payment",
                element: <ManagePayment />,
            },
            {
                path: "notifications",
                element: <Notifications />,
            },
            {
                path: "cars",
                element: <DashboardCarList />
            }
        ],
    },
    {
        path: "/admin-dashboard",
        element: (
            <ProtectedRoute allowedRoles={["admin"]}>
                {" "}
                <AdminDashboard />{" "}
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashBoardOverview />,
            },
            {
                path: "dashboard-overview",
                element: <DashBoardOverview />,
            },
            {
                path: "manage-car",
                element: <ManageCar />,
            },
            {
                path: "manage-booking",
                element: <ManageBooking />,
            },
            {
                path: "manage-return-car",
                element: <ManageReturnCars />,
            },
            {
                path: "user-management",
                element: <UserManagement />,
            },
            {
                path: "settings",
                element: <Settings />,
            },

            {
                path: "reports",
                element: <Reports />,
            },
            {
                path: "documentation",
                element: <Documentation />
            }
        ],
    },
]);

export default router;
