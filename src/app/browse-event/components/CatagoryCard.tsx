import Link from "next/link";

export type Category = {
  category_id: number;
  category_name: string;
  category_field?: string | null;
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const imageSrc =
    category.category_field &&
    (category.category_field.startsWith("http") ||
      category.category_field.startsWith("/"))
      ? category.category_field
      : "/thumbnail.jpeg";

  return (
    <Link
      href={`/browse-event?category=${encodeURIComponent(
        String(category.category_id),
      )}`}
      className="group block"
    >
      <div className="flex h-full flex-col items-center gap-4 rounded-xl p-4 transition hover:shadow-2xl">
        {/* Circle Image */}
        <div className="h-40 w-40 overflow-hidden rounded-full bg-slate-300">
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
