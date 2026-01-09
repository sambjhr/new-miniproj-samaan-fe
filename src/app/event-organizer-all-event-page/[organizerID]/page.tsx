import Navbar from "@/components/Navbar";
import EventList from "../component/EventList";
import PromotionList from "../component/PromotionList";
import { OrganizerCard } from "../component/OrganizerCard";
import Footer from "@/components/Contactus";
import { ReviewList } from "../component/ReviewList";

export default function OrganizerAllEventPage({
  params,
}: {
  params: { organizerID: string };
}) {
  const organizerId = Number(params.organizerID);

  return (
    <div>
      <Navbar />

      <div className="container mx-auto space-y-8 pt-10">
        <OrganizerCard organizer_id={organizerId} />

        <section className="container mx-auto p-6">
        <h2 className="mb-5 p-10 text-center text-4xl font-bold">Latest Reviews</h2>
        <ReviewList organizerId={organizerId} />
      </section>

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

          <PromotionList organizerId={organizerId} />
        </div>
      </div>

      <Footer />
    </div>
  );
}