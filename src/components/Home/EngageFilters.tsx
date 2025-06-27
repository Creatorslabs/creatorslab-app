"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils"; // optional: for class merging

const filters = [
  { label: "Trending", value: "trending", bg: "bg-[#099A43]" },
  { label: "Promoted", value: "promoted", bg: "bg-pink-500" },
  { label: "Projects", value: "projects", bg: "bg-purple-500" },
  { label: "Articles", value: "articles", bg: "bg-blue-500" },
];

export default function EngageFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleFilterClick = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("category", value);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 border border-[#3F3F3F] rounded-md p-4 w-full md:w-[370px]">
      <p className="flex justify-between text-sm">
        Engage <span className="text-[#5D3FD1] cursor-pointer">View all</span>
      </p>

      <div className="flex flex-row items-center justify-between gap-2">
        {filters.map(({ label, value, bg }) => (
          <button
            key={value}
            onClick={() => handleFilterClick(value)}
            className={cn(
              "text-xs rounded-md px-3 py-2 font-semibold text-white flex-1 transition-colors",
              bg,
              currentCategory === value ? "opacity-100" : "opacity-80 hover:opacity-100"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
