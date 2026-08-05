import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppLoadingProps {
    label?: string
    className?: string
    spinnerClassName?: string
}

export const AppLoading = ({
    label = "Loading...",
    className,
    spinnerClassName,
}: AppLoadingProps) => {
    return (
        <div
            className={cn(
                "flex min-h-[35vh] flex-col items-center justify-center gap-3 text-sm text-muted-foreground",
                className
            )}
        >
            <Loader2 className={cn("h-6 w-6 animate-spin text-primary", spinnerClassName)} />
            <span>{label}</span>
        </div>
    )
}

