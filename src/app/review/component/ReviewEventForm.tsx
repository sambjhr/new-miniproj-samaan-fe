"use client";

import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { toast } from "sonner";

import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StarRating from "./StarRating";

const schema = z.object({
  transaction_id: z.string().uuid(),
  event_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Comment minimal 3 karakter."),
});

type Form = z.infer<typeof schema>;

type Props = {
  transactionId: string;
  eventId: string;
  eventTitle: string;
  organizerName?: string; // opsional (kalau mau ditampilkan)
  onSuccess?: () => void;
};

export default function ReviewEventForm({
  transactionId,
  eventId,
  eventTitle,
  organizerName,
  onSuccess,
}: Props) {
  const { data: session } = useSession();
  const qc = useQueryClient();

  const token = useMemo(() => {
    return (
      (session as any)?.user?.accessToken ||
      (session as any)?.accessToken ||
      (session as any)?.token
    );
  }, [session]);

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      transaction_id: transactionId,
      event_id: eventId,
      rating: 5,
      comment: "",
    },
    mode: "onChange",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: Form) => {
      if (!token) throw new Error("No access token. Please login again.");
      await axiosInstance.post("/reviews", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: async () => {
      toast.success("Review berhasil dikirim.");
      await qc.invalidateQueries({ queryKey: ["my-transactions"] }); 
      onSuccess?.();
      form.reset({ ...form.getValues(), comment: "" });
    },
    onError: (err: unknown) => {
      const ax = err as AxiosError<{ message?: string }>;
      toast.error(
        ax?.response?.data?.message ??
          (err instanceof Error ? err.message : "Gagal submit review.")
      );
    },
  });

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
      <h3 className="text-2xl font-bold text-slate-900">Review Event</h3>
      <p className="mt-1 text-slate-600">
        <span className="font-semibold">{eventTitle}</span>
        {organizerName ? ` • ${organizerName}` : null}
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={form.handleSubmit(async (data) => mutateAsync(data))}
      >
        <div className="space-y-2">
          <p className="font-semibold text-slate-900">Rating</p>
          <Controller
            name="rating"
            control={form.control}
            render={({ field }) => (
              <StarRating
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
            )}
          />
          {form.formState.errors.rating && (
            <p className="text-sm text-red-600">
              {form.formState.errors.rating.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-slate-900">Comment</p>
          <Input
            value={form.watch("comment")}
            onChange={(e) =>
              form.setValue("comment", e.target.value, { shouldValidate: true })
            }
            placeholder="Tulis pengalaman kamu..."
            disabled={isPending}
          />
          {form.formState.errors.comment && (
            <p className="text-sm text-red-600">
              {form.formState.errors.comment.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={!form.formState.isValid || isPending}
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}