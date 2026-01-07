"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { toast } from "sonner";

import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const schema = z.object({
  image: z.instanceof(File, { message: "Bukti pembayaran wajib diupload." }),
});

type Form = z.infer<typeof schema>;

type Props = {
  trxId: string;
  initialStatus?: string;
  onSuccess?: () => void;
  onViewOtherEvent?: () => void;
};

type TrxDetail = {
  transaction_id: string;
  status: string;
  payment_deadline: string;
  confirmation_deadline: string;
  paymentProof: string | null;
};

function msToClock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export default function UploadBuktiBayarCard({
  trxId,
  initialStatus = "To Pay",
  onSuccess,
  onViewOtherEvent,
}: Props) {
  const { data: session } = useSession();

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { image: undefined },
  });

  const selectedFile = form.watch("image");
  const selectedFileName = selectedFile?.name ?? "";

  const token = useMemo(() => {
    return (
      (session as any)?.user?.accessToken ||
      (session as any)?.accessToken ||
      (session as any)?.token
    );
  }, [session]);

  const { data: trx, refetch } = useQuery({
    queryKey: ["trx-detail", trxId],
    enabled: Boolean(token && trxId),
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: TrxDetail }>(`/transactions/${trxId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data;
    },
  });

  // countdown 2 jam berdasarkan payment_deadline
  const [remainMs, setRemainMs] = useState<number>(0);

  useEffect(() => {
    if (!trx?.payment_deadline) return;

    const tick = () => {
      const deadline = new Date(trx.payment_deadline).getTime();
      const now = Date.now();
      setRemainMs(deadline - now);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [trx?.payment_deadline]);

  const isExpired = trx?.status === "EXPIRED" || (trx?.status === "WAITING_FOR_PAYMENT" && remainMs <= 0);
  const canUpload = trx?.status === "WAITING_FOR_PAYMENT" && !isExpired;

  const { mutateAsync: uploadProof, isPending } = useMutation({
    mutationFn: async (file: File) => {
      if (!token) throw new Error("No access token. Please login again.");

      const fd = new FormData();
      fd.append("image", file);

      const res = await axiosInstance.post(
        `/transactions/${encodeURIComponent(trxId)}/payment-proof`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data;
    },
    onSuccess: async () => {
      toast.success("Bukti pembayaran berhasil dikirim.");
      form.reset();
      await refetch(); // status jadi WAITING_FOR_CONFIRMATION
      onSuccess?.();
    },
    onError: (err: unknown) => {
      const ax = err as AxiosError<{ message?: string }>;
      const msg =
        ax?.response?.data?.message ||
        (err instanceof Error ? err.message : "Upload gagal.");
      toast.error(msg);
    },
  });

  const statusText = useMemo(() => {
    if (!trx) return "Loading...";
    if (trx.status === "WAITING_FOR_PAYMENT") return "To Pay";
    if (trx.status === "WAITING_FOR_CONFIRMATION") return "Waiting for confirmation by admin";
    if (trx.status === "PAID") return "Paid";
    if (trx.status === "REJECT") return "Rejected";
    if (trx.status === "CANCELED") return "Canceled";
    if (trx.status === "EXPIRED") return "Expired";
    return trx.status;
  }, [trx]);

  const statusColor =
    trx?.status === "WAITING_FOR_CONFIRMATION" ? "text-green-600" :
    trx?.status === "PAID" ? "text-green-600" :
    trx?.status === "EXPIRED" || trx?.status === "CANCELED" || trx?.status === "REJECT" ? "text-red-600" :
    "text-slate-900";

  return (
    <div className="w-full rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="text-2xl font-bold text-slate-900">Upload Bukti Bayar</h4>

      <p className={`mt-2 text-lg font-semibold ${statusColor}`}>
        Status: {statusText}
      </p>

      {/* countdown 2 jam */}
      {trx?.status === "WAITING_FOR_PAYMENT" ? (
        <p className="mt-2 text-sm text-slate-600">
          Time left to upload proof:{" "}
          <span className={`font-semibold ${remainMs <= 0 ? "text-red-600" : "text-slate-900"}`}>
            {msToClock(remainMs)}
          </span>
        </p>
      ) : null}

      {isExpired ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Transaksi expired karena bukti pembayaran tidak diupload dalam 2 jam.
          Seat & benefit (points/coupon) akan otomatis dikembalikan oleh sistem.
        </div>
      ) : null}

      <div className="mt-6">
        <form
          onSubmit={form.handleSubmit(async (data) => {
            if (!canUpload) {
              toast.error("Tidak bisa upload: status transaksi tidak valid / sudah expired.");
              return;
            }
            await uploadProof(data.image);
          })}
        >
          <FieldGroup>
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="image"
                    className="mx-auto block w-full cursor-pointer rounded-full bg-slate-300 py-4 text-center text-lg font-medium text-slate-900"
                  >
                    Pilih bukti pembayaran
                  </FieldLabel>

                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-invalid={fieldState.invalid ? "true" : "false"}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) field.onChange(file);
                    }}
                    disabled={!canUpload}
                  />

                  {selectedFileName ? (
                    <p className="mt-2 text-center text-sm text-slate-600">
                      Selected: <span className="font-semibold">{selectedFileName}</span>
                    </p>
                  ) : (
                    <p className="mt-2 text-center text-sm text-slate-500">
                      Belum ada file dipilih.
                    </p>
                  )}

                  {fieldState.error ? (
                    <div className="mt-3">
                      <FieldError errors={[fieldState.error]} />
                    </div>
                  ) : null}
                </Field>
              )}
            />

            {trx?.status === "WAITING_FOR_CONFIRMATION" ? (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                Bukti pembayaran sudah masuk. Menunggu konfirmasi organizer/admin.
                Jika tidak diproses dalam 3 hari, transaksi akan otomatis dibatalkan.
              </div>
            ) : null}

            {canUpload ? (
              <Button
                type="submit"
                className="mt-4 w-full rounded-full"
                disabled={!form.formState.isValid || isPending}
              >
                {isPending ? "Submitting..." : "Submit Bukti Bayar"}
              </Button>
            ) : null}

            {/* tombol biru muncul kalau sudah upload / atau trx selesai */}
            {trx?.status !== "WAITING_FOR_PAYMENT" ? (
              <Button
                type="button"
                className="mt-4 w-full rounded-full"
                onClick={onViewOtherEvent}
              >
                View Other Event
              </Button>
            ) : null}
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}