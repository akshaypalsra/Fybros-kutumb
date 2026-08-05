import AuthGuard from "@/auth/AuthGuard";
import Callback from "@/auth/Callback";
import Login from "@/login/Login";
import { createBrowserRouter } from "react-router-dom";
import EffectRunner from "./EffectRunner";
import HomePage from "@/pages/home/page";
import BusinessPartnerList from "@/pages/business/page";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthGuard>
                <EffectRunner />
            </AuthGuard>
        ),
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "business-partners",
                element: <BusinessPartnerList />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/callback",
        element: <Callback />,
    },
]);

export default router;