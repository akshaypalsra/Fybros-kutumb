import { UserAvatar } from "@/common/components/UserAvatar";
import { cn } from "@/lib/utils";

interface IdentityHeaderProps {
    name?: string;
    subtitle?: string;
    size?: "sm" | "md" | "lg";
    showAvatar?: boolean;
    className?: string;
}

const SIZE_STYLES = {
    sm: { avatar: "h-9 w-9", fallback: "text-sm", title: "text-sm" },
    md: { avatar: "h-11 w-11", fallback: "text-lg", title: "text-lg" },
    lg: { avatar: "h-14 w-14", fallback: "text-xl", title: "text-xl" },
} as const;

export function IdentityHeader({
    name,
    subtitle,
    size = "md",
    showAvatar = true,
    className,
}: IdentityHeaderProps) {
    const styles = SIZE_STYLES[size];
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {showAvatar && name && (
                <UserAvatar
                    name={name}
                    className={styles.avatar}
                    fallbackClassName={cn("bg-secondary/10 font-bold text-secondary", styles.fallback)}
                    fallbackVariant="first-letter"
                />
            )}

            <div>
                <h1 className={cn("font-heading leading-tight text-foreground", styles.title)}>
                    {name || "-"}
                </h1>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
        </div>
    );
}