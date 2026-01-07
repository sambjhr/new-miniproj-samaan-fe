
import Contactus from "@/components/Contactus";
import Navbar from "@/components/Navbar";
import EventList from "@/app/browse-event/components/EventList";
import PromotionList from "@/components/ui/PromotionList";
import CategoryList from "./components/CategroyList";

function BrowseEvent() {
  return (
    <div>
      <Navbar />

      <div className="container mx-auto space-y-8 pt-10">

        {/* category event */}
        <div>
          <h1 className="container mx-auto mb-5 p-10 text-center text-4xl font-bold">
            Choose what you wanna do!
          </h1>

          <CategoryList />
        </div>

        {/* Featured Event */}
        <div>
          <h1 className="container mx-auto mb-5 p-10 text-center text-4xl font-bold">
            Featured Events
          </h1>
        </div>

        <EventList />

        {/* promotion card */}
        <div>
          <h1 className="container mx-auto mb-5 p-10 text-center text-4xl font-bold">
            Promotions
          </h1>
          <PromotionList />
        </div>
      </div>

      <Contactus />
    </div>
  );
}
export default BrowseEvent;

