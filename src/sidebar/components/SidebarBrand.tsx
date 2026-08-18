import Logo from "@/assets/Logo.png";
import { SidebarHeader } from "@/common/components/ui/sidebar";

export function SidebarBrand() {
  return (
    <SidebarHeader className="p-4">
      <header className="flex items-center gap-3 border-b pb-4">
        <img
          src={Logo}
          alt="Fybros"

          width={36}
          height={36}
          loading="eager"
        />
        <span className="text-md font-normal tracking-tight">Fybros Kutumb</span>
      </header>
    </SidebarHeader>
  );
}