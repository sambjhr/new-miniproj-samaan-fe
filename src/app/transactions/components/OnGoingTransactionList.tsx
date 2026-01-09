"use client";

import axiosInstance from "@/lib/axios";
import { PageableResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";

import OnGoingTransactionCard, { OnGoingTransaction } from "./OnGoingTransactionCard";
import PaginationSection from "@/components/ui/PaginationSection";

type Props = {
  onSelect: (trx: OnGoingTransaction) => void;
  take?: number;
};

type ApiTransactionRow = {
  transaction_id: string;
  event_id: string;
  status: string;
  payment_deadline: string | null;
  confirmation_deadline: string | null;
  created_at: string;
  events?: {
    title: string;
    start_date: string;
    image: string;
  } | null;
  computed?: {
    total_price: number;
  };
};

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function mapDbStatusToUi(status: string) {
  if (status === "WAITING_FOR_PAYMENT") return "To Pay";
  if (status === "WAITING_FOR_CONFIRMATION") return "To Confirm";
  if (status === "PAID") return "My Booking";
  if (status === "WAITING_FOR_REVIEW") return "To Rate";
  if (status === "REVIEW_DONE") return "My Booking";
  if (status === "EXPIRED") return "Expired";
  if (status === "CANCELED") return "Canceled";
  if (status === "REJECT") return "Rejected";
  return status;
}

export default function OnGoingTransactionList({ onSelect, take = 3 }: Props) {
  const { data: session } = useSession();

  const token = useMemo(() => {
    return (
      (session as any)?.user?.accessToken ||
      (session as any)?.accessToken ||
      (session as any)?.token
    );
  }, [session]);

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault(""));

  useEffect(() => {
    setPage(1);
  }, [status]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["my-transactions", page, status, take, token],
    enabled: !!token,
    queryFn: async () => {
      const res = await axiosInstance.get<PageableResponse<ApiTransactionRow>>(
        "/transactions/me", // atau "/transactions" sesuai route kamu
        {
          params: {
            page,
            take,
            status: status || undefined,
            sortBy: "created_at",
            sortOrder: "desc",
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    },
  });

  const mapped: OnGoingTransaction[] =
    data?.data?.map((r) => ({
      id: r.transaction_id,
      eventId: r.event_id,
      eventName: r.events?.title ?? "-",
      eventDate: r.events?.start_date
        ? new Date(r.events.start_date).toLocaleDateString("id-ID")
        : "-",
      price: formatIDR(Number(r.computed?.total_price ?? 0)),
      status: mapDbStatusToUi(r.status),
      dateline: r.payment_deadline
        ? new Date(r.payment_deadline).toLocaleString("id-ID")
        : "(jika belum bayar)",
      image: r.events?.image ?? "/thumbnail.jpeg",
    })) ?? [];

  return (
    <>
      {/*  Active filter bar */}
      {status ? (
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-700">
              Filter status:{" "}
              <span className="font-semibold text-slate-900">{status}</span>
            </p>

            <button
              type="button"
              onClick={() => {
                setStatus("");
                setPage(1);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      ) : null}

      <div className="container mx-auto flex flex-col gap-8 p-4">
        {isPending ? (
          <div className="my-10 text-center">
            <p className="text-xl font-bold">Loading...</p>
          </div>
        ) : null}

        {isError ? (
          <div className="my-10 text-center text-red-600">
            Failed to load transactions.
          </div>
        ) : null}

        {!isPending && mapped.length === 0 ? (
          <div className="my-10 text-center">
            <p className="text-lg font-semibold text-slate-900">
              Tidak ada transaksi.
            </p>
            <p className="mt-2 text-slate-600">Coba pilih status lain.</p>
          </div>
        ) : null}

        {mapped.map((trx) => (
          <OnGoingTransactionCard
            key={String(trx.id)}
            trx={trx}
            onClick={onSelect}
          />
        ))}
      </div>

      {data?.meta ? (
        <PaginationSection meta={data.meta} onClick={(next) => setPage(next)} />
      ) : null}
    </>
  );
}