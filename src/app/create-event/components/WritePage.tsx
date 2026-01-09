"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Category } from "@/types/category";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { ApiError } from "next/dist/server/api-utils";
import { z } from "zod";
import { AxiosError } from "axios";

const ticketSchema = z.object({
  name: z.string().min(1, "Ticket name is required."),
  price: z.coerce.number().min(0, "Price must be 0 or more."),
  quota: z.coerce.number().int().min(1, "Quota must be at least 1."),
});

const formSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    category_id: z.coerce.number().int().min(1, "Category is required."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    location: z.string().min(1, "Location is required."),
    image: z.instanceof(File, { message: "Image is required." }),
    tickets: z.array(ticketSchema).min(1, "At least 1 ticket type is required."),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;

function toISOFromDatetimeLocal(value: string) {
  // value biasanya "YYYY-MM-DDTHH:mm"
  // new Date(value) menganggap local time lalu convert ke ISO
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value; // fallback
  return d.toISOString();
}

const WritePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoryError,
    error: categoryError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories");
      return (res.data.data ?? []) as Category[];
    },
  });

  const form = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category_id: 0,
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      image: undefined,
      tickets: [{ name: "", price: 0, quota: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tickets",
  });

  const { mutateAsync: write, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      console.log('ini isi data', data) 
      const token = (session as any)?.user?.accessToken;
      if (!token) throw new ApiError(401, "No access token. Please login again.");

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("start_date", toISOFromDatetimeLocal(data.startDate));
      formData.append("end_date", toISOFromDatetimeLocal(data.endDate));
      formData.append("location", data.location);
      formData.append("image", data.image);
      formData.append("category_id", String(data.category_id));

      // tickets dikirim sebagai string JSON (backend kamu parse JSON)
      formData.append("tickets", JSON.stringify(data.tickets));

      await axiosInstance.post("/events", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Create Event success!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? "Something went wrong!");
    },
  });

  async function onSubmit(data: FormValues) {
    await write(data);
  }

  return (
    <div className="container mx-auto max-w-5xl p-4">
      <form id="form-write" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Title */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="title">Event Name</FieldLabel>
                <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid ? "true" : "false"}
                  placeholder="Enter your event name here!"
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Category Dropdown */}
          <Controller
            name="category_id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="category_id">Category</FieldLabel>

                <select
                  id="category_id"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2"
                  value={Number(field.value || 0)}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  aria-invalid={fieldState.invalid ? "true" : "false"}
                  disabled={isLoadingCategories || isCategoryError}
                >
                  <option value={0} disabled>
                    {isLoadingCategories
                      ? "Loading categories..."
                      : isCategoryError
                        ? "Failed to load categories"
                        : "Select category"}
                  </option>

                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>

                {isCategoryError ? (
                  <p className="mt-1 text-sm text-red-600">
                    {(categoryError as any)?.message ?? "Error fetching categories"}
                  </p>
                ) : null}

                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  aria-invalid={fieldState.invalid ? "true" : "false"}
                  placeholder="Short description"
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Start & End Date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                  <Input
                    {...field}
                    id="startDate"
                    type="datetime-local"
                    aria-invalid={fieldState.invalid ? "true" : "false"}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="endDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="endDate">End Date</FieldLabel>
                  <Input
                    {...field}
                    id="endDate"
                    type="datetime-local"
                    aria-invalid={fieldState.invalid ? "true" : "false"}
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          {/* location */}
          <Controller
            name="location"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  {...field}
                  id="location"
                  aria-invalid={fieldState.invalid ? "true" : "false"}
                  placeholder="Location - exp: Jakarta"
                />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* IMAGE */}
          <Controller
            name="image"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="image">Thumbnail Image</FieldLabel>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  aria-invalid={fieldState.invalid}
                    placeholder="Your thumbnail"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        field.onChange(file);
                      }
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

          {/* Tickets */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel>Types of Ticket</FieldLabel>

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", price: 0, quota: 1 })}
                className="gap-2"
              >
                <Plus size={16} />
                Add Ticket
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              {fields.map((f, index) => (
                <div
                  key={f.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Ticket #{index + 1}</p>

                    {fields.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                        Remove
                      </Button>
                    ) : null}
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                    {/* Ticket Name */}
                    <Controller
                      name={`tickets.${index}.name`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Ticket Name</FieldLabel>
                          <Input {...field} placeholder="VIP / Regular / etc" />
                          {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {/* Price */}
                    <Controller
                      name={`tickets.${index}.price`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Price</FieldLabel>
                          <Input
                            type="number"
                            min={0}
                            placeholder="100000"
                            value={Number(field.value ?? 0)}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                          {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    {/* Quota */}
                    <Controller
                      name={`tickets.${index}.quota`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Quota</FieldLabel>
                          <Input
                            type="number"
                            min={1}
                            placeholder="100"
                            value={Number(field.value ?? 1)}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                          {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Field>

          {/* Submit Button */}
          <Field className="w-fit">
            <Button type="submit" form="form-write" disabled={isPending}>
              {isPending ? "Loading..." : "Submit"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default WritePage;
