import Navbar from "@/components/Navbar";
import type { Event } from "@/types/events";
import { cache } from "react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Image from "next/image";
import EventPurchaseSection from "../components/EventPurchaseSection";

interface EventDetailProps {
  params: { slug: string }; 
}

const getEvent = cache(async (slug: string) => {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_API || "http://localhost:8000").replace(
    /\/$/,
    "",
  );

  const url = `${baseUrl}/events/${encodeURIComponent(slug)}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (e: any) {
    console.error("API UNREACHABLE:", url, e?.message ?? e);
    throw new Error(`API unreachable: ${url}`);
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.log("GET EVENT FAILED:", res.status, url, errText);
    return notFound();
  }

  return (await res.json()) as Event;
});

export const generateMetadata = async ({ params }: EventDetailProps) => {
  const { slug } = await params;
  const event = await getEvent(slug);

  return {
    title: event.title,
    description: event.description,
    openGraph: { images: [{ url: event.image }] },
  };
};

export default async function EventDetail({ params }: EventDetailProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  return (
    <div>
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        {/* HEADER */}
        <div className="space-y-3">
          <p className="w-fit rounded-sm bg-blue-800 px-4 text-sm text-white">
            {event.categories?.category_name ?? `Category #${event.category_id}`}
          </p>

          <h1 className="text-5xl font-bold">{event.title}</h1>

          <p className="text-slate-700">
            {format(new Date(event.start_date), "dd MMM yyyy")} -{" "}
            {event.organizers?.organization_name ?? "-"}
          </p>
        </div>

        {/* IMAGE */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="relative h-[320px] w-full overflow-hidden rounded-2xl">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
            />
          </div>
        </div>

        {/* DESC + PURCHASE */}
        <div className="mt-8">
          <p className="font-bold">Description of this event:</p>
          <p className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 text-slate-800">
            {event.description}
          </p>

          <div className="mt-8">
            <EventPurchaseSection
              event={{
                event_id: event.event_id,
                title: event.title,
                start_date: event.start_date,
                image: event.image,
              }}
              tickets={event.tickets ?? []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}