import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeadingProps {
  title: ReactNode;
  className?: string;
}

export const Heading = ({ title, className }: HeadingProps) => (
  <h2 className={cn("text-sm mb-3 font-heading text-foreground", className)}>
    {title}
  </h2>
);