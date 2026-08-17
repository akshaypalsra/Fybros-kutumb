import { useCallback, useMemo, useState } from "react";
import {
  Home01Icon,
  UserGroupIcon,
  ShoppingCart01Icon,
  InvoiceIcon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import fybrosLogo from "@/assets/fybros-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/common/components/ui/sidebar";
import { Skeleton } from "@/common/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/common/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/common/components/ui/alert-dialog";
import { useUserApi } from "@/api/user/useUserApi";
import { useAuth } from "react-oidc-context";
import { ChevronsUpDown, LogOutIcon } from "lucide-react";
import { Button } from "@/common/components/ui/button";

type NavItem = {
  title: string;
  url: string;
  icon: typeof Home01Icon;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { title: "Home", url: "/", icon: Home01Icon, end: true },
  { title: "Business Partners", url: "/business-partners", icon: UserGroupIcon },
  { title: "Orders", url: "/orders", icon: ShoppingCart01Icon },
  { title: "Invoices", url: "/invoices", icon: InvoiceIcon },
];

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function AppSidebar() {
  const auth = useAuth();
  const location = useLocation();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const { getMyDetails } = useUserApi();
  const { data: me, isLoading: isUserLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMyDetails,
    enabled: auth.isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const displayName = me?.name ?? auth.user?.profile.name ?? "User";
  const email = me?.email ?? auth.user?.profile.email;
  const avatarUrl = auth.user?.profile.picture;

  const handleLogout = useCallback(async () => {
    sessionStorage.removeItem("redirectTo");
    await auth.signoutRedirect();
  }, [auth]);

  const activeMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const item of NAV_ITEMS) {
      map[item.url] = item.end
        ? !!matchPath({ path: item.url, end: true }, location.pathname)
        : !!matchPath({ path: `${item.url}/*` }, location.pathname);
    }
    return map;
  }, [location.pathname]);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <header className="flex items-center gap-3 border-b pb-4">
          <img
            src={fybrosLogo}
            alt="Fybros"
            className="h-8 w-8"
            width={32}
            height={32}
            loading="eager"
          />
          <span className="text-lg font-semibold tracking-tight">
            Kutumb
          </span>
        </header>
      </SidebarHeader>

      <SidebarContent className="flex flex-col">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = activeMap[item.url];
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="data-[active=true]:bg-secondary/10 data-[active=true]:text-secondary data-[active=true]:font-semibold"
                    >
                      <NavLink
                        to={item.url}
                        end={item.end}
                        aria-current={isActive ? "page" : undefined}
                        className="flex items-center gap-2"
                      >
                        <HugeiconsIcon icon={item.icon} size={20} />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto border-t p-2">
          {isUserLoading ? (
            <div className="flex items-center gap-3 p-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto w-full items-center justify-start gap-3 rounded-md p-2 text-left hover:bg-muted data-[state=open]:bg-muted"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {displayName}
                    </p>
                    {email && (
                      <p className="truncate text-xs text-muted-foreground">
                        {email}
                      </p>
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align="start"
                sideOffset={8}
                className="w-64"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-3 py-1">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
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
          )}
        </div>

        <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You'll need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-secondary">
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarContent>
    </Sidebar>
  );
}