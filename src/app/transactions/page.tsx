"use client";

import EventList from "@/app/browse-event/components/EventList";
import Contactus from "@/components/Contactus";
import Navbar from "@/components/Navbar";
import PromotionList from "@/components/ui/PromotionList";
import React from "react";
import { OnGoingTransaction } from "./components/OnGoingTransactionCard";
import OnGoingTransactionList from "./components/OnGoingTransactionList";
import TransactionDetail from "./components/TransactionDetail";
import TransactionStatusCard, { TransactionStatus } from "./components/TransactionStatusCard";
import { TransactionDetailData } from "./types";
import ReviewEventForm from "../review/component/ReviewEventForm";
// import ReviewEventForm from "./components/ReviewEventForm";

const statuses: TransactionStatus[] = [
  { id: 1, name: "To pay", icon: "/gambar/transaction/to-pay.png", value: "to-pay" },
  { id: 2, name: "To Confirm", icon: "/gambar/transaction/admin-confirmation.png", value: "to-confirm" },
  { id: 3, name: "My Booking", icon: "/gambar/transaction/my-booking.png", value: "my-booking" },
  { id: 4, name: "To Rate", icon: "/gambar/transaction/to-rate.png", value: "to-rate" },
];

function MyTransactions() {
  const [openDetail, setOpenDetail] = React.useState(false);
  const [selectedTrx, setSelectedTrx] = React.useState<TransactionDetailData | null>(null);

  const [openReview, setOpenReview] = React.useState(false);
  const [reviewTarget, setReviewTarget] = React.useState<{
    transactionId: string;
    eventId: string;
    eventTitle: string;
    organizerName?: string;
  } | null>(null);

  const handleSelectTrx = (trx: OnGoingTransaction) => {
    const status = (trx.status ?? "").toLowerCase();

    // To Rate -> buka modal review
    if (status === "to rate") {
      setReviewTarget({
        transactionId: String(trx.id),
        eventId: String(trx.eventId),
        eventTitle: trx.eventName,
      });
      setOpenReview(true);
      return;
    }

    // To Pay -> buka modal upload proof
    if (status !== "to pay") return;

    setSelectedTrx({
      id: trx.id,
      eventName: trx.eventName,
      eventDate: trx.eventDate,
      status: trx.status,
      dateline: trx.dateline,
      image: trx.image || "/thumbnail.jpeg",
      tickets: [
        { name: "Tiket vip", price: "Rp100.000,00" },
        { name: "Tiket reguler", price: "Rp100.000,00" },
        { name: "Tiket Konser", price: "Rp100.000,00" },
      ],
      total: "Rp300.000,00",
    });

    setOpenDetail(true);
  };

  return (
    <div>
      <Navbar />

      <div className="container mx-auto space-y-8 pt-10">
        {/* Transaction */}
        <div>
          <h1 className="mx-auto mb-5 p-5 text-4xl font-bold">My Transaction</h1>
          <div className="container mx-auto grid grid-cols-2 items-stretch gap-8 md:grid-cols-4">
            {statuses.map((s) => (
              <TransactionStatusCard key={s.id} status={s} />
            ))}
          </div>
        </div>

        {/* On Going Transaction */}
        <div>
          <h1 className="mx-auto mb-5 p-5 text-4xl font-bold">On Going Transaction</h1>
          <OnGoingTransactionList onSelect={handleSelectTrx} />
        </div>

        <div>
          <h1 className="mx-auto mb-5 p-8 text-4xl font-bold">Mungkin kamu juga tertarik:</h1>
        </div>
        <EventList />

        <div>
          <h1 className="container mx-auto mb-5 p-10 text-4xl font-bold">
            Promo yang sedang berlangsung:
          </h1>
          <PromotionList />
        </div>
      </div>

      <Contactus />

      {openReview && reviewTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpenReview(false);
                  setReviewTarget(null);
                }}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow"
              >
                Close
              </button>
            </div>

            <ReviewEventForm
              transactionId={reviewTarget.transactionId}
              eventId={reviewTarget.eventId}
              eventTitle={reviewTarget.eventTitle}
              organizerName={reviewTarget.organizerName}
              onSuccess={() => {
                setOpenReview(false);
                setReviewTarget(null);
              }}
            />
          </div>
        </div>
      ) : null}

      {/* Modal Transaction Detail */}
      <TransactionDetail
        open={openDetail}
        trx={selectedTrx}
        onClose={() => setOpenDetail(false)}
        onUploaded={(trxId) => console.log("upload success trxId:", trxId)}
      />
    </div>
  );
}

export default MyTransactions;