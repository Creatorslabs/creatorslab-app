"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Coins,
  ShoppingCart,
  TrendingUp,
  Flame,
  ArrowRight,
  ArrowLeft,
  Fuel,
} from "lucide-react";
import Image from "next/image";
import { JSX, useState } from "react";
import { Button } from "./ui/button";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full relative border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Step content */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center">
                  <Image
                    src="/images/logo.png"
                    width={50}
                    height={50}
                    alt="Creatorlab logo"
                    className="w-16 h-16 mx-auto mb-6"
                  />
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Welcome to CreatorsLab!
                  </h2>
                  <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="text-white font-semibold mb-3">
                      As a Newbie you can earn:
                    </h3>
                    <div className="space-y-2 text-sm">
                      <Row label="Daily login" value="0.3 labseeds" />
                      <Row label="Liking posts" value="0.3 labseeds" />
                      <Row label="Comments" value="0.5 labseeds" />
                      <Row label="Repost" value="0.8 labseeds" />
                      <Row
                        label="Read stories & Blog post"
                        value="0.8 labseeds"
                      />
                      <Row label="Referral" value="1 CLS" />
                    </div>
                    <div className="mt-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-center">
                      <span className="text-blue-400 font-semibold">
                        50 CLS = $1
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  How $CLS Works
                </h2>
                <div className="space-y-4">
                  <InfoRow
                    icon={<Coins className="text-yellow-400" />}
                    title="Earn"
                    desc="Likes, comments, shares, blog reads, referrals"
                  />
                  <InfoRow
                    icon={<ShoppingCart className="text-green-400" />}
                    title="Spend"
                    desc="Boost followers, engagement, airdrop referral links"
                  />
                  <InfoRow
                    icon={<Flame className="text-red-400" />}
                    title="Burn"
                    desc="Earn $SOL"
                  />
                  <InfoRow
                    icon={<TrendingUp className="text-blue-400" />}
                    title="Trade"
                    desc="Swap $CLS for stablecoins after TGE"
                  />
                  <InfoRow
                    icon={<Fuel className="text-orange-400" />}
                    title="GasPass"
                    desc="Instant gas fees. Claim now, pay later."
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <Image
                  src="/images/logo.png"
                  width={60}
                  height={60}
                  alt="Creatorlab logo"
                  className="w-20 h-20 mx-auto mb-6"
                />
                <h2 className="text-2xl font-bold text-white mb-4">
                  You are all set!
                </h2>
                <p className="text-gray-300 mb-6">
                  Start exploring and earning in CreatorsLab.
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold px-6 rounded-lg transition-all duration-200 text-lg py-3"
                  onClick={onClose}
                >
                  Let&apos;s Go!
                </Button>
              </motion.div>
            )}

            {/* Step controls */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft size={16} className="mr-2" /> Back
                </Button>
              ) : (
                <div />
              )}
              {step < 3 && (
                <Button onClick={nextStep}>
                  Next <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-300">{value} for</span>
      <span className="text-blue-400">{label}</span>
    </div>
  );
}

function InfoRow({
  icon,
  title,
  desc,
}: {
  icon: JSX.Element;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-white font-semibold">{title}</p>
        <p className="text-gray-300 text-sm">{desc}</p>
      </div>
    </div>
  );
}
