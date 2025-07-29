import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EarnedCLSModal({ isOpen, onClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-card-box border border-border rounded-2xl p-8 max-w-md w-full relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
            >
              <Image
                src="/images/logo.png"
                width={25}
                height={25}
                alt="Creatorlab logo"
              />
            </motion.div>

            <h3 className="text-xl font-bold text-white mb-2">
              Task is currently{" "}
              <span className="text-yellow-400">pending review</span>
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              You'll be notified once it&apos;s approved and eligible for
              rewards.
            </p>

            <Button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3"
            >
              Got It
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
