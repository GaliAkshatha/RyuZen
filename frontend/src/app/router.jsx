import { createBrowserRouter } from "react-router-dom";

import AuthPage from "../shared/pages/AuthPage";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

import ADashboard from "../admin/pages/ADashboard";
import ActivitiesPage from "../admin/pages/ActivitiesPage"
import ActivityDetails from "../admin/pages/ActivityDetails";
import ActivityResponses from "../admin/pages/ActivityResponses";
import EditActivity from "../admin/pages/EditActivity";

import UDashboard from "../user/pages/UserDashboard";
import UserActivities from "../user/pages/UserActivities";
import UActivityDetails from "../user/pages/ActivityDetails";
import UserSubmissions from "../user/pages/UserSubmissions";

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
            },
            {
                path: "activities/:id",
                element: <ActivityDetails />,
            },
            {
                path: "activities/:id/responses",
                element: <ActivityResponses />,
            },
            {
                path: "activities/:id/edit",
                element: <EditActivity />,
            },
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
            {
                path:"activities",
                element: <UserActivities />
            },
            {
                path: "activities/:id",
                element: <UActivityDetails />
            },
            {
                path: "academic",
                element: <UserSubmissions />,
            },
        ],
    },
]);
