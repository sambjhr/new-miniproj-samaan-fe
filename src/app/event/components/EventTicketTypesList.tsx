"use client";

import TicketTypesCard from "./EventTicketTypesCard";
import type { Ticket } from "@/types/events";

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
  tickets: Ticket[];
  qtyMap: Record<string, number>;
  setQty: (ticketId: string, nextQty: number) => void;
};

const TicketTypeList = ({ tickets, qtyMap, setQty }: Props) => {
  const onInc = (t: Ticket) => {
    const current = qtyMap[t.ticket_id] ?? 0;
    const next = Math.min(current + 1, t.stock);
    setQty(t.ticket_id, next);
  };

  const onDec = (t: Ticket) => {
    const current = qtyMap[t.ticket_id] ?? 0;
    const next = Math.max(current - 1, 0);
    setQty(t.ticket_id, next);
  };

  const subtotal = tickets.reduce((acc, t) => {
    const qty = qtyMap[t.ticket_id] ?? 0;
    return acc + qty * toNumberPrice(t.price);
  }, 0);

  return (
    <div className="flex w-full flex-col">
      {tickets.map((t) => {
        const qty = qtyMap[t.ticket_id] ?? 0;
        const price = toNumberPrice(t.price);

        return (
          <div key={t.ticket_id} className="py-4">
            <TicketTypesCard
              title={t.name}
              qty={qty}
              priceTitle={formatIDR(price)}
              remainingText={`${t.stock} - Ticket Remaining`}
              onInc={() => onInc(t)}
              onDec={() => onDec(t)}
              disableInc={qty >= t.stock}
              disableDec={qty <= 0}
            />
          </div>
        );
      })}

      <p className="mt-2 text-right text-lg font-semibold">
        Subtotal: {formatIDR(subtotal)}
      </p>
    </div>
  );
};

export default TicketTypeList;