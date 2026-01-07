"use client";

import React from "react";
import PromotionCard, { Promotion } from "./PromotionCard";

const promotions: Promotion[] = [
  { id: 1, eventName: "Music Fest 2025", startDate: "2025-12-20", endDate: "2025-12-22" },
  { id: 2, eventName: "Business Summit", startDate: "2026-01-10", endDate: "2026-01-12" },
  { id: 3, eventName: "Gaming Arena", startDate: "2026-02-01", endDate: "2026-02-03" },
  { id: 4, eventName: "Art Expo", startDate: "2026-03-05", endDate: "2026-03-10" },
];

const PromotionList = () => {
  const [startIndex, setStartIndex] = React.useState(0);

  // auto-rotate tiap 4 detik
  React.useEffect(() => {
    if (promotions.length <= 2) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 2) % promotions.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // ambil 2 item, kalau nyentuh akhir array -> wrap ke awal
  const visiblePromos = React.useMemo(() => {
    if (promotions.length <= 2) return promotions;

    const first = promotions[startIndex];
    const second = promotions[(startIndex + 1) % promotions.length];
    return [first, second];
  }, [startIndex]);

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 auto-rows-fr items-stretch">
      {visiblePromos.map((promo) => (
        <PromotionCard key={promo.id} promo={promo} />
      ))}
    </div>
  );
};

export default PromotionList;