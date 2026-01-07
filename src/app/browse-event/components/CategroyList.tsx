"use client";

import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import CategoryCard, { Category } from "./CatagoryCard";

type CategoryResponse = {
  data: Category[];
};

export default function CategoryList() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get<CategoryResponse>("/categories", {
        params: { sortBy: "category_id", sortOrder: "asc" },
      });
      return res.data.data;
    },
  });

  if (isPending) {
    return (
      <div className="container mx-auto flex gap-12 overflow-x-auto p-5 px-6">
        <p className="text-slate-600">Loading categories...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto flex gap-12 overflow-x-auto p-5 px-6">
        <p className="text-red-600">Failed to load categories.</p>
      </div>
    );
  }

  return (
    <div className="scrollbar-hide container mx-auto flex justify-between gap-12 overflow-x-auto p-5 px-6">
      {data.map((c) => (
        <CategoryCard key={c.category_id} category={c} />
      ))}
    </div>
  );
}
