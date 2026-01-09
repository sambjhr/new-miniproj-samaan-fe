import Navbar from "@/components/Navbar";
import Contactus from "@/components/Contactus";
import Jumbotron from "@/components/ui/Jumbotron";
import EventList from "@/app/browse-event/components/EventList";
import CategoryList from "@/app/browse-event/components/CategroyList";
import PromotionList from "../browse-event/components/PromotionList";

function Home() {
  return (
    <div>
      <Navbar />
      <Jumbotron />

      {/* category event */}
      <div>
        <h1 className="container mx-auto mb-5 p-10 text-center text-4xl font-bold">
          Choose what you wanna do!
        </h1>

        <CategoryList />
      </div>

      {/* Featured Event */}
      <section>
        <h1 className="container mx-auto mb-5 p-10 text-center text-4xl font-bold">
          Featured Events
        </h1>
      </section>
      <EventList />
      {/* Promotions */}
      <div>
        <h1 className="container mx-auto mb-5 p-10 text-center text-4xl font-bold">
          Promotions
        </h1>
        <PromotionList />
      </div>

      <Contactus />
    </div>
  );
}

export default Home;
