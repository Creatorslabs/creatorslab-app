"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function FilterControls({
  sort,
  platform,
  updateParam,
  sortOptions,
  platforms,
  clearFilters,
}: {
  sort: string;
  platform: string;
  updateParam: (param: string, value: string) => void;
  sortOptions: string[];
  platforms: string[];
  clearFilters: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-20 md:top-24 z-20 bg-card-box backdrop-blur-md border border-border rounded-xl p-3 sm:p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div className="w-full">
        {/* Toggle Button for Mobile */}
        {isMobile && (
          <button
            className="flex items-center gap-2 text-sm font-medium mb-2"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? (
              <>
                <ChevronUp className="w-4 h-4" /> Hide Filters
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Show Filters
              </>
            )}
          </button>
        )}

        {/* Filters - always visible on desktop, toggle on mobile */}
        {(isOpen || !isMobile) && (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Select
                value={sort}
                onValueChange={(val: string) => updateParam("sort", val)}
              >
                <SelectTrigger className="w-full sm:w-40 text-sm border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-card-box border border-border hover:bg-card">
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={platform}
                onValueChange={(val: string) => updateParam("platform", val)}
              >
                <SelectTrigger className="w-full sm:w-40 text-sm border-border">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent className="bg-card-box border border-border hover:bg-card">
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="w-full md:w-auto text-sm hover:bg-card"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
