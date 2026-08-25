import { Home01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { NavLink } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/common/components/ui/sidebar";

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home01Icon,
    },
    {
        title: "Business Partners",
        url: "/business-partners",
        icon: UserGroupIcon,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="none" className="w-64">
            <SidebarHeader className="p-4">
                <h2 className="text-lg font-bold">SAP Demo</h2>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton asChild>
                                        <NavLink
                                            to={item.url}
                                            className={({ isActive }) =>
                                                isActive ? "font-heading" : ""
                                            }
                                        >
                                            <HugeiconsIcon icon={item.icon} size={20} />
                                            <span>{item.title}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}