"use client";

import axiosInstance from "@/lib/axios";
import { Event } from "@/types/events";
import { PageableResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useDebounceValue } from "usehooks-ts";

import { Input } from "../../../components/ui/input";
import PaginationSection from "../../../components/ui/PaginationSection";
import EventCard from "@/app/browse-event/components/EventCard";

type Props = {
  take?: number; // default 3
  showSearch?: boolean; // default true
  organizer_id?: number; // ✅ filter by organizer
};

const EventList = ({ take = 3, showSearch = true, organizer_id }: Props) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });

  // kategori diambil dari query string: /browse-event?category=5
  const [category, setCategory] = useQueryState(
    "category",
    parseAsInteger.withDefault(0),
  );

  const [debouncedValue] = useDebounceValue(search, 500);

  const { data: events, isPending } = useQuery({
    // ✅ organizer_id masuk queryKey biar cache aman
    queryKey: ["events", page, debouncedValue, category, take, organizer_id],
    queryFn: async () => {
      const params: Record<string, any> = {
        page,
        take,
        search: debouncedValue,
      };

      if (category && category > 0) params.category_id = category;
      if (organizer_id && organizer_id > 0) params.organizer_id = organizer_id;

      const res = await axiosInstance.get<PageableResponse<Event>>("/events", {
        params,
      });

      return res.data;
    },
  });

  const onClickPagination = (nextPage: number) => {
    setPage(nextPage);
  };

  const clearCategory = () => {
    setCategory(0);
    setPage(1);
  };

  return (
    <div className="w-full py-4">
      {/* Search + Active Filter */}
      {showSearch ? (
        <div className="container mx-auto max-w-180 space-y-4 px-4">
          <div className="relative">
            <Input
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search for event..."
              className="h-12 w-full rounded-full border border-blue-200 bg-white px-5 pr-12 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-600/25"
              value={search}
            />

            <button
              type="button"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full hover:bg-slate-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          {/* filter kategori aktif */}
          {category > 0 ? (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-sm text-slate-700">
                Filter category:{" "}
                <span className="font-semibold text-slate-900">
                  Category #{category}
                </span>
              </p>

              <button
                type="button"
                onClick={clearCategory}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* List */}
      <div className="container mx-auto grid auto-rows-fr grid-cols-1 items-stretch gap-8 px-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {isPending ? (
          <div className="col-span-3 my-16 text-center">
            <p className="text-xl font-bold">Loading...</p>
          </div>
        ) : null}

        {!isPending && (events?.data?.length ?? 0) === 0 ? (
          <div className="col-span-3 my-16 text-center">
            <p className="text-lg font-semibold text-slate-900">
              Tidak ada event yang cocok.
            </p>
            <p className="mt-2 text-slate-600">
              Coba ganti kata kunci atau clear filter kategori.
            </p>
          </div>
        ) : null}

        {events?.data?.map((event) => (
          <EventCard key={event.event_id} event={event} />
        ))}
      </div>

      {/* Pagination */}
      {events?.meta ? (
        <div className="container mx-auto px-4 pt-6">
          <PaginationSection meta={events.meta} onClick={onClickPagination} />
        </div>
      ) : null}
    </div>
  );
};

export default EventList;