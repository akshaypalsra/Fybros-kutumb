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
import { Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { SidebarUserMenu } from "@/sidebar/components/SidebarUserMenu";

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
                    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-6">
                        <SidebarTrigger />
                        <div className="flex space-x-1.5  items-center">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label="Notifications"
                                className="relative h-9 w-9 text-foreground"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
                            </Button>
                            <Button onClick={toggleTheme} className="cursor-pointer bg-transsparent dark:text-white text-black hover:bg-transparent ">
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </Button>

                            <SidebarUserMenu />
                        </div>
                    </header>
                    <main className="p-8 bg-surface flex-1">
                        <Outlet />
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </QueryState>
    );
};

export default EffectRunner;