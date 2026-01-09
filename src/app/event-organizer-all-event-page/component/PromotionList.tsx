"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import PromotionCard, { Promotion } from "./PromotionCard";

type ApiResponse = {
  message: string;
  data: Promotion[];
};

type Props = {
  organizerId: number;
};

const PromotionList = ({ organizerId }: Props) => {
  const { data, isPending } = useQuery({
    queryKey: ["promotions", organizerId],
    enabled: Boolean(organizerId),
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse>(
        `/promotions/organizer/${organizerId}`
      );
      return res.data.data;
    },
  });

  const promotions = data ?? [];
  const [startIndex, setStartIndex] = React.useState(0);

  React.useEffect(() => {
    setStartIndex(0);
  }, [organizerId]);

  React.useEffect(() => {
    if (promotions.length <= 2) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 2) % promotions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  const visiblePromos = React.useMemo(() => {
    if (promotions.length <= 2) return promotions;
    return [
      promotions[startIndex],
      promotions[(startIndex + 1) % promotions.length],
    ];
  }, [promotions, startIndex]);

  if (isPending) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center font-semibold">Loading promotions...</p>
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-slate-600">
          Belum ada promotion dari organizer ini.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid auto-rows-fr grid-cols-1 gap-8 p-4 md:grid-cols-2">
      {visiblePromos.map((promo) => (
        <PromotionCard key={promo.coupon_id} promo={promo} />
      ))}
    </div>
  );
};

export default PromotionList;