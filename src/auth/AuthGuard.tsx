import { isTauri } from "@tauri-apps/api/core";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { Loader2 } from "lucide-react";
import { getAccessToken } from "@/axios/AxiosTauriAuthBinding";


export default function AuthGuard({ children }: { children: ReactNode }) {
    return isTauri() ? <TauriAuthGuard>{children}</TauriAuthGuard> : <WebAuthGuard children={children} />
}

const TauriAuthGuard = (props: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthed, setIsAuthed] = useState<boolean>(false);

    useEffect(() => {
        void checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await getAccessToken();
            setIsAuthed(!!token);
        } catch (error) {
            console.error("Error reading access token from store:", error);
            setIsAuthed(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center w-full h-screen">
            <Loader2 className={"size-5 animate-spin"} />
        </div>
    )
    return isAuthed ? props.children : <Navigate to="/login" replace />;
}

const WebAuthGuard = (props: { children: ReactNode }) => {
    const auth = useAuth();
    const location = useLocation();

    if (auth.isLoading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <Loader2 className={"size-5 animate-spin"} />
            </div>
        );
    }

    if (auth.error) {
        console.error("Auth error:", auth.error);
        sessionStorage.setItem('redirectTo', location.pathname + location.search + location.hash);
        void auth.signoutRedirect();
        return null;
    }

    const redirectTo = encodeURIComponent(
        location.pathname + location.search + location.hash
    );

    if (!auth.isAuthenticated) {

        return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
    }

    return <>{props.children}</>;
}