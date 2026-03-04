"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
    from?: number;
    to: number;
    duration?: number;
    suffix?: string;
    className?: string;
}

export default function AnimatedCounter({
    from = 0,
    to,
    duration = 1.4,
    suffix = "",
    className = "",
}: AnimatedCounterProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const count = useSpring(from, {
        duration: duration * 1000,
        bounce: 0,
    });

    const rounded = useTransform(count, (latest) => {
        return Math.floor(latest).toLocaleString() + suffix;
    });

    useEffect(() => {
        if (isInView) {
            count.set(to);
        }
    }, [isInView, count, to]);

    return (
        <motion.span ref={ref} className={className}>
            {rounded}
        </motion.span>
    );
}
