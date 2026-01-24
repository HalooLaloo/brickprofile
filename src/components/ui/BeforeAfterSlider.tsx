"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
    setHasInteracted(true);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  // Click anywhere on the slider to move the handle there
  const handleClick = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Initial animation hint
  useEffect(() => {
    if (hasInteracted) return;

    const animateHint = () => {
      let start: number | null = null;
      const duration = 1500;

      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / duration;

        if (progress < 1) {
          // Oscillate between 40% and 60%
          const position = 50 + Math.sin(progress * Math.PI * 2) * 10;
          setSliderPosition(position);
          requestAnimationFrame(animate);
        } else {
          setSliderPosition(50);
        }
      };

      requestAnimationFrame(animate);
    };

    const timeout = setTimeout(animateHint, 500);
    return () => clearTimeout(timeout);
  }, [hasInteracted]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-[4/3] overflow-hidden rounded-lg cursor-ew-resize select-none group",
        className
      )}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
    >
      {/* After image (background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${containerRef.current?.offsetWidth || 100}px` }}
          draggable={false}
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Slider handle with arrows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-dark-200">
          <ChevronLeft className="w-5 h-5 text-dark-600 -mr-1" />
          <ChevronRight className="w-5 h-5 text-dark-600 -ml-1" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-sm font-medium text-white">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-sm font-medium text-white">
        {afterLabel}
      </div>

      {/* Drag hint - shows until user interacts */}
      {!hasInteracted && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full text-sm font-medium text-white flex items-center gap-2 animate-pulse">
          <ChevronLeft className="w-4 h-4" />
          Drag to compare
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
