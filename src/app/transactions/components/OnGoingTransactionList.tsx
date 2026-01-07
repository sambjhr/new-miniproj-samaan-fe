"use client";

import OnGoingTransactionCard, {
  OnGoingTransaction,
} from "./OnGoingTransactionCard";

const dummyTransactions: OnGoingTransaction[] = [
  {
    id: "TRX-0001",
    eventId: 1,
    eventName: "Nama Event",
    eventDate: "Tanggal Event",
    price: "Harga",
    status: "To be confirm",
    dateline: "(jika belum bayar)",
    image: "/thumbnail.jpeg",
  },
  {
    id: "TRX-0002",
    eventId: 2,
    eventName: "Nama Event",
    eventDate: "Tanggal Event",
    price: "Harga",
    status: "To Pay",
    dateline: "(jika belum bayar)",
    image: "/thumbnail.jpeg",
  },
];

type Props = {
  onSelect: (trx: OnGoingTransaction) => void;
};

const OnGoingTransactionList = ({ onSelect }: Props) => {
  return (
    <div className="container mx-auto flex flex-col gap-8 p-4">
      {dummyTransactions.map((trx) => (
        <OnGoingTransactionCard key={trx.id} trx={trx} onClick={onSelect} />
      ))}
    </div>
  );
};

export default OnGoingTransactionList;