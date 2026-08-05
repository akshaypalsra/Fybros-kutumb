import { isTauri } from "@tauri-apps/api/core";
import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: ReactNode }) {
    return isTauri() ? null : <WebAuthGuard children={children} />
}

// const TauriAuthGuard = (props: { children: ReactNode }) => {
//     const [loading, setLoading] = useState<boolean>(true);
//     const [isAuthed, setIsAuthed] = useState<boolean>(false);

//     useEffect(() => {
//         void getAccessTokenFromKeychain();
//     }, []);

//     const getAccessTokenFromKeychain = async () => {
//         try {
//             const token = await invoke<string>("get_access_token");
//             setToken(token);
//             setIsAuthed(!!token);
//         } catch (error) {
//             console.log("error fetching access token from keyring", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return (
//         <div className="flex justify-center items-center w-full h-screen">
//             <Loader2 className={"size-5 animate-spin"}/>
//         </div>
//     )
//     return isAuthed ? props.children : <Navigate to="/login" replace/>;
// }

const WebAuthGuard = (props: { children: ReactNode }) => {
    const auth = useAuth();
    const location = useLocation();

    if (auth.isLoading) {
        console.log("auth.isLoading");
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
        console.log("user is not authenticated");
        return <Navigate to={`/login?redirectTo=${redirectTo}`} replace />;
    }

    return <>{props.children}</>;
}