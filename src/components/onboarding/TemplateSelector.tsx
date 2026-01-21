"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Site } from "@/lib/types";

interface TemplateSelectorProps {
  selected: Site["template"];
  onSelect: (template: Site["template"]) => void;
}

const templates: {
  id: Site["template"];
  name: string;
  description: string;
  preview: string;
}[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean and professional. Perfect for established businesses.",
    preview: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek and contemporary with bold typography.",
    preview: "linear-gradient(135deg, #312e81 0%, #0f172a 100%)",
  },
  {
    id: "bold",
    name: "Bold",
    description: "High-impact design that makes a statement.",
    preview: "linear-gradient(135deg, #7f1d1d 0%, #0f172a 100%)",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant. Let your work speak for itself.",
    preview: "linear-gradient(135deg, #374151 0%, #0f172a 100%)",
  },
];

export function TemplateSelector({
  selected,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={cn(
            "relative text-left p-4 rounded-xl border-2 transition-all",
            selected === template.id
              ? "border-brand-500 bg-brand-500/5"
              : "border-dark-700 hover:border-dark-600"
          )}
        >
          {/* Preview */}
          <div
            className="aspect-video rounded-lg mb-3"
            style={{ background: template.preview }}
          />

          {/* Info */}
          <h3 className="font-semibold mb-1">{template.name}</h3>
          <p className="text-sm text-dark-400">{template.description}</p>

          {/* Selected indicator */}
          {selected === template.id && (
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
