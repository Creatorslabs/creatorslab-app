"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          // onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full relative border border-gray-700"
            onClick={(e: any) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              >
                <span className="text-2xl">🎉</span>
              </motion.div> */}

              <Image
                src="/images/logo.png"
                width={50}
                height={50}
                alt="Creatorlab logo"
                className="items-center justify-center w-16 h-16 mx-auto mb-6"
              />

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white mb-6"
              >
                Welcome to CreatorsLab!
              </motion.h2>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left"
              >
                <h3 className="text-white font-semibold mb-3">
                  As a Newbie you can earn:
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">0.3 labseeds for</span>
                    <span className="text-blue-400">Daily login</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">0.3 labseeds for</span>
                    <span className="text-blue-400">Liking posts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">0.5 labseeds for</span>
                    <span className="text-blue-400">Comments</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">0.8 labseeds for</span>
                    <span className="text-blue-400">Repost</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">0.8 labseeds to</span>
                    <span className="text-blue-400">
                      Read stories & Blog post
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">1 CLS for a</span>
                    <span className="text-blue-400">Referral</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-center">
                  <span className="text-blue-400 font-semibold">
                    50CLS = $1
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold px-6 rounded-lg transition-all duration-200 text-center text-lg py-3"
                  onClick={onClose}
                >
                  Let&apos;s Go!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
