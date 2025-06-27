import { motion } from "framer-motion";
import React from "react";

function CTA({ handleSignUp }: { handleSignUp: () => void }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-6 lg:p-8 relative overflow-hidden"
    >
      <div className="relative z-10 max-w-2xl">
        <h3 className="text-xl lg:text-2xl font-bold mb-2">
          Earn, Engage and Expand with Creatorslab.
        </h3>
        <p className="text-sm opacity-90 mb-6">
          Creating a long term relationship among builders and content creators,
          to a wider global web3 communities.
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
  );
}

export default CTA;
