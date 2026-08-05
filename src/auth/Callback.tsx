import {useAuth} from "react-oidc-context";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Loader2} from "lucide-react";

const Callback = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    interface RedirectState { redirectTo?: string }
    const redirectTo = (auth.user?.state as RedirectState | undefined)?.redirectTo;

    useEffect(() => {
        if (!auth.isLoading) {
            if (auth.isAuthenticated) {
                navigate(`${redirectTo ?? "/"}`, {replace: true});
            } else if (auth.error) {
                console.error("OIDC Callback error:", auth.error);
                navigate(`/login?redirectTo=${redirectTo ?? "/"}`, {replace: true});
            }
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.error]);

    return (
        <div className="flex justify-center items-center w-full h-screen">
            <Loader2 className={"size-5 animate-spin"}/>
        </div>
    );
};

export default Callback;