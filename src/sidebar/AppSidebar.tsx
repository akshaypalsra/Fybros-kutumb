import { Sidebar, SidebarContent } from "@/common/components/ui/sidebar";
import { SidebarBrand } from "./components/SidebarBrand";
import { SidebarNavItems } from "./components/SidebarNavItems";
import { UpdateChecker } from "@/common/components/UpdateChecker";
import { isTauri } from "@tauri-apps/api/core";


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarBrand />

      <SidebarContent className="flex flex-col">
        <SidebarNavItems />

        {isTauri() && (
          <div className="mt-auto">
            <UpdateChecker />
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}