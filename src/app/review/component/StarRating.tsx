"use client";

import React from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
};

export default function StarRating({ value, onChange, disabled }: Props) {
  const [hover, setHover] = React.useState<number | null>(null);
  const displayValue = hover ?? value;

  return (
    <div className="flex items-center gap-1">
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
            className={`text-2xl leading-none ${
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
            aria-label={`Rate ${star}`}
          >
            <span className={active ? "text-yellow-500" : "text-slate-300"}>
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
}