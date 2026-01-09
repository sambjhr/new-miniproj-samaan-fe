"use client";

import React from "react";
import { toast } from "sonner";

export type Promotion = {
  coupon_id: string;
  code: string;
  expires_at: string; // dari backend Date -> string
  image?: string | null;

  events?: {
    title?: string | null;
    start_date?: string;
    end_date?: string;
  } | null;
};

interface PromotionCardProps {
  promo: Promotion;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const PromotionCard = ({ promo }: PromotionCardProps) => {
  const eventTitle = promo.events?.title ?? "Unknown Event";
  const startEvent = formatDate(promo.events?.start_date);
  const endEvent = formatDate(promo.events?.end_date);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      toast.success(`Coupon copied: ${promo.code}`);
    } catch {
      const el = document.createElement("textarea");
      el.value = promo.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      toast.success(`Coupon copied: ${promo.code}`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={doCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") doCopy();
      }}
      className="group relative h-56 w-full cursor-pointer overflow-hidden rounded-xl bg-cover bg-center transition-transform duration-300 hover:scale-[1.01]"
      style={{ backgroundImage: "url('/thumbnail.jpeg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between  text-center p-5 text-white">
        <div className="space-y-2">
          <p className="text-xs">
            Coupon Code For: <br />
            <span className="text-3xl font-bold">{eventTitle}</span>
          </p>

          <div className="text-xs">
            <p>
              Event Time: <br />
              <span className="font-semibold text-xl">
                {startEvent} {" - "} {endEvent}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs opacity-80 text-left">Coupon code</p>
            <p className="text-2xl font-extrabold tracking-wider">
              {promo.code}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // biar tidak double click handler
              doCopy();
            }}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-500 transition hover:bg-white"
          >
            copy our discount here
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
