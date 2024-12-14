import ProtectedRoute from "@/layout/ProtectedRoute";
import About from "@/pages/About/About";
import Booking from "@/pages/Booking/Booking";

import Car from "@/pages/car/Car";
import Contact from "@/pages/Contact";

import Home from "@/pages/Home/Home";

export const navPaths = [
    {
        name: "Home",
        path: "/",
        element: <Home />,
    },
    {
        name: "Car-List",
        path: "/cars",
        element: <Car></Car>,
    },


    {
        name: "Bookings",
        path: "/bookings",
        element: (
            <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Booking />
            </ProtectedRoute>
        ),
    },
    {
        name: "About",
        path: "/about",
        element: <About />,
    },
    {
        name: "Contact",
        path: "/contact",
        element: <Contact />,
    },
];
