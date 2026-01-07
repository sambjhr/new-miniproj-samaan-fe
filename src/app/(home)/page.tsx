import Navbar from "@/components/Navbar";
import Contactus from "@/components/Contactus";
import Jumbotron from "@/components/ui/Jumbotron";
import EventList from "@/app/browse-event/components/EventList";
import PromotionList from "@/components/ui/PromotionList";
import CategoryList from "@/app/browse-event/components/CategroyList";

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
      <div>
        <h1 className="container mx-auto mb-5 p-10 text-center text-4xl font-bold justify-center">
          Featured Events
        </h1>
      </div>

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