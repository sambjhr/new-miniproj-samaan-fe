"use client";

export type Review = {
  review_id: string;
  rating: number;
  comment: string;
  created_at: string;

  user: {
    full_name: string;
    profile_image: string | null;
    created_at?: string;
  };

  events: {
    title: string;
  };
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function renderStars(rating: number) {
  const r = Math.max(0, Math.min(5, Math.round(rating))); // 0..5
  return Array.from({ length: 5 }).map((_, i) => (
    <svg
      key={i}
      className={`h-5 w-5 ${i < r ? "text-yellow-500" : "text-slate-300"}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
    </svg>
  ));
}

type Props = {
  review: Review;
};

export const ReviewCard = ({ review }: Props) => {
  const avatar =
    review.user.profile_image && review.user.profile_image.trim().length > 0
      ? review.user.profile_image
      : "/profpic-pengganti.png";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <article>
        <div className="mb-4 flex items-center">
          <img
            className="me-3 h-10 w-10 rounded-full object-cover"
            src={avatar}
            alt={review.user.full_name}
          />
          <div className="font-medium text-slate-900">
            <p>
              {review.user.full_name}
              <time className="block text-sm text-slate-500">
                Joined on {formatDate(review.user.created_at)}
              </time>
            </p>
          </div>
        </div>

        <div className="mb-1 flex items-center space-x-1">
          {renderStars(review.rating)}
        </div>

        <footer className="mt-1 mb-5 text-sm text-slate-600">
          <p>
            Reviewed on <time>{formatDate(review.created_at)}</time>
          </p>
          <p className="font-medium text-slate-800">{review.events.title}</p>
        </footer>

        <p className="text-slate-700">{review.comment}</p>
      </article>
    </div>
  );
};
