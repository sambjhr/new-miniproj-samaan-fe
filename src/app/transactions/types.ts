export interface TicketLine {
  name: string;
  price: string; // formatted "Rp..."
};

export interface TransactionDetailData {
  id: string | number; // uuid after create, "DRAFT" before create

  eventName: string;
  eventDate: string;

  status: string; // "DRAFT" or mapped UI status

  dateline?: string;
  tickets: TicketLine[];
  total: string;
  image?: string;

  /** ==== payload for create transaction ==== */
  event_id?: string;
  ticket_id?: string;
  qty?: number;
  coupon_id?: string;
  points_used?: number;
};
