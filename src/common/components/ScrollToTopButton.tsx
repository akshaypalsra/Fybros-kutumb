// src/common/components/ScrollToTopButton.tsx
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { cn } from "@/utils/common.utils";


interface ScrollToTopButtonProps {

    threshold?: number;

    containerRef?: React.RefObject<HTMLElement>;
    className?: string;
}

export const ScrollToTopButton = ({ threshold = 400, containerRef, className }: ScrollToTopButtonProps) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const target: Window | HTMLElement = containerRef?.current ?? window;

        const getScrollTop = () =>
            target === window ? window.scrollY : (target as HTMLElement).scrollTop;

        const handleScroll = () => setVisible(getScrollTop() > threshold);

        handleScroll(); // set initial state in case already scrolled (e.g. after route change)
        target.addEventListener("scroll", handleScroll, { passive: true });
        return () => target.removeEventListener("scroll", handleScroll);
    }, [threshold, containerRef]);

    const handleClick = () => {
        const target: Window | HTMLElement = containerRef?.current ?? window;
        target.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!visible) return null;

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClick}
            aria-label="Scroll to top"
            className={cn(
                "fixed bottom-6 right-6 z-50 h-10 w-10 rounded-full bg-background shadow-md hover:bg-muted",
                className,
            )}
        >
            <ArrowUp className="h-4 w-4" />
        </Button>
    );
};