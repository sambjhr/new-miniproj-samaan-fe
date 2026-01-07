import { Event } from "@/types/events";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Link href={`/event/${event.slug}`}>
      <div className="flex h-full flex-col gap-2 rounded-xl border border-gray-100 p-3 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
        <div className="relative h-40 w-full overflow-hidden rounded-lg">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 25vw"
          />
        </div>

        <p className="w-fit rounded-sm bg-blue-800 px-4 text-sm text-white">
          {event.categories?.category_name ?? `Category #${event.category_id}`}
        </p>

        <h2 className="line-clamp-2 text-xl font-bold">{event.title}</h2>

        <p className="text-lg">
          {format(new Date(event.start_date), "dd MMM yyyy")} -{" "}
          {event.organizers.organization_name}
        </p>

        <p className="line-clamp-3">{event.description}</p>
      </div>
    </Link>
  );
};

export default EventCard;
