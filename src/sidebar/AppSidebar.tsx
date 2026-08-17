import { useCallback, useMemo} from "react";
import {
  Home01Icon,
  UserGroupIcon,
  ShoppingCart01Icon,
  InvoiceIcon,
} from "@hugeicons/core-free-icons";

import { HugeiconsIcon } from "@hugeicons/react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
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
import { Button } from "@/common/components/ui/button";
import { useAuth } from "react-oidc-context";
import { LogOutIcon } from "lucide-react";

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

export function AppSidebar() {
  const auth = useAuth();
  const location = useLocation();

  const handleLogout = useCallback(async () => {
    sessionStorage.removeItem("redirectTo");
    await auth.signoutRedirect();
  }, [auth]);

  // Compute active states once per pathname change instead of per-item inline checks
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
            Fybros Kutumb
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

        <div className="mt-auto border-t p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2 rounded-none"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}