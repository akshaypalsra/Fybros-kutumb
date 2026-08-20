import { Sidebar, SidebarContent } from "@/common/components/ui/sidebar";
import { SidebarBrand } from "./components/SidebarBrand";
import { SidebarNavItems } from "./components/SidebarNavItems";


export function AppSidebar() {

  return (
    <Sidebar>
      <SidebarBrand />
      <SidebarContent className="flex flex-col">
        <SidebarNavItems />
      </SidebarContent>
    </Sidebar>
  );
}