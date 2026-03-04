import { Variants } from "framer-motion";

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const slideUp: Variants = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const staggerContainer = (staggerChildren: number = 0.1, delayChildren: number = 0): Variants => ({
    animate: {
        transition: {
            staggerChildren,
            delayChildren,
        },
    },
});

export const pageTransitionVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } },
};

export const cardHover = {
    whileHover: {
        scale: 1.03,
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
    },
};
