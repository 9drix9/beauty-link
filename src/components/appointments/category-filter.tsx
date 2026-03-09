"use client";

import { cn } from "@/lib/utils";
import { SERVICE_CATEGORIES } from "@/lib/constants";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200",
          selected === null
            ? "bg-gray-900 text-white shadow-sm"
            : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        )}
      >
        All
      </button>
      {SERVICE_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value === selected ? null : cat.value)}
          className={cn(
            "whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200",
            selected === cat.value
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
