import type { Home01Icon } from "@hugeicons/core-free-icons";

export type NavItem = {
  title: string;
  url: string;
  icon: typeof Home01Icon;
  end?: boolean;
};