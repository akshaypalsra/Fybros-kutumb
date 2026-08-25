import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { cn } from "@/lib/utils";

interface DropdownOption<T extends string> {
  label: string;
  value: T;
}

interface DropdownProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: DropdownOption<T>[];
  placeholder?: string;
  className?: string;
  align?: "start" | "center" | "end";
  variant?: "default" | "secondary";
}

export function Dropdown<T extends string>({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  align = "end",
  variant = "default",
}: DropdownProps<T>) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v as T)}>
      <SelectTrigger
        className={cn(
          "h-8 w-fit min-w-20 cursor-pointer rounded-md border-border text-sm transition-colors focus:ring-1 focus:ring-ring",
          variant === "secondary"
            ? "border-0 bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary [&_svg]:text-white"
            : "hover:bg-card bg-card",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent align={align} className="min-w-24 rounded-xl">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="cursor-pointer">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}