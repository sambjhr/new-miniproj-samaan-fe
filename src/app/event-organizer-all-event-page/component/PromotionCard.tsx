import Link from "next/link";

export type Promotion = {
  id: number | string;
  eventName: string;
  startDate: string;
  endDate: string;
};

interface PromotionCardProps {
  promo: Promotion;
}

const PromotionCard = ({ promo }: PromotionCardProps) => {
  return (
    <Link href={`/event/${promo.id}`} className="group block">
      <div
        className="relative h-56 w-full overflow-hidden rounded-xl bg-cover bg-center transition-transform duration-300 hover:scale-[1.01]"
        style={{ backgroundImage: "url('/thumbnail.jpeg')" }}
      >
        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Konten */}
        <div className="relative z-10 flex h-full flex-col justify-center p-5 text-white items-center ">
          <h2 className="text-2xl font-bold leading-tight">
            {promo.eventName}
          </h2>

          <p className="mt-1 text-l opacity-90">
            {promo.startDate} – {promo.endDate}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PromotionCard;