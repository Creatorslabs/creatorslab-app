import { motion } from "framer-motion";
import React from "react";

function Illustration() {
  return (
    <div className="hidden lg:flex flex-1 h-screen">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative w-full h-full"
      >
        {/* 3D Scene Container */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-l-3xl overflow-hidden">
          {/* Animated geometric shapes */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg opacity-80"
          />

          <motion.div
            animate={{
              rotate: [360, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-70"
          />

          <motion.div
            animate={{
              rotate: [0, -180, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/3 left-1/3 w-20 h-8 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full opacity-60"
          />

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-1/4 right-1/3 w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 transform rotate-45 opacity-75"
          />

          {/* Central focal point */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
            </div>
          </motion.div>

          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              className={`absolute w-2 h-2 bg-white rounded-full`}
              style={{
                left: `${20 + i * 10}%`,
                bottom: "10%",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Illustration;
