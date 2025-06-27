"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Twitter, MessageSquare, Mail } from "lucide-react";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletConnect = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    // Simulate social login
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between mb-12"
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-white">creatorslab</span>
            </Link>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400 hidden sm:block">New to CreatorsLab?</span>
              <Link 
                href="/auth/signup" 
                className="text-white border border-gray-600 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
              >
                Create an account
              </Link>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Log in to CreatorsLab</h1>
              <p className="text-gray-400">Welcome back!</p>
            </div>

            {/* Wallet Login */}
            <div className="mb-8">
              <h3 className="text-white font-medium mb-4">Log in with wallet</h3>
              <motion.button
                onClick={handleWalletConnect}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg px-4 py-3 text-white font-medium transition-colors flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Connect your wallet</span>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </motion.button>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 text-gray-400">OR</span>
              </div>
            </div>

            {/* Social Login */}
            <div>
              <h3 className="text-white font-medium mb-4">Log in with Social account</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <motion.button
                  onClick={() => handleSocialLogin('twitter')}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="hidden sm:inline">Twitter</span>
                </motion.button>

                <motion.button
                  onClick={() => handleSocialLogin('discord')}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Discord</span>
                </motion.button>

                <motion.button
                  onClick={() => handleSocialLogin('email')}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Email</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - 3D Illustration */}
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
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg opacity-80"
            />
            
            <motion.div
              animate={{ 
                rotate: [360, 0],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-70"
            />
            
            <motion.div
              animate={{ 
                rotate: [0, -180, 0],
                x: [0, 10, 0]
              }}
              transition={{ 
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-1/3 left-1/3 w-20 h-8 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full opacity-60"
            />
            
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{ 
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 right-1/3 w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 transform rotate-45 opacity-75"
            />

            {/* Central focal point */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
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
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
                className={`absolute w-2 h-2 bg-white rounded-full`}
                style={{
                  left: `${20 + (i * 10)}%`,
                  bottom: '10%'
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}