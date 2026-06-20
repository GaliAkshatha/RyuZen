import { createBrowserRouter } from "react-router-dom";

import AuthPage from "../shared/pages/AuthPage";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import ADashboard from "../admin/pages/ADashboard";
import ActivitiesPage from "../admin/pages/ActivitiesPage"
import UDashboard from "../user/pages/UserDashboard";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthPage />,
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "dashboard",
                element: <ADashboard />,
            },
            {
                path: "activities",
                element: <ActivitiesPage />
            }
        ],
    },

    {
        path: "/user",
        element: <UserLayout />,
        children: [
            {
                path: "dashboard",
                element: <UDashboard />,
            },
        ],
    },
]);
