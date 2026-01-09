export type Ticket = {
  ticket_id: string;
  name: string;
  price: string | number; // Prisma Decimal sering jadi string
  stock: number;
  description: string;
};

export type Event = {
  event_id: string;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image: string;
  category_id: number;
  organizer_id: number;

  organizers: {
    organization_name: string;
    average_rating?: string | number | null; // Decimal -> string biasanya
    total_reviews?: number | null;
    user?: {
      profile_image: string | null;
    } | null;

    _count?: {
      events: number;
    };
  };

  categories?: {
    category_name: string;
  };

  tickets?: Ticket[];
};
