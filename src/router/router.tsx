import AuthGuard from "@/auth/AuthGuard";
import Callback from "@/auth/Callback";
import Login from "@/login/Login";
import { createBrowserRouter } from "react-router-dom";
import EffectRunner from "./EffectRunner";
import HomePage from "@/pages/home/page";
import BusinessPartnerList from "@/pages/business/page";
import OrdersPage from "@/pages/order/OrdersPage";
import OrderDetailPage from "@/pages/order/OrderDetailPage";
import OrderItemDetailPage from "@/pages/order/OrderItemDetailPage";
import InvoicesPage from "@/pages/invoice/InvoicesPage";
import InvoiceDetailPage from "@/pages/invoice/InvoiceDetailPage";
import PendingItemDetailPage from "@/pages/order/components/pending-item/PendingItemDetailPage";


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
            {
                path: "orders",
                element: <OrdersPage />,
            },
            {
                path: "orders/:orderId",
                element: <OrderDetailPage />,
            },
            {
                path: "orders/pending-items/:itemCode",
                element: <PendingItemDetailPage />,
            },
            {
                path: "orders/:orderId/items/:orderItemId",
                element: <OrderItemDetailPage />,
            },
            {
                path: "invoices",
                element: <InvoicesPage />,
            },
            {
                path: "invoices/:invoiceId",
                element: <InvoiceDetailPage />,
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