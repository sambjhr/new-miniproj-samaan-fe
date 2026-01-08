"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axios";
import UploadBuktiBayarCard from "./UploadBuktiBayarCard";
import { TransactionDetailData } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  trx: TransactionDetailData | null;
  onCreated?: (trx: TransactionDetailData) => void;
  onUploaded?: (trxId: string) => void; 
};

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function mapStatus(status: string) {
  if (status === "WAITING_FOR_PAYMENT") return "To Pay";
  if (status === "WAITING_FOR_CONFIRMATION") return "Waiting for confirmation by admin";
  if (status === "PAID") return "Paid";
  if (status === "REJECT") return "Rejected";
  if (status === "EXPIRED") return "Expired";
  if (status === "WAITING_FOR_REVIEW") return "Waiting for Review";
  if (status === "REVIEW_DONE") return "Review Done";
  return status;
}

export default function TransactionDetail({
  open,
  onClose,
  trx,
  onCreated,
  onUploaded,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  // server trx (after create)
  const [serverTrx, setServerTrx] = useState<TransactionDetailData | null>(null);

  // show UploadBuktiBayarCard after create success
  const [showUploadCard, setShowUploadCard] = useState(false);

  const displayTrx = serverTrx ?? trx;

  // reset when modal closes or trx changes
  useEffect(() => {
    if (!open) {
      setServerTrx(null);
      setShowUploadCard(false);
    }
  }, [open]);

  useEffect(() => {
    setServerTrx(null);
    setShowUploadCard(false);
  }, [trx?.id]);

  const token = useMemo(() => {
    return (
      (session as any)?.user?.accessToken ||
      (session as any)?.accessToken ||
      (session as any)?.token
    );
  }, [session]);

  const isDraft = useMemo(() => {
    if (!displayTrx) return false;
    return (
      displayTrx.status === "DRAFT" ||
      displayTrx.id === "DRAFT" ||
      displayTrx.id === "" ||
      displayTrx.id === 0
    );
  }, [displayTrx]);

  const { mutateAsync: createTransaction, isPending: isCreating } = useMutation({
    mutationFn: async () => {
      if (!displayTrx) throw new Error("No transaction draft data.");
      if (!token) throw new Error("No access token. Please login again.");

      if (!displayTrx.event_id || !displayTrx.ticket_id) {
        throw new Error("event_id / ticket_id belum ada di payload checkout.");
      }

      const payload = {
        event_id: displayTrx.event_id,
        ticket_id: displayTrx.ticket_id,
        qty: displayTrx.qty ?? 1,
        coupon_id: displayTrx.coupon_id,
        points_used: displayTrx.points_used ?? 0,
      };

      const res = await axiosInstance.post("/transactions", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data;

      // computed from backend
      const qty = Number(data?.computed?.qty ?? payload.qty ?? 1);
      const basePrice = Number(data?.computed?.base_price ?? 0);
      const totalPrice = Number(data?.computed?.total_price ?? 0);

      const mapped: TransactionDetailData = {
        id: data?.transaction_id,
        eventName: data?.events?.title ?? displayTrx.eventName,
        eventDate: displayTrx.eventDate,
        status: mapStatus(data?.status ?? "WAITING_FOR_PAYMENT"),
        dateline: data?.payment_deadline
          ? new Date(data.payment_deadline).toLocaleString("id-ID")
          : undefined,
        tickets: [
          {
            name: `${qty}x ${data?.tickets?.name ?? "Ticket"}`,
            price: formatIDR(basePrice * qty),
          },
        ],
        total: formatIDR(totalPrice),
        image: displayTrx.image,
        event_id: payload.event_id,
        ticket_id: payload.ticket_id,
        qty: payload.qty,
        coupon_id: payload.coupon_id,
      };

      return mapped;
    },
    onSuccess: (mapped) => {
      setServerTrx(mapped);
      setShowUploadCard(true);
      onCreated?.(mapped);
      toast.success("Transaction created! Silakan upload bukti pembayaran.");
    },
    onError: (err: unknown) => {
      const ax = err as AxiosError<{ message?: string }>;
      const msg =
        ax?.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to create transaction.");
      toast.error(msg);
    },
  });

  if (!open || !displayTrx) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
      />

      {/* card */}
      <div className="relative z-10 w-full max-w-md rounded-[40px] border border-slate-300 bg-white p-6">
        {/* top image */}
        <div className="h-44 w-full overflow-hidden rounded-2xl bg-slate-200">
          <img
            src={displayTrx.image || "/thumbnail.jpeg"}
            alt={displayTrx.eventName}
            className="block h-full w-full object-cover"
          />
        </div>

        {/* info */}
        <div className="mt-6 space-y-2 text-slate-900">
          <p className="text-xl">
            <span className="font-semibold">Transactionid:</span>{" "}
            {String(displayTrx.id)}
          </p>
          <p className="text-xl">{displayTrx.eventName}</p>
          <p className="text-xl">{displayTrx.eventDate}</p>
        </div>

        <hr className="my-5 border-slate-300" />

        {/* tickets */}
        <div className="text-slate-900">
          <p className="text-2xl font-bold">Jenis Tiket:</p>
          <div className="mt-3 space-y-2">
            {displayTrx.tickets.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xl"
              >
                <p>
                  {idx + 1}. {t.name}
                </p>
                <p>{t.price}</p>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-5 border-slate-300" />

        {/* total */}
        <div className="flex items-center justify-between text-slate-900">
          <p className="text-2xl font-bold">Harga</p>
          <p className="text-2xl">{displayTrx.total}</p>
        </div>

        {/* STEP 1: Create transaction only */}
        {isDraft ? (
          <div className="mt-8">
            <Button
              type="button"
              className="w-full rounded-full"
              onClick={() => createTransaction()}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Transaction"}
            </Button>
            <p className="mt-3 text-center text-sm text-slate-500">
              Ini akan membuat transaksi kamu, lalu muncul form upload bukti pembayaran.
            </p>
          </div>
        ) : null}

        {/* STEP 2: Upload card appears AFTER create */}
        {showUploadCard && serverTrx ? (
          <div className="mt-6">
            <UploadBuktiBayarCard
              trxId={String(serverTrx.id)}
              initialStatus={serverTrx.status} 
              onSuccess={() => {
                onUploaded?.(String(serverTrx.id));
              }}
              onViewOtherEvent={() => {
                onClose();
                router.push("/");
                router.refresh();
              }}
            />
          </div>
        ) : null}

        {/* close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm text-white/90 shadow"
        >
          Close
        </button>
      </div>
    </div>
  );
}