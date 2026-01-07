export interface OnGoingTransaction {
  id: number | string;
  eventId: number | string;
  eventName: string;
  eventDate: string;
  price: string;
  status: string;
  dateline?: string;
  image?: string;
}

interface OnGoingTransactionCardProps {
  trx: OnGoingTransaction;
  onClick?: (trx: OnGoingTransaction) => void;
}

const OnGoingTransactionCard = ({ trx, onClick }: OnGoingTransactionCardProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(trx)}
      className="group block w-full text-left"
    >
      <div className="w-full rounded-[48px] border border-slate-300 bg-white p-6 transition hover:shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left */}
          <div className="flex items-center gap-6">
            <div className="h-36 w-60 overflow-hidden rounded-2xl bg-slate-200">
              <img
                src={trx.image || "/thumbnail.jpeg"}
                alt={trx.eventName}
                className="block h-full w-full object-cover"
              />
            </div>

            <div className="space-y-2 text-slate-900">
              <p className="text-xl">
                <span className="font-semibold">Transactionid:</span> {trx.id}
              </p>
              <p className="text-xl">{trx.eventName}</p>
              <p className="text-xl">{trx.eventDate}</p>
              <p className="text-xl">{trx.price}</p>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-10 text-right text-slate-900 md:min-w-[260px]">
            <p className="text-xl">
              <span className="font-semibold">Status:</span> {trx.status}
            </p>

            <p className="text-xl">
              <span className="font-semibold">Dateline:</span>{" "}
              {trx.dateline ? trx.dateline : "(jika belum bayar)"}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default OnGoingTransactionCard;