"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";
import PromotionCard, { Promotion } from "./PromotionCard";

type ApiResponse = {
  message: string;
  data: Promotion[];
};

const PromotionList = () => {
  const { data: session } = useSession();

  const token =
    (session as any)?.user?.accessToken ||
    (session as any)?.accessToken ||
    (session as any)?.token;

  const { data, isPending } = useQuery({
    queryKey: ["promotions"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse>("/promotions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
  });

  const promotions = data ?? [];
  const [startIndex, setStartIndex] = React.useState(0);

  React.useEffect(() => {
    if (promotions.length <= 2) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 2) % promotions.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promotions.length]);

  const visiblePromos = React.useMemo(() => {
    if (promotions.length <= 2) return promotions;
    const first = promotions[startIndex];
    const second = promotions[(startIndex + 1) % promotions.length];
    return [first, second];
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
        <p className="text-center text-slate-600">Belum ada promotion.</p>
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