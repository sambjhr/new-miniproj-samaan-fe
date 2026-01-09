"use client";

import React from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  sizeClassName?: string; // opsional: misal "w-6 h-6"
};

export default function StarRating({
  value,
  onChange,
  disabled,
  sizeClassName = "w-6 h-6",
}: Props) {
  const [hover, setHover] = React.useState<number | null>(null);
  const displayValue = hover ?? value;

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        const active = star <= displayValue;

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => setHover(null)}
            className={`rounded-sm ${
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
            aria-label={`Rate ${star}`}
          >
            <svg
              className={`${sizeClassName} ${
                active ? "text-yellow-400" : "text-slate-300"
              }`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}