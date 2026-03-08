"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Link, Workflow, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  const rotation = useMotionValue(0);
  const counterRotation = useTransform(rotation, (value) => -value);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const autoRotateRef = useRef<any>(null);

  useEffect(() => {
    if (autoRotate) {
      autoRotateRef.current = animate(rotation, rotation.get() + 360, {
        duration: 40,
        repeat: Infinity,
        ease: "linear"
      });
    } else {
      if (autoRotateRef.current) {
        autoRotateRef.current.stop();
      }
    }
    return () => autoRotateRef.current?.stop();
  }, [autoRotate, rotation]);

  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedId(null);
      setActiveNodeId(null);
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      setActiveNodeId(null);
      setAutoRotate(true);
    } else {
      setExpandedId(id);
      setActiveNodeId(id);
      setAutoRotate(false);
      centerViewOnNode(id);
    }
  };

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital") return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    
    // Each node is at index/total * 360
    // We want this specific node to be at 270 degrees (Top)
    // Container rotation + Node angle = 270
    // Container rotation = 270 - Node angle
    const nodeAngle = (nodeIndex / totalNodes) * 360;
    const targetRotation = 270 - nodeAngle;

    // Normalize target rotation to be closest to current rotation
    const currentRot = rotation.get();
    const normalizedTarget = Math.round(currentRot / 360) * 360 + (targetRotation % 360);
    
    // Determine the shortest path
    let finalTarget = normalizedTarget;
    if (finalTarget - currentRot > 180) finalTarget -= 360;
    if (finalTarget - currentRot < -180) finalTarget += 360;

    animate(rotation, finalTarget, {
      type: "spring",
      stiffness: 60,
      damping: 15,
      mass: 1
    });
  };

  const calculateNodePosition = (index: number, total: number) => {
    // Statically position nodes around the circle relative to the container
    const angle = (index / total) * 360;
    const radius = 180;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number): boolean => {
    return activeNodeId === itemId;
  };


  return (
    <div
      className="w-full min-h-[500px] flex flex-col items-center justify-center bg-transparent overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <motion.div
          className="absolute w-full h-full flex items-center justify-center font-display"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            rotate: rotation,
          }}
        >
          {/* Center Hub */}
          <div className="absolute w-16 h-16 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-xl flex items-center justify-center z-10 border-2 border-black/10 dark:border-white/20 shadow-xl">
            <div className="absolute w-20 h-20 rounded-full border border-black/5 dark:border-white/10 animate-ping opacity-30"></div>
            <div
              className="absolute w-24 h-24 rounded-full border border-black/5 dark:border-white/5 animate-ping opacity-20"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <motion.div 
              style={{ rotate: counterRotation }}
              className="w-8 h-8 rounded-full bg-white/80 dark:bg-white/80 backdrop-blur-md flex items-center justify-center shadow-inner"
            >
               <Workflow size={16} className="text-black dark:text-black" />
            </motion.div>
          </div>

          <div className="absolute w-96 h-96 rounded-full border border-black/5 dark:border-white/10 shadow-[inset_0_0_50px_rgba(255,255,255,0.05)]"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedId === item.id;
            const isRelated = isRelatedToActive(item.id);
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <motion.div
                key={item.id}
                ref={(el: HTMLDivElement | null) => { nodeRefs.current[item.id] = el }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <motion.div
                   style={{ rotate: counterRotation }}
                   className="relative flex flex-col items-center"
                >
                    <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${
                        isExpanded
                        ? "bg-white text-black"
                        : isRelated
                        ? "bg-white/50 dark:bg-white/50 text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        : "bg-white/80 dark:bg-white/80 backdrop-blur-md text-black dark:text-black"
                    }
                    border-2 
                    ${
                        isExpanded
                        ? "border-white shadow-lg shadow-white/30"
                        : isRelated
                        ? "border-white animate-pulse"
                        : "border-black/10 dark:border-white/20"
                    }
                    transition-all duration-300 transform
                    ${isExpanded ? "scale-140" : "hover:scale-110"}
                    `}
                    >
                    <Icon size={16} />
                    </div>

                    <div
                    className={`
                    absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-[10px] font-bold tracking-tighter uppercase
                    transition-all duration-300
                    ${isExpanded ? "text-[var(--text-main)] scale-110 opacity-100" : "text-[var(--text-dim)] dark:text-white/60 opacity-80"}
                    `}
                    >
                    {item.title}
                    </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Centered Expanded Card */}
        {expandedId !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute z-[300] w-full max-w-[240px]"
          >
            {(() => {
              const activeItem = timelineData.find(i => i.id === expandedId);
              if (!activeItem) return null;
              const stepIndex = timelineData.findIndex(i => i.id === expandedId) + 1;
              
              return (
                <Card className="bg-white/95 dark:bg-black/80 backdrop-blur-2xl border-black/10 dark:border-white/20 shadow-2xl shadow-blue-500/10 overflow-visible">
                  <CardHeader className="pb-1 px-5 pt-5">
                    <div className="flex justify-center items-center bg-black/5 dark:bg-white/5 py-1 px-3 rounded-lg border border-black/10 dark:border-white/10">
                      <span className="text-[10px] font-bold text-black/40 dark:text-white/40 tracking-[0.2em] font-mono uppercase">
                        Step {stepIndex}
                      </span>
                    </div>
                    <CardTitle className="text-xl mt-3 font-display font-bold text-[var(--text-main)] text-center">
                      {activeItem.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-[var(--text-dim)] dark:text-white/70 px-5 pb-5 leading-relaxed text-center">
                    <p className="font-sans">{activeItem.content}</p>
                  </CardContent>
                </Card>
              );
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
}
