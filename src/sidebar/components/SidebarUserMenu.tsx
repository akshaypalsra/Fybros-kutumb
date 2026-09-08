import { useState } from "react";
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
    const { me, isPending, email, avatarUrl, logout } = useCurrentUser();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    if (isPending) {
        return (
            <SidebarUserMenuSkeleton />
        );
    }

    const companyName = me?.cardName;
    const crCode = me?.crCode;
    const childCardCodes = me?.childCardCodes ?? [];

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-auto w-auto items-center justify-start gap-3 rounded-md p-2 text-left hover:bg-muted data-[state=open]:bg-muted"
                    >
                        <UserAvatar name={companyName} imageUrl={avatarUrl} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm w-42.5 font-medium text-foreground">
                                {companyName}
                            </p>
                            {crCode && (
                                <p className="truncate text-xs text-muted-foreground">
                                    {crCode}
                                </p>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="top" align="end" sideOffset={8} className="w-64">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex items-center gap-3 py-1">
                            <UserAvatar name={companyName} imageUrl={avatarUrl} />
                            <div className="min-w-0 flex-1">
                                <p className="whitespace-normal wrap-break-words text-sm font-heading text-foreground">
                                    {companyName}
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

                    {crCode && (
                        <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                            <span className="text-muted-foreground">CR Code</span>
                            <span className="font-medium text-foreground">{crCode}</span>
                        </div>
                    )}
                    {childCardCodes.length > 0 && (
                        <div className="flex items-start justify-between px-2 py-1.5 text-xs">
                            <span className="text-muted-foreground">Codes</span>
                            <span className="text-right font-medium text-foreground">
                                {childCardCodes.join(", ")}
                            </span>
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
                onConfirm={logout}
            />
        </>
    );
}