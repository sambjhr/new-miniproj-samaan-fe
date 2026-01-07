import Image from "next/image";
import { Card } from "./ui/card";

export default function Homepage() {
  return (
    <div className="w-full flex flex-col items-center">

      {/* =================== BANNER UPCOMING EVENTS =================== */}
      <section className="w-full max-w-6xl mt-10 px-4">
        <div className="w-full h-64 bg-gray-300 rounded-xl flex items-center justify-center">
          <span className="text-gray-600 text-lg">Banner Upcoming Events</span>
        </div>
      </section>

      {/* =================== FEATURED EVENTS =================== */}
      <section className="w-full max-w-6xl mt-14 px-4">
        <h2 className="text-center text-3xl font-semibold mb-8">
          Featured Events
        </h2>

        <Card />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="h-48 bg-gray-300 rounded-xl"></div>
          <div className="h-48 bg-gray-300 rounded-xl"></div>
          <div className="h-48 bg-gray-300 rounded-xl"></div>
          <div className="h-48 bg-gray-300 rounded-xl"></div>
        </div>
      </section>

    </div>
  );
}
