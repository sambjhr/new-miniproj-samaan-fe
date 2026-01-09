import Contactus from "@/components/Contactus";
import Navbar from "@/components/Navbar";
import PromotionList from "@/components/ui/PromotionList";
import { OrganizerCard } from "../component/OrganizerCard";
import EventList from "../component/EventList";

export default function OrganizerAllEventPage({
  searchParams,
}: {
  searchParams: { organizer_id?: string };
}) {
  const organizerId = Number(searchParams.organizer_id ?? 0);

  return (
    <div>
      <Navbar />

      <div className="container mx-auto space-y-8 pt-10">
        <OrganizerCard organizer_id={organizerId} />

        <div>
          <h1 className="container mx-auto mb-5 p-10 text-center text-4xl font-bold">
            Our Events
          </h1>
        </div>

        <EventList organizer_id={organizerId} />

        <div>
          <h1 className="container mx-auto mb-5 p-10 text-center text-4xl font-bold">
            Our Promotions
          </h1>
          <PromotionList />
        </div>
      </div>

      <Contactus />
    </div>
  );
}
