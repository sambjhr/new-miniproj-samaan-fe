"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { PageableResponse } from "@/types/pagination";
import { Event } from "@/types/events";

type Props = {
  organizer_id: number;
};

export const OrganizerCard = ({ organizer_id }: Props) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["organizer-card", organizer_id],
    enabled: Number.isFinite(organizer_id) && organizer_id > 0,
    queryFn: async () => {
      // ambil 1 event aja buat “numpang” data organizer
      const res = await axiosInstance.get<PageableResponse<Event>>("/events", {
        params: { page: 1, take: 1, organizer_id },
      });
      return res.data;
    },
  });

  const firstEvent = data?.data?.[0];
  const organizer = firstEvent?.organizers;

  const organizerName = organizer?.organization_name ?? "Unknown Organizer";

  const organizerImage =
    organizer?.user?.profile_image && organizer.user.profile_image.trim().length > 0
      ? organizer.user.profile_image
      : "/profpic-pengganti.png";

  const avgRatingNum = useMemo(() => {
    const n = Number(organizer?.average_rating ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [organizer?.average_rating]);

  const totalReviews = organizer?.total_reviews ?? 0;
  const totalEvents = data?.meta?.total ?? 0;

  if (isPending) {
    return (
      <div className="flex w-full max-w-8xl items-stretch gap-6 rounded-3xl bg-white p-6 shadow-xl shadow-blue-300">
        <div className="h-40 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="h-7 w-72 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
          <div className="h-5 w-56 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  if (isError || !organizer) {
    return (
      <div className="w-full rounded-3xl bg-white p-6 shadow-xl shadow-blue-300">
        <p className="font-semibold text-slate-900">Organizer tidak ditemukan.</p>
        <p className="text-sm text-slate-600">
          Pastikan organizer_id valid dan organizer punya event.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-8xl items-stretch gap-6 rounded-3xl border-white bg-white p-6 shadow-xl shadow-blue-300">
      {/* LEFT: image 1:1 */}
      <div className="w-40 shrink-0">
        <div className="aspect-square w-full overflow-hidden rounded-full border bg-slate-100">
          <img
            src={organizerImage}
            alt="Organizer image"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-3xl font-extrabold text-slate-900">
          {organizerName}
        </h1>

        {/* rating */}
        <div className="mt-2 flex items-center">
          <svg
            className="h-5 w-5 text-yellow-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
          </svg>

          <p className="ms-2 text-sm font-bold text-slate-900">
            {avgRatingNum.toFixed(2)}
          </p>
          <span className="mx-2 h-1 w-1 rounded-full bg-slate-300" />
          <p className="text-sm font-medium text-slate-900 underline hover:no-underline">
            {totalReviews} reviews
          </p>
        </div>

        <h5 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
          Total jumlah event: {totalEvents}
        </h5>
      </div>
    </div>
  );
};