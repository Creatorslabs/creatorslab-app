"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Heart, MessageCircle, Share, Eye } from "lucide-react";
import Link from "next/link";
import WelcomeModal from "@/components/WelcomeModal";

const taskCards = [
  {
    id: 1,
    title: "Task/Article Title here",
    description: "Task description goes here.",
    image: "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    reward: "100 $CLS",
    likes: "1.5k",
    comments: "10k",
    shares: "120",
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    title: "Task/Article Title here",
    description: "Task description goes here.",
    image: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    reward: "100 $CLS",
    likes: "1.5k",
    comments: "10k",
    shares: "120",
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 3,
    title: "Task/Article Title here",
    description: "Task description goes here.",
    image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    reward: "100 $CLS",
    likes: "1.5k",
    comments: "10k",
    shares: "120",
    gradient: "from-green-500 to-emerald-500"
  }
];

const trendingTasks = [
  {
    id: 4,
    title: "Task/Article Title here",
    description: "Task description goes here.",
    image: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    reward: "100 $CLS",
    likes: "1.5k",
    comments: "10k",
    shares: "120",
    gradient: "from-purple-600 to-pink-600"
  },
  {
    id: 5,
    title: "Task/Article Title here",
    description: "Task description goes here.",
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    reward: "100 $CLS",
    likes: "1.5k",
    comments: "10k",
    shares: "120",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 6,
    title: "Task/Article Title here",
    description: "Task description goes here.",
    image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    reward: "100 $CLS",
    likes: "1.5k",
    comments: "10k",
    shares: "120",
    gradient: "from-gray-400 to-gray-600"
  }
];

const topCreators = [
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
  "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
];

export default function Home() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const handleSignUp = () => {
    setShowWelcomeModal(true);
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-6 border-b border-[#3F3F3F]"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold">creatorslab</span>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects, quests, creators"
              className="w-full bg-[#212121] border border-[#3F3F3F] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#FEC4171A] px-3 py-1.5 rounded-full">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span className="text-sm font-medium text-yellow-400">Earn $CLS</span>
          </div>
          <button className="bg-[#5D3FD1] hover:bg-[#5D3FD1]/80 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
            Plant Seeds
          </button>
          <div className="text-sm text-gray-400">Dx45u...0987</div>
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
        </div>
      </motion.header>

      <div className="p-6">
        {/* Engage Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Engage</h2>
            <div className="flex gap-2">
              <button className="bg-[#099A43] hover:bg-[#099A43]/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Trending
              </button>
              <button className="bg-pink-500 hover:bg-pink-500/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Promoted
              </button>
              <button className="bg-purple-500 hover:bg-purple-500/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Projects
              </button>
              <button className="bg-blue-500 hover:bg-blue-500/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Articles
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Top Creators</span>
              <div className="flex -space-x-2">
                {topCreators.map((avatar, index) => (
                  <motion.img
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    src={avatar}
                    alt={`Creator ${index + 1}`}
                    className="w-8 h-8 rounded-full border-2 border-[#161616]"
                  />
                ))}
                <div className="w-8 h-8 bg-[#212121] rounded-full border-2 border-[#161616] flex items-center justify-center text-xs">
                  ...
                </div>
              </div>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                View all
              </button>
            </div>
          </div>
        </motion.div>

        {/* Engage Cards */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <h3 className="text-lg font-semibold">Engage</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Show all (20)</span>
            <button className="p-1 hover:bg-[#212121] rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-[#212121] rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {taskCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[#212121] rounded-xl overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">⭐</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{card.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{card.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{card.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="w-4 h-4" />
                      <span>{card.shares}</span>
                    </div>
                  </div>
                  <div className="bg-[#5D3FD1] px-3 py-1 rounded-full text-sm font-medium">
                    {card.reward}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Purchase and Earn Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Purchase $CLS</h3>
              <p className="text-sm opacity-90 mb-4">
                By staking $CLS to support a project, users can show their support and potentially earn a share of the project's future success. (Tokens, NFTs, whitelists).
              </p>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors">
                Buy $CLS
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20">
              <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Earn SOL</h3>
              <p className="text-sm opacity-90 mb-4">
                Burn CLS to earn SOL. (Coming Soon)
              </p>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors">
                Buy $CLS
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20">
              <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trending Tasks */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between mb-6"
        >
          <h3 className="text-lg font-semibold">Trending Tasks</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Show all (20)</span>
            <button className="p-1 hover:bg-[#212121] rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-[#212121] rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {trendingTasks.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-[#212121] rounded-xl overflow-hidden group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">⭐</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{card.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{card.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{card.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share className="w-4 h-4" />
                      <span>{card.shares}</span>
                    </div>
                  </div>
                  <div className="bg-[#5D3FD1] px-3 py-1 rounded-full text-sm font-medium">
                    {card.reward}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-8 relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-bold mb-2">Earn, Engage and Expand with Creatorslab.</h3>
            <p className="text-sm opacity-90 mb-6">
              Creating a long term relationship among builders and content creators, to a wider global web3 communities.
            </p>
            <button 
              onClick={handleSignUp}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Become a member
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 opacity-20">
            <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-4xl">💰</span>
            </div>
          </div>
        </motion.div>
      </div>

      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)} 
      />
    </div>
  );
}