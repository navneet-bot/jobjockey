"use client";

import Image from "next/image";

const logos = [
    { src: "/logos/logo1.svg", alt: "Capgemini" },
    { src: "/logos/logo2.svg", alt: "Wipro" },
    { src: "/logos/logo3.svg", alt: "Cognizant" },
    { src: "/logos/logo4.svg", alt: "TCS" },
    { src: "/logos/logo5.svg", alt: "Infosys" },
];

export function BrandMarquee() {
    return (
        <section className="w-full py-12 relative overflow-hidden flex flex-col gap-6 -mt-12 md:-mt-20">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-medium text-[var(--text-dim)] dark:text-white/70 opacity-80">
                    Partnering with the world’s leading enterprises
                </p>
            </div>

            <div className="relative flex overflow-hidden group w-full">
                {/* Left Fade */}
                <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-[var(--bg-main)] to-transparent z-10 pointer-events-none" />

                {/* Right Fade */}
                <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-[var(--bg-main)] to-transparent z-10 pointer-events-none" />

                <div className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
                    {/* Double the logos sequence to create a seamless infinite loop. 
                        We pad the right of each item or space them out evenly so it connects perfectly. */}
                    {[...logos, ...logos].map((logo, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0 flex items-center justify-center w-[120px] h-[40px] mx-8 opacity-70 hover:opacity-100 transition-opacity duration-300"
                        >
                            <Image
                                src={logo.src}
                                alt={logo.alt}
                                width={120}
                                height={40}
                                className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 dark:invert-0 invert transition-all duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
