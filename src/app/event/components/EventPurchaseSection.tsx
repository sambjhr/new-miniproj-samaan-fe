"use client";

import axiosInstance from "@/lib/axios";
import type { Event, Ticket } from "@/types/events";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import TransactionDetail from "../../transactions/components/TransactionDetail";
import TicketTypeList from "./EventTicketTypesList";
import OrderSummary, { OrderSummaryItem } from "./OrderSummary";
import { TicketLine, TransactionDetailData } from "../../transactions/types";

type AppliedPromo = {
  coupon_id: string;
  code: string;
  discount_name: string;
  discount_amount: number;
  expires_at: string;
  event_id: string;
};

function toNumberPrice(price: string | number) {
  return typeof price === "number" ? price : Number(price);
}

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

type Props = {
  event: Pick<Event, "event_id" | "title" | "start_date" | "image">;
  tickets: Ticket[];
};

export default function EventPurchaseSection({ event, tickets }: Props) {
  const { data: session } = useSession();

  // qty per ticket_id
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  // promo
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

  // points toggle
  const [usePoints, setUsePoints] = useState(false);

  // modal transaction
  const [openTrx, setOpenTrx] = useState(false);
  const [trx, setTrx] = useState<TransactionDetailData | null>(null);

  const token =
    (session as any)?.user?.accessToken ||
    (session as any)?.accessToken ||
    (session as any)?.token;

  // ambil saldo points user (kalau belum login -> 0)
  const { data: pointsBalance = 0 } = useQuery({
    queryKey: ["points-balance"],
    enabled: Boolean(token),
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: { points_balance: number } }>(
        "/points/balance",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return Number(res.data?.data?.points_balance ?? 0);
    },
  });

  const setQty = (ticketId: string, nextQty: number) => {
    setQtyMap((prev) => ({ ...prev, [ticketId]: nextQty }));
  };

  const selectedLines = useMemo(() => {
    return tickets
      .map((t) => {
        const qty = qtyMap[t.ticket_id] ?? 0;
        const price = toNumberPrice(t.price);
        return { t, qty, price, lineTotal: qty * price };
      })
      .filter((x) => x.qty > 0);
  }, [tickets, qtyMap]);

  const subtotal = useMemo(() => {
    return selectedLines.reduce((acc, x) => acc + x.lineTotal, 0);
  }, [selectedLines]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    return Math.max(0, Math.min(subtotal, appliedPromo.discount_amount));
  }, [appliedPromo, subtotal]);

  // total setelah promo (sebelum points)
  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  //  pointsUsed (rupiah) hanya kalau toggle ON
  const pointsUsed = useMemo(() => {
    if (!usePoints) return 0;
    return Math.max(0, Math.min(pointsBalance, total));
  }, [usePoints, pointsBalance, total]);

  //  total final setelah points (untuk display modal)
  const totalAfterPoints = useMemo(() => {
    return Math.max(0, total - pointsUsed);
  }, [total, pointsUsed]);

  const items: OrderSummaryItem[] = useMemo(() => {
    return selectedLines.map((x) => ({
      label: `${x.qty}x ${x.t.name}`,
      value: formatIDR(x.lineTotal),
    }));
  }, [selectedLines]);

  const applyPromo = async () => {
    setPromoError(null);

    const code = promoCode.trim();
    if (!code) return;

    if (subtotal <= 0) {
      setPromoError("Pilih tiket dulu sebelum memakai promo.");
      return;
    }

    try {
      setPromoLoading(true);
      const res = await axiosInstance.get<{
        message: string;
        data: AppliedPromo;
      }>("/promotions/validate", {
        params: { code, event_id: event.event_id },
      });

      setAppliedPromo(res.data.data);
      toast.success(`Promo applied: ${res.data.data.code}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Failed to apply promo.";
      setAppliedPromo(null);
      setPromoError(msg);
      toast.error(msg);
    } finally {
      setPromoLoading(false);
    }
  };

  const clearPromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
    setPromoCode("");
  };

  const onCheckout = () => {
    if (selectedLines.length === 0) {
      toast.error("Pilih minimal 1 tiket dulu.");
      return;
    }

    // kalau user belum login tapi toggle points ON -> matikan
    if (!token && usePoints) {
      setUsePoints(false);
      toast.error("Login dulu untuk memakai points.");
      return;
    }

    const ticketsForModal: TicketLine[] = selectedLines.map((x) => ({
      name: `${x.qty}x ${x.t.name}`,
      price: formatIDR(x.lineTotal),
    }));

    const first = selectedLines[0];

    const newTrx: TransactionDetailData = {
      id: "DRAFT",
      eventName: event.title,
      eventDate: event.start_date,
      status: "DRAFT",
      tickets: ticketsForModal,

      // total tampilkan setelah potong points
      total: formatIDR(totalAfterPoints),
      image: event.image,
      dateline: "(jika belum bayar)",

      // payload create trx (untuk TransactionDetail)
      event_id: event.event_id,
      ticket_id: first.t.ticket_id,
      qty: first.qty,
      coupon_id: appliedPromo?.coupon_id,
      points_used: usePoints ? pointsUsed : 0,
    };

    setTrx(newTrx);
    setOpenTrx(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* LEFT */}
        <div className="w-full">
          <TicketTypeList tickets={tickets} qtyMap={qtyMap} setQty={setQty} />
        </div>

        {/* RIGHT */}
        <div className="w-full">
          <div className="sticky top-24">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              discount={discount}
              total={total} // total sebelum points (OrderSummary yang hitung totalAfterPoints)
              promoCode={promoCode}
              onPromoCodeChange={(v) => {
                setPromoCode(v);
                setPromoError(null);
                if (appliedPromo) setAppliedPromo(null);
              }}
              onApplyPromo={applyPromo}
              onClearPromo={clearPromo}
              promoLoading={promoLoading}
              promoError={promoError}
              appliedPromo={
                appliedPromo
                  ? {
                      code: appliedPromo.code,
                      discount_name: appliedPromo.discount_name,
                    }
                  : null
              }
              // points props
              pointsBalance={pointsBalance}
              usePoints={usePoints}
              pointsUsed={pointsUsed}
              onToggleUsePoints={(next) => {
                // kalau belum login, jangan boleh ON
                if (next && !token) {
                  toast.error("Login dulu untuk memakai points.");
                  setUsePoints(false);
                  return;
                }
                setUsePoints(next);
              }}
              onCheckout={onCheckout}
              checkoutDisabled={selectedLines.length === 0}
            />
          </div>
        </div>
      </div>

      <TransactionDetail
        open={openTrx}
        onClose={() => setOpenTrx(false)}
        trx={trx}
      />
    </>
  );
}
