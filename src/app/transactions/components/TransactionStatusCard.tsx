import Link from "next/link";

export interface TransactionStatus {
  id: number | string;
  name: string;
  icon: string; // path image
  href: string;
}

interface TransactionStatusCardProps {
  status: TransactionStatus;
}

const TransactionStatusCard = ({ status }: TransactionStatusCardProps) => {
  return (
    <Link href={status.href} className="group block">
      <div className="flex h-full flex-col items-center gap-4 rounded-xl p-4 transition hover:shadow-2xl">
        {/* Icon */}
        <div className="h-30 w-30 overflow-hidden rounded-full bg-white flex items-center justify-center">
          <img
            src={status.icon}
            alt={status.name}
            className="h-14 w-14 object-contain"
          />
        </div>

        {/* Label */}
        <p className="text-base font-medium text-slate-900">
          {status.name}
        </p>
      </div>
    </Link>
  );
};

export default TransactionStatusCard;