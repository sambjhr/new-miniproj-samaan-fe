import Link from "next/link";

export type Category = {
  category_id: number;
  category_name: string;
  category_field?: string | null; // optional dari backend
};

interface CategoryCardProps {
  category: Category;
}

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  concert: "/gambar/category/concert.png",
  business: "/gambar/category/business.png",
  music: "/gambar/category/music.png",
  games: "/gambar/category/games.png",
  art: "/gambar/category/art.png",
};

function getCategoryImage(category: Category) {
  // 1) prioritas: mapping by name
  const key = (category.category_name ?? "").trim().toLowerCase();
  if (CATEGORY_IMAGE_MAP[key]) return CATEGORY_IMAGE_MAP[key];

  // 2) fallback: kalau backend punya field url/path
  const f = (category.category_field ?? "").trim();
  if (f && (f.startsWith("http") || f.startsWith("/"))) return f;

  // 3) default
  return "/thumbnail.jpeg";
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const imageSrc = getCategoryImage(category);

  return (
    <Link
      href={`/browse-event?category=${encodeURIComponent(
        String(category.category_id),
      )}`}
      className="group block"
    >
      <div className="flex h-full flex-col items-center gap-4 rounded-xl p-4 transition hover:shadow-2xl">
        {/* Circle Image */}
        <div className="h-40 w-40 overflow-hidden rounded-full bg-slate-200">
          <img
            src={imageSrc}
            alt={category.category_name}
            className="block h-full w-full rounded-full object-cover"
          />
        </div>

        {/* Label */}
        <p className="text-lg font-medium text-slate-900">
          {category.category_name}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;