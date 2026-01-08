"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchBarProps = {
  value?: string;
  onChange?: (v: string) => void;
  onSearch?: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value = "",
  onChange,
  onSearch,
  placeholder = "Search for Event",
  className = "",
}: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(value);
      }}
      className={`${className}`}
    >
      <div className="relative items-center container mx-auto max-w-180">
        <Input
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 rounded-full bg-white border border-blue px-5 pr-12 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-600/25"
        />

        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-slate-500" />
        </button>
      </div>
    </form>
  );
}