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
          className="shrink-0"
        />
        <div className="flex flex-col ">
          <div className="text-base font-medium leading-3 tracking-wide text-foreground">
            Kutumb
          </div>
          <div className=" text-[11px] font-medium tracking-wider text-muted-foreground">
            by Fybros
          </div>
        </div>
      </header>
    </SidebarHeader>
  );
}