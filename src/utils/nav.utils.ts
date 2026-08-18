
import type { NavItem } from "@/types/nav.types";
import {
  Home01Icon,
  UserGroupIcon,
  ShoppingCart01Icon,
  InvoiceIcon,
} from "@hugeicons/core-free-icons";

export const NAV_ITEMS: NavItem[] = [
  { title: "Home", url: "/", icon: Home01Icon, end: true },
  { title: "Business Partners", url: "/business-partners", icon: UserGroupIcon },
  { title: "Orders", url: "/orders", icon: ShoppingCart01Icon },
  { title: "Invoices", url: "/invoices", icon: InvoiceIcon },
];