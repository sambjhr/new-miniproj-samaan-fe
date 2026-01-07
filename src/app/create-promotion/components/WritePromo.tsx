"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { Event } from "@/types/events";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { AxiosError } from "axios";
import { useSession } from "next-auth/react";

function toISOFromDatetimeLocal(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString();
}

const formSchema = z.object({
  code: z.string().min(1, "Code is required."),
  discount_name: z.string().min(1, "Promotion name is required."),
  discount_amount: z.coerce.number().min(1, "Discount amount must be >= 1."),
  quota: z.coerce.number().int().min(1, "Quota must be >= 1."),
  expires_at: z.string().min(1, "Expires date is required."),
  event_id: z.string().uuid("Event ID must be a UUID."),
  image: z.instanceof(File, { message: "Image is required." }),
});

type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;

export default function WritePromoPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discount_name: "",
      discount_amount: 10000,
      quota: 10,
      expires_at: "",
      event_id: "",
      image: undefined,
    },
  });

  const {
    data: eventOptions,
    isPending: isEventsPending,
    isError: isEventsError,
  } = useQuery({
    queryKey: ["events-dropdown"],
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: Event[] }>("/events", {
        params: { page: 1, take: 100 },
      });

      return res.data.data;
    },
  });

  const { mutateAsync: createPromo, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const token = (session as any)?.user?.accessToken;
      if (!token) throw new Error("No access token. Please login again.");

      const fd = new FormData();
      fd.append("code", data.code);
      fd.append("discount_name", data.discount_name);
      fd.append("discount_amount", String(data.discount_amount));
      fd.append("quota", String(data.quota));
      fd.append("expires_at", toISOFromDatetimeLocal(data.expires_at));
      fd.append("event_id", data.event_id);
      fd.append("image", data.image);

      await axiosInstance.post("/promotions", fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast.success("Promotion created successfully!");
      router.push("/");
    },
    onError: (err: AxiosError<{ message: string }> | any) => {
      toast.error(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to create promotion.",
      );
    },
  });

  async function onSubmit(data: FormValues) {
    await createPromo(data);
  }

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Code</FieldLabel>
                <Input {...field} placeholder="DISCOUNT10" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="discount_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Promotion Name</FieldLabel>
                <Input {...field} placeholder="Diskon Tahun Baru" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="discount_amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Discount Amount</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  value={Number(field.value ?? 0)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="quota"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Quota</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  value={Number(field.value ?? 1)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="event_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Event Name</FieldLabel>

                <select
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isEventsPending || isEventsError}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-600/25 disabled:bg-slate-100"
                >
                  <option value="">
                    {isEventsPending
                      ? "Loading events..."
                      : isEventsError
                        ? "Failed to load events"
                        : "Select an event"}
                  </option>

                  {(eventOptions ?? []).map((ev) => (
                    <option key={ev.event_id} value={ev.event_id}>
                      {ev.title}
                    </option>
                  ))}
                </select>

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="expires_at"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Expires At</FieldLabel>
                <Input {...field} type="datetime-local" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Image</FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) field.onChange(file);
                  }}
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Field className="w-fit">
            <Button
              type="submit"
              disabled={isPending || !form.watch("event_id")}
            >
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
