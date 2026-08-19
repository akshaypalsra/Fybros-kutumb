import { Outlet } from "react-router-dom";
import { AppLoading } from "@/common/components/AppLoading";
import { ErrorState } from "@/common/components/ErrorState";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/common/components/ui/sidebar";
import { AppSidebar } from "@/sidebar/AppSidebar";
import { QueryState } from "@/wrapper/QueryState";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/common/components/ui/button";

const EffectRunner = () => {
    const { isPending, isError } = useCurrentUser();
    const { theme, toggleTheme } = useTheme();
    return (
        <QueryState
            isLoading={isPending}
            isError={isError}
            loading={<AppLoading className="h-screen" />}
            error={
                <div className="flex h-screen items-center justify-center">
                    <ErrorState message="Couldn't load your account. Please try again." />
                </div>
            }
        >
            <SidebarProvider>
                <AppSidebar />

                <SidebarInset>
                    <header className="flex h-16 items-center justify-between border-b px-6">
                        <SidebarTrigger />
                        <Button onClick={toggleTheme} className="bg-transsparent dark:text-white text-black hover:bg-transparent ">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </Button>
                    </header>

                    <main className="p-8">
                        <Outlet />
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </QueryState>
    );
};

export default EffectRunner;