"use client";

import { cn } from "@/lib/utils";

interface WatermarkedPhotoProps {
  src: string;
  alt: string;
  companyName: string;
  className?: string;
  onClick?: () => void;
}

export function WatermarkedPhoto({
  src,
  alt,
  companyName,
  className,
  onClick,
}: WatermarkedPhotoProps) {
  return (
    <div
      className={cn("relative overflow-hidden group", className)}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Watermark overlay - diagonal repeating pattern */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.07]">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: "rotate(-30deg) scale(2)",
          }}
        >
          <div className="grid gap-16" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <span
                key={i}
                className="text-white text-lg font-bold whitespace-nowrap tracking-wider uppercase"
                style={{ textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
              >
                {companyName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom corner watermark - more visible */}
      <div className="absolute bottom-2 right-2 pointer-events-none select-none">
        <span
          className="text-xs font-medium text-white/50 px-2 py-1 rounded bg-black/30 backdrop-blur-sm"
        >
          {companyName}
        </span>
      </div>
    </div>
  );
}
