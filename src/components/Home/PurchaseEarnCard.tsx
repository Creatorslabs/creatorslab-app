import { motion } from "framer-motion";
import React from "react";

function PurchaseEarnCard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-6 relative overflow-hidden"
      >
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Purchase $CLS</h3>
          <p className="text-sm opacity-90 mb-4">
            By staking $CLS to support a project, users can show their support
            and potentially earn a share of the project&apos;s future success.
            (Tokens, NFTs, whitelists).
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
  );
}

export default PurchaseEarnCard;
