"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  desc: string;
  meta?: string;
}

interface ServiceCarouselProps {
  services: Service[];
}

export function ServiceCarousel({ services }: ServiceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % services.length);
  }, [services.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
  }, [services.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const getCardStyles = (index: number) => {
    const total = services.length;
    // Calculate relative position (-2, -1, 0, 1, 2)
    let diff = index - activeIndex;
    
    // Handle wrap around for circular feel
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const absDiff = Math.abs(diff);

    if (diff === 0) {
      // Center card
      return {
        scale: 1,
        zIndex: 50,
        rotateY: 0,
        translateX: "0%",
        translateZ: 0,
        opacity: 1,
        filter: "blur(0px)",
      };
    } else if (absDiff === 1) {
      // Side cards
      return {
        scale: 0.8,
        zIndex: 30,
        rotateY: diff > 0 ? -35 : 35,
        translateX: diff > 0 ? "70%" : "-70%",
        translateZ: -100,
        opacity: 0.6,
        filter: "blur(1px)",
      };
    } else if (absDiff === 2) {
      // Far cards
      return {
        scale: 0.6,
        zIndex: 10,
        rotateY: diff > 0 ? -55 : 55,
        translateX: diff > 0 ? "110%" : "-110%",
        translateZ: -200,
        opacity: 0.3,
        filter: "blur(2px)",
      };
    } else {
      // Hidden cards
      return {
        scale: 0.4,
        zIndex: 0,
        rotateY: diff > 0 ? -70 : 70,
        translateX: diff > 0 ? "150%" : "-150%",
        translateZ: -400,
        opacity: 0,
        filter: "blur(4px)",
      };
    }
  };

  return (
    <div 
      className="relative w-full mt-2 py-2 overflow-visible"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Desktop 3D Layout */}
      <div className="hidden md:block relative h-[280px] w-full max-w-6xl mx-auto perspective-1000">
        <div className="relative h-[280px] flex items-center justify-center overflow-visible transform-style-3d">
          {services.map((service, idx) => {
            const styles = getCardStyles(idx);
            return (
              <motion.div
                key={idx}
                initial={false}
                animate={styles}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 25,
                }}
                onClick={() => setActiveIndex(idx)}
                className="absolute w-[280px] cursor-pointer preserve-3d"
                style={{ zIndex: styles.zIndex }}
              >
                <GlassCard className={`h-full p-6 group relative transition-colors duration-500 border border-[var(--primary)]/10 ${idx === activeIndex ? "border-[var(--primary)]/40 shadow-[0_10px_40px_rgba(var(--primary-rgb),0.2)]" : "hover:border-[var(--primary)]/30"} flex flex-col min-h-[220px]`}>
                  <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[var(--primary)]/10 flex items-center justify-center mb-5 border border-black/10 dark:border-[var(--primary)]/20 shadow-sm transition-all group-hover:rotate-6 z-10 relative">
                    <service.icon className="w-6 h-6 text-[#111827] dark:text-[var(--primary)]" />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--text-main)] mb-2 z-10 relative">{service.title}</h4>
                  <p className="text-[var(--text-dim)] leading-relaxed z-10 relative flex-grow text-xs leading-5">{service.desc}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Stacked Swipe Layout */}
      <div className="md:hidden flex flex-col gap-6 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <GlassCard className="p-8 border border-[var(--primary)]/20 flex flex-col min-h-[300px]">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center mb-4 border border-[var(--primary)]/20">
                {React.createElement(services[activeIndex].icon, { className: "w-6 h-6 text-[var(--primary)]" })}
              </div>
              <h4 className="text-xl font-bold text-[var(--text-main)] mb-2">{services[activeIndex].title}</h4>
              <p className="text-[var(--text-dim)] text-sm leading-relaxed">{services[activeIndex].desc}</p>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center items-center gap-6 mt-4">
          <button 
            onClick={prevSlide}
            className="p-3 rounded-full bg-[var(--glass-bg)] border border-black/10 dark:border-white/10 text-[var(--text-main)] shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {services.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "bg-black dark:bg-[var(--primary)] w-4" : "bg-black/20 dark:bg-white/20"}`}
              />
            ))}
          </div>
          <button 
            onClick={nextSlide}
            className="p-3 rounded-full bg-[var(--glass-bg)] border border-black/10 dark:border-white/10 text-[var(--text-main)] shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Controls for Desktop */}
      <div className="hidden md:flex justify-center items-center gap-8 mt-4 relative z-50">
          <button 
            onClick={prevSlide}
            className="group p-4 rounded-full bg-white dark:bg-[var(--glass-bg)] border border-black/10 dark:border-[var(--primary)]/20 text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-md dark:shadow-xl"
          >
            <ChevronLeft className="w-6 h-6 group-active:scale-90" />
          </button>
          <div className="flex gap-3">
            {services.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? "bg-black dark:bg-[var(--primary)] w-12" : "bg-black/10 dark:bg-white/10 hover:bg-black/30 dark:hover:bg-white/30 w-4"}`}
              />
            ))}
          </div>
          <button 
            onClick={nextSlide}
            className="group p-4 rounded-full bg-white dark:bg-[var(--glass-bg)] border border-black/10 dark:border-[var(--primary)]/20 text-[var(--text-main)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-md dark:shadow-xl"
          >
            <ChevronRight className="w-6 h-6 group-active:scale-90" />
          </button>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1500px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
