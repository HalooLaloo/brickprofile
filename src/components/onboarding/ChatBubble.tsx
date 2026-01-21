"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isBot?: boolean;
  animate?: boolean;
}

export function ChatBubble({ message, isBot = false, animate = false }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        isBot ? "flex-row" : "flex-row-reverse",
        animate && "animate-fade-in"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isBot ? "bg-brand-500/20" : "bg-dark-700"
        )}
      >
        {isBot ? (
          <Bot className="w-4 h-4 text-brand-400" />
        ) : (
          <User className="w-4 h-4 text-dark-300" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl",
          isBot
            ? "bg-dark-800 rounded-tl-none"
            : "bg-brand-600 rounded-tr-none"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}
