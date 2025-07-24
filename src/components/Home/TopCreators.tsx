"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logger } from "@/lib/logger";

export default function TopCreators() {
  const [topCreators, setTopCreators] = useState<string[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await fetch("/api/creator/top-seven");
        const data = await res.json();
        setTopCreators(data.creators);
      } catch (error) {
        logger.error("Failed to fetch top creators:", error);
      }
    };

    fetchCreators();
  }, []);

  return (
    <div className="flex flex-col gap-4 border border-[#3F3F3F] rounded-md p-4 w-full md:w-[370px]">
      <p className="flex justify-between text-sm font-medium">
        <span className="text-white">Top Creators</span>
        <button className="text-[#5D3FD1] hover:underline">View all</button>
      </p>

      <div className="flex items-center">
        {topCreators.map((avatar, index) => (
          <div
            key={index}
            className={`relative w-10 h-10 aspect-square ${
              index !== 0 ? "-ml-4 md:-ml-2" : ""
            }`}
          >
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              src={avatar}
              alt={`Creator ${index + 1}`}
              className="rounded-full aspect-square h-full w-full border-2 border-[#161616]"
            />
          </div>
        ))}
        <div className="w-10 h-10 -ml-4 md:-ml-2 bg-[#212121] rounded-full border-2 border-[#161616] flex items-center justify-center text-xs text-white">
          ...
        </div>
      </div>
    </div>
  );
}
