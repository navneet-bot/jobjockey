"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface LottieAnimationProps {
    animationPath: string;
    className?: string;
    loop?: boolean;
    autoplay?: boolean;
}

export default function LottieAnimation({
    animationPath,
    className = "",
    loop = true,
    autoplay = true
}: LottieAnimationProps) {
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        fetch(animationPath)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    console.warn(`LottieAnimation: Expected JSON but got ${contentType}. URL: ${animationPath}`);
                    // If it's not JSON, it might be an error page or an SVG
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (data) setAnimationData(data);
            })
            .catch((err) => console.error("Error loading Lottie animation:", err));
    }, [animationPath]);

    if (!animationData) return <div className={className} />;

    return (
        <div className={className}>
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
            />
        </div>
    );
}
