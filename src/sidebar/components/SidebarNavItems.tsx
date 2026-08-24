import { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { NavLink, matchPath, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/common/components/ui/sidebar";
import { NAV_ITEMS } from "@/utils/nav.utils";

export function SidebarNavItems() {
  const location = useLocation();

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
    <SidebarGroup className="px-4 py-2">
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const isActive = activeMap[item.url];
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="bg-surface-muted mb-2 rounded-md data-[active=true]:bg-secondary/10 data-[active=true]:text-secondary data-[active=true]:font-semibold"
                >
                  <NavLink
                    to={item.url}
                    end={item.end}
                    aria-current={isActive ? "page" : undefined}
                    className="flex items-center gap-2 p-2"
                  >
                    <div
                      className={`p-1 rounded-full ${
                        isActive ? "bg-secondary/80" : "bg-inactive"
                      }`}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={20}
                        className={isActive ? "text-white" : "text-foreground"}
                      />
                    </div>
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}