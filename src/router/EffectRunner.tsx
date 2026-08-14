import { Outlet } from "react-router-dom";
import { AppLoading } from "@/common/components/AppLoading";
import { useSingleUser } from "@/hooks/useSingleUser";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/common/components/ui/sidebar";
import { AppSidebar } from "@/sidebar/AppSidebar";


const EffectRunner = () => {
    const { isPending, isError } = useSingleUser();

    if (isPending) {
        return <AppLoading className="h-screen" />;
    }

    if (isError) {
        return (
            <div className="flex h-screen items-center justify-center">
                Error fetching user details
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className="flex h-16 items-center border-b px-6">
                    <SidebarTrigger />
                </header>

                <main className="p-8">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default EffectRunner;