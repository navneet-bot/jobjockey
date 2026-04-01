import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
}

const NeonInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, icon, ...props }, ref) => {
        return (
            <div className="relative group w-full">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-black dark:group-focus-within:text-[var(--primary)] transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full rounded-xl border border-border bg-[var(--glass-bg)] px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-sm dark:focus-visible:shadow-[0_0_15px_var(--primary-glow)]",
                        icon && "pl-10",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
NeonInput.displayName = "NeonInput"

export { NeonInput }
