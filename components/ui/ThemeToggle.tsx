"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />;
    }

    const isDark = theme === "dark";

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-colors overflow-hidden relative shadow-sm"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{
                    y: isDark ? 0 : -30,
                    opacity: isDark ? 1 : 0,
                    rotate: isDark ? 0 : 90
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Moon className="w-5 h-5" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    y: isDark ? 30 : 0,
                    opacity: isDark ? 0 : 1,
                    rotate: isDark ? -90 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Sun className="w-5 h-5" />
            </motion.div>
        </motion.button>
    );
}
