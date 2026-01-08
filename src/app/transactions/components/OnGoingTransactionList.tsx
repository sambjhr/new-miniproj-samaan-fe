"use client";

import axiosInstance from "@/lib/axios";
import { PageableResponse } from "@/types/pagination";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";

import OnGoingTransactionCard, {
  OnGoingTransaction,
} from "./OnGoingTransactionCard";

import PaginationSection from "@/components/ui/PaginationSection";

type Props = {
  onSelect: (trx: OnGoingTransaction) => void;
  take?: number; // default 5
};

type ApiTransactionRow = {
  transaction_id: string;
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
  const [status] = useQueryState("status", { defaultValue: "" }); // to-pay, to-confirm, my-booking, to-rate

  // ✅ kalau status berubah, reset page biar UX enak
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["my-transactions", page, status, take, token],
    enabled: !!token,
    queryFn: async () => {
      const res = await axiosInstance.get<PageableResponse<ApiTransactionRow>>(
        "/transactions/me",
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
      eventId: r.transaction_id, // kalau kamu butuh event_id, boleh tambahkan di backend select
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

  const onClickPagination = (nextPage: number) => setPage(nextPage);

  return (
    <>
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
            <p className="mt-2 text-slate-600">
              Coba pilih status lain.
            </p>
          </div>
        ) : null}

        {mapped.map((trx) => (
          <OnGoingTransactionCard key={String(trx.id)} trx={trx} onClick={onSelect} />
        ))}
      </div>

      {data?.meta ? (
        <PaginationSection meta={data.meta} onClick={onClickPagination} />
      ) : null}
    </>
  );
}