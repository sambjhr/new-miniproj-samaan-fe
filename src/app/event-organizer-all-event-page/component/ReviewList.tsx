"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ReviewCard, type Review } from "./ReviewCard";

type ApiResponse = {
  message: string;
  data: Review[];
};

type Props = {
  organizerId: number;
};

export const ReviewList = ({ organizerId }: Props) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["reviews-by-organizer", organizerId],
    enabled: Boolean(organizerId),
    queryFn: async () => {
      const res = await axiosInstance.get<ApiResponse>(
        `/reviews/organizer/${organizerId}`,
        { params: { take: 6 } },
      );
      return res.data.data;
    },
  });

  if (isPending) {
    return <p className="text-center text-slate-600">Loading reviews...</p>;
  }

  if (isError || !data) {
    return <p className="text-center text-red-600">Failed to load reviews.</p>;
  }

  if (data.length === 0) {
    return <p className="text-center text-slate-600">Belum ada review.</p>;
  }

  const reviews = data.slice(0, 6);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {reviews.map((r) => (
        <ReviewCard key={r.review_id} review={r} />
      ))}
    </div>
  );
};
