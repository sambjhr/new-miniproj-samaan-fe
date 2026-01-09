import Navbar from "@/components/Navbar";
import type { Event } from "@/types/events";
import { cache } from "react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Image from "next/image";
import EventPurchaseSection from "../components/EventPurchaseSection";
import Link from "next/link";

interface EventDetailProps {
  params: { slug: string };
}

const getEvent = cache(async (slug: string) => {
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL_API || "http://localhost:8000"
  ).replace(/\/$/, "");

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
  const organizerName =
    event.organizers?.organization_name ?? "Unknown Organizer";

  const organizerImage =
    event.organizers?.user?.profile_image &&
    event.organizers.user.profile_image.trim().length > 0
      ? event.organizers.user.profile_image
      : "/profpic-pengganti.png";

  const organizer = event.organizers;

  const avgRating = Number(organizer?.average_rating ?? 0);
  const totalReviews = organizer?.total_reviews ?? 0;
  const totalEvents = organizer?._count?.events ?? 0;

  return (
    <div>
      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-4 py-10">
        {/* HEADER */}
        <div className="space-y-3">
          <p className="w-fit rounded-sm bg-blue-800 px-4 text-xl text-white">
            {event.categories?.category_name ??
              `Category #${event.category_id}`}
          </p>

          <h1 className="text-5xl font-bold">{event.title}</h1>

          {/* Event Organizer Card */}
          <Link
            href={`/event-organizer-all-event-page/${event.organizer_id}`}
            className="block"
          >
            <div className="max-w-8xl flex w-full items-stretch gap-6 rounded-3xl border-white bg-white p-6 shadow-xl">
              {/* LEFT: image */}
              <div className="w-40 shrink-0">
                <div className="aspect-square w-full overflow-hidden rounded-full border bg-slate-100">
                  <img
                    src={organizerImage}
                    alt="Organizer image"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* RIGHT: nama EO, Rating, dll */}
              <div className="flex flex-1 flex-col justify-center">
                <h1 className="text-3xl font-extrabold text-slate-900">
                  {organizerName}
                </h1>

                {/* rating */}
                <div className="mt-2 flex items-center">
                  <svg
                    className="h-5 w-5 text-yellow-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                  </svg>

                  <p className="text-m ms-2 font-bold text-slate-900">
                    {avgRating.toFixed(2)}
                  </p>
                  <span className="mx-2 h-1 w-1 rounded-full bg-slate-300" />
                  <p className="text-m font-medium text-slate-900 underline hover:no-underline">
                    {totalReviews} reviews
                  </p>
                </div>

                <h5 className="mt-3 text-xl font-semibold tracking-tight text-slate-900">
                  Total Events: {totalEvents}
                </h5>
              </div>
            </div>
          </Link>
        </div>

        <div className="relative mt-5 h-[320px] w-full overflow-hidden rounded-2xl">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* IMAGE */}

        {/* DESC + PURCHASE */}
        <div className="shadow- mt-8">
          <p className="font-bold">Information of this event:</p>

          <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-4 text-slate-800 shadow-md shadow-blue-200">
            <p className="font-bold text-slate-700">
              {" "}
              Start Date: {format(new Date(event.start_date), "dd MMM yyyy")}
            </p>
            <p className="mt-3">{event.description}</p>
          </div>

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
