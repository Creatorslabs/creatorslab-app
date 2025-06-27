"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const fallbackCreators = [
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
];

export default function TopCreators() {
  const [topCreators, setTopCreators] = useState<string[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await fetch("/api/creators");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          // Assume the API returns objects with `avatar` and `followers`
          const sorted = data
            .sort((a, b) => b.followers - a.followers)
            .slice(0, 7)
            .map((creator) => creator.avatar);

          setTopCreators(sorted);
        } else {
          setTopCreators(fallbackCreators);
        }
      } catch (error) {
        console.error("Failed to fetch top creators:", error);
        setTopCreators(fallbackCreators);
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
