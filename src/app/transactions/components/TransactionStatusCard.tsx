"use client";

import { cn } from "@/lib/utils";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

export interface TransactionStatus {
  id: number | string;
  name: string;
  icon: string;
  value: "to-pay" | "to-confirm" | "my-booking" | "to-rate"; 
}

interface Props {
  status: TransactionStatus;
}

export default function TransactionStatusCard({ status }: Props) {
  const [selected, setSelected] = useQueryState(
    "status",
    parseAsString.withDefault("")
  );
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const isActive = selected === status.value;

  return (
    <button
      type="button"
      onClick={() => {
        // toggle: klik lagi = clear filter
        const next = isActive ? "" : status.value;
        setSelected(next);
        setPage(1);
      }}
      className="group block w-full"
    >
      <div
        className={cn(
          "flex h-full flex-col items-center gap-4 rounded-xl border p-4 transition hover:shadow-2xl",
          isActive ? "border-blue-200 ring-2 ring-blue-600/20" : "border-blue-200"
        )}
      >
        <div className="flex h-30 w-30 items-center justify-center overflow-hidden rounded-full bg-white">
          <img
            src={status.icon}
            alt={status.name}
            className="h-14 w-14 object-contain"
          />
        </div>

        <p className="text-base font-medium text-slate-900">{status.name}</p>
      </div>
    </button>
  );
}