type TicketTypeCardProps = {
  title: string;
  qty: number;
  priceTitle: string;
  remainingText: string;

  onInc: () => void;
  onDec: () => void;
  disableInc?: boolean;
  disableDec?: boolean;
};

export default function TicketTypesCard({
  title,
  qty,
  priceTitle,
  remainingText,
  onInc,
  onDec,
  disableInc,
  disableDec,
}: TicketTypeCardProps) {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white">
      <div className="flex items-start justify-between px-8 pb-2 pt-8">
        <p className="text-xl font-extrabold text-slate-900">{title}</p>

        <div className="flex items-center gap-6">
          <div className="flex h-14 min-w-[72px] items-center justify-center rounded-xl bg-slate-100">
            <span className="text-xl font-bold text-slate-900">{qty}</span>
          </div>

          <div className="flex h-14 items-center overflow-hidden rounded-xl bg-sky-100/80">
            <button
              type="button"
              onClick={onDec}
              disabled={disableDec}
              className="flex h-14 w-16 items-center justify-center text-3xl text-slate-700 disabled:opacity-40"
              aria-label="Kurangi jumlah"
            >
              −
            </button>

            <div className="h-8 w-px bg-slate-300/70" />

            <button
              type="button"
              onClick={onInc}
              disabled={disableInc}
              className="flex h-14 w-16 items-center justify-center text-3xl text-slate-700 disabled:opacity-40"
              aria-label="Tambah jumlah"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-200" />

      <div className="px-8 pb-5 pt-5">
        <p className="text-xl font-extrabold text-slate-900">{priceTitle}</p>
        <p className="mt-3 text-xl text-slate-500">{remainingText}</p>
      </div>
    </div>
  );
}