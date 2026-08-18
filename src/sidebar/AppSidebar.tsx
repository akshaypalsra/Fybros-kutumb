import { Sidebar, SidebarContent } from "@/common/components/ui/sidebar";
import { SidebarBrand } from "./components/SidebarBrand";
import { SidebarNavItems } from "./components/SidebarNavItems";
import { SidebarUserMenu } from "./components/SidebarUserMenu";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarBrand />
      <SidebarContent className="flex flex-col">
        <SidebarNavItems />
        <div className="mt-auto border-t p-2">
          <SidebarUserMenu />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}