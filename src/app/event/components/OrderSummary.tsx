"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type OrderSummaryItem = {
  label: string; 
  value: string; 
};

type Props = {
  items: OrderSummaryItem[];

  subtotal: number;
  discount: number; 
  total: number; 

  // promo
  promoCode: string;
  onPromoCodeChange: (v: string) => void;
  onApplyPromo: () => void;
  onClearPromo: () => void;
  promoLoading?: boolean;
  promoError?: string | null;
  appliedPromo?: {
    code: string;
    discount_name?: string;
  } | null;

  // points
  pointsBalance?: number; 
  usePoints?: boolean; 
  pointsUsed?: number; 
  onToggleUsePoints?: (next: boolean) => void;

  onCheckout: () => void;
  checkoutDisabled?: boolean;
};

function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPoints(value: number) {
  // tampilkan 10000 -> 10.000
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderSummary({
  items,
  subtotal,
  discount,
  total,

  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  onClearPromo,
  promoLoading = false,
  promoError = null,
  appliedPromo = null,

  pointsBalance = 0,
  usePoints = false,
  pointsUsed = 0,
  onToggleUsePoints,

  onCheckout,
  checkoutDisabled = false,
}: Props) {
  const hasItems = items.length > 0;

  // estimasi points yang didapat kalau tidak pakai points (baru benar-benar masuk setelah status PAID)
  const estimatedEarnPoints = Math.floor(Math.max(0, total) / 1000);

  // total final yang ditampilkan (anggap `total` dari parent sudah total setelah diskon,
  // lalu pointsUsed (kalau toggle ON) akan mengurangi lagi).
  const totalAfterPoints = usePoints
    ? Math.max(0, total - Math.max(0, pointsUsed))
    : total;

  const canUsePoints = pointsBalance > 0 && hasItems && total > 0;

  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-8 py-8">
        <h3 className="text-3xl font-bold text-slate-900">Order Summary</h3>

        <div className="mt-6">
          {!hasItems ? (
            <p className="text-slate-500">Belum ada tiket dipilih.</p>
          ) : (
            <div className="space-y-4">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-slate-700"
                >
                  <p>{it.label}</p>
                  <p className="font-medium">{it.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr className="my-6 border-slate-200" />

        {/* Subtotal / Discount / Points */}
        <div className="space-y-3 text-slate-700">
          <div className="flex items-center justify-between text-lg">
            <p>Subtotal :</p>
            <p className="font-medium">{formatIDR(subtotal)}</p>
          </div>

          <div className="flex items-center justify-between text-lg">
            <p>Discount :</p>
            <p className="font-medium text-slate-900">-{formatIDR(discount)}</p>
          </div>

          {/* Points section */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Use Points
                </p>
                <p className="text-sm text-slate-600">
                  Balance:{" "}
                  <span className="font-semibold text-slate-900">
                    {formatPoints(pointsBalance)}
                  </span>{" "}
                  pts
                </p>

                {!usePoints ? (
                  <p className="text-xs text-slate-500">
                    Jika tidak memakai points, kamu akan dapat{" "}
                    <span className="font-semibold text-slate-900">
                      +{formatPoints(estimatedEarnPoints)}
                    </span>{" "}
                    pts setelah transaksi berstatus <b>PAID</b>.
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Points akan mengurangi total pembayaran.
                  </p>
                )}
              </div>

              {/* Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (!onToggleUsePoints) return;
                  if (!canUsePoints) return;
                  onToggleUsePoints(!usePoints);
                }}
                disabled={!onToggleUsePoints || !canUsePoints}
                className={[
                  "relative inline-flex h-7 w-12 flex-none items-center rounded-full transition",
                  !onToggleUsePoints || !canUsePoints
                    ? "bg-slate-200 cursor-not-allowed"
                    : usePoints
                      ? "bg-blue-600"
                      : "bg-slate-300",
                ].join(" ")}
                aria-label="Toggle use points"
              >
                <span
                  className={[
                    "inline-block h-6 w-6 transform rounded-full bg-white shadow transition",
                    usePoints ? "translate-x-5" : "translate-x-1",
                  ].join(" ")}
                />
              </button>
            </div>

            {/* Potongan points (kalau ON) */}
            {usePoints ? (
              <div className="mt-3 flex items-center justify-between text-sm">
                <p className="text-slate-700">Points used:</p>
                <p className="font-semibold text-slate-900">
                  -{formatIDR(Math.max(0, pointsUsed))}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <hr className="my-6 border-slate-200" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-slate-900">Total:</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatIDR(totalAfterPoints)}
          </p>
        </div>

        {/* Promo input */}
        <div className="mt-8">
          <p className="mb-2 text-sm font-semibold text-slate-900">
            Punya promo?
          </p>

          <div className="flex gap-2">
            <Input
              value={promoCode}
              onChange={(e) => onPromoCodeChange(e.target.value)}
              placeholder="Masukkan kode promo (contoh: NEWYEAR10)"
              className="h-11 rounded-xl"
              disabled={promoLoading}
            />

            {!appliedPromo ? (
              <Button
                type="button"
                onClick={onApplyPromo}
                disabled={promoLoading || promoCode.trim().length < 2}
                className="h-11 rounded-xl"
              >
                {promoLoading ? "Applying..." : "Apply"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onClearPromo}
                className="h-11 rounded-xl"
              >
                Clear
              </Button>
            )}
          </div>

          {appliedPromo ? (
            <p className="mt-2 text-sm text-slate-600">
              Promo dipakai:{" "}
              <span className="font-semibold">{appliedPromo.code}</span>
              {appliedPromo.discount_name
                ? ` • ${appliedPromo.discount_name}`
                : ""}
            </p>
          ) : null}

          {promoError ? (
            <p className="mt-2 text-sm text-red-600">{promoError}</p>
          ) : null}
        </div>

        {/* Checkout button */}
        <Button
          type="button"
          onClick={onCheckout}
          disabled={checkoutDisabled}
          className="mt-8 h-12 w-full rounded-full text-lg"
        >
          Check - Out
        </Button>
      </div>
    </aside>
  );
}