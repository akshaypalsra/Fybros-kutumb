import { useCallback, useState } from "react";
import { useAuth } from "react-oidc-context";
import { ChevronDown, LogOutIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Button } from "@/common/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LogoutDialog } from "./LogoutDialog";
import { UserAvatar } from "@/common/components/UserAvatar";
import { SidebarUserMenuSkeleton } from "./SidebarUserMenuSkeleton";

export function SidebarUserMenu() {
    const auth = useAuth();
    const { me, isPending, displayName, email, code, avatarUrl } = useCurrentUser();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleLogout = useCallback(async () => {
        sessionStorage.removeItem("redirectTo");
        await auth.signoutRedirect();
    }, [auth]);

    if (isPending) {
        return (
            <SidebarUserMenuSkeleton />
        );
    }
    
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-auto w-auto items-center justify-start gap-3 rounded-md p-2 text-left hover:bg-muted data-[state=open]:bg-muted"
                    >
                        <UserAvatar name={displayName} imageUrl={avatarUrl} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                                {displayName}
                            </p>
                            {code && (
                                <p className="truncate text-xs text-muted-foreground">
                                    {code}
                                </p>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-64">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex items-center gap-3 py-1">
                            <UserAvatar name={displayName} imageUrl={avatarUrl} />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    {displayName}
                                </p>
                                {email && (
                                    <p className="truncate text-xs text-muted-foreground">
                                        {email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {me?.role && (
                        <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                            <span className="text-muted-foreground">Role</span>
                            <span className="font-medium text-foreground">{me.role}</span>
                        </div>
                    )}
                    {me?.id && (
                        <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                            <span className="text-muted-foreground">User ID</span>
                            <span className="font-medium text-foreground">{me.id}</span>
                        </div>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="cursor-pointer"
                        variant="destructive"
                        onSelect={(e) => {
                            e.preventDefault();
                            setLogoutDialogOpen(true);
                        }}
                    >
                        <LogOutIcon className="h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <LogoutDialog
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
                onConfirm={handleLogout}
            />
        </>
    );
}