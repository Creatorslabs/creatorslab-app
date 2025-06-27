"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share } from "lucide-react";
import { useState } from "react";

interface EngagementCardProps {
  index: number;
  card: {
    id: string;
    image: string;
    title: string;
    description: string;
    likes: string;
    comments: string;
    shares: string;
    reward: string;
    avatar: string;
  };
}

export default function EngagementCard({ index, card }: EngagementCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const avatarImage = card.avatar || "/images/user03.jpeg";

  return (
    <motion.div
      key={card.id}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-background rounded-2xl overflow-hidden border border-border shadow-md cursor-pointer"
    >
      <div className="relative px-4 pt-4">
        <div className="relative h-[132px] lg:h-[177.02px] rounded-[8px] overflow-hidden mx-auto">
          <Image
            src={card.image}
            alt={card.title}
            width={300}
            height={250}
            className="object-cover w-full h-full"
            quality={75}
            loader={({ src, width, quality }) =>
              `${src}?w=${width}&q=${quality || 75}`
            }
            onLoad={() => setImageLoading(false)}
          />

          {imageLoading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="absolute -bottom-5 right-3 w-12 h-12 rounded-full border-2 border-[#1C1C1C] overflow-hidden z-10 bg-white">
          <Image
            src={avatarImage}
            alt="Avatar"
            width={60}
            height={60}
            className="w-full h-full object-cover"
            quality={75}
            loader={({ src, width, quality }) =>
              `${src}?w=${width}&q=${quality || 75}`
            }
          />
        </div>
      </div>

      <div className="p-4 pt-8">
        <h3 className="text-white font-semibold text-base mb-1">
          {card.title}
        </h3>
        <p className="text-xs text-gray-400 mb-4">{card.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-300">
          <div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-lg">
            {card.reward}
          </div>
          <div className="flex bg-card px-3 py-1 items-center gap-1 rounded-lg">
            <Heart className="w-4 h-4" />
            <span>{card.likes}</span>
          </div>
          <div className="flex bg-card px-3 py-1 items-center gap-1 rounded-lg">
            <MessageCircle className="w-4 h-4" />
            <span>{card.comments}</span>
          </div>
          <div className="flex bg-card px-3 py-1 items-center gap-1 rounded-lg">
            <Share className="w-4 h-4" />
            <span>{card.shares}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
