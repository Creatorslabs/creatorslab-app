"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { toast } from "@/hooks/use-toast";

const filters = [
  { label: "Trending", value: "trending", bg: "bg-[#099A43]" },
  { label: "Promoted", value: "promoted", bg: "bg-pink-500" },
  { label: "Projects", value: "projects", bg: "bg-purple-500" },
  { label: "Articles", value: "articles", bg: "bg-blue-500" },
  { label: "GasPass", value: "gaspass", bg: "bg-emerald-600" },
];

function EngageFiltersComp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleFilterClick = (value: string) => {
    if (value === "gaspass") {
      toast({
        title: "Coming soon",
        variant: "warning",
      });
      return;
    }

    const newParams = new URLSearchParams(searchParams);

    if (value === "trending") {
      router.push("/tasks?sort=trending");
      return;
    }

    newParams.set("category", value);
    router.push(`/tasks?${newParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 border border-[#3F3F3F] rounded-md p-4 w-full md:w-[370px]">
      <p className="flex justify-between text-sm">
        Browse by categories{" "}
        <span className="text-[#5D3FD1] cursor-pointer">View all</span>
      </p>

      {/* Scrollable on mobile */}
      <div className="flex flex-row gap-2 overflow-x-auto overflow-visible scrollbar-hide">
        {filters.map(({ label, value, bg }) => (
          <button
            key={value}
            onClick={() => handleFilterClick(value)}
            className={cn(
              "text-xs rounded-md px-3 py-2 font-semibold text-white whitespace-nowrap transition-colors",
              bg,
              currentCategory === value
                ? "opacity-100"
                : "opacity-80 hover:opacity-100"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EngageFilters() {
  return (
    <Suspense
      fallback={
        <div className="h-16 w-full bg-gray-800 animate-pulse rounded-md">
          loading...
        </div>
      }
    >
      <EngageFiltersComp />
    </Suspense>
  );
}

export default EngageFilters;
