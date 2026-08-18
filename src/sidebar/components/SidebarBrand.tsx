import fybrosLogo from "@/assets/fybros-logo.png";
import { SidebarHeader } from "@/common/components/ui/sidebar";

export function SidebarBrand() {
  return (
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
        <span className="text-lg font-semibold tracking-tight">Kutumb</span>
      </header>
    </SidebarHeader>
  );
}