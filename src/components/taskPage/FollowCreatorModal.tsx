import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleFollow?: () => Promise<void>;
}

export default function FollowCreatorModal({
  isOpen,
  onClose,
  handleFollow,
}: ModalProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const onFollowClick = async () => {
    if (!handleFollow) return;
    try {
      setIsFollowing(true);
      await handleFollow();
      onClose();
    } catch (error) {
      console.error("Follow failed:", error);
    } finally {
      setIsFollowing(false);
    }
  };

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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-card-box border border-border rounded-2xl p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">
                Follow a Creator
              </h3>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm font-medium mb-2">
                  Please Note
                </p>
                <p className="text-gray-300 text-sm">
                  If you follow a creator, you will earn 0.40$CLS. But if you
                  decide to unfollow this creator, you will be charged 5$CLS.
                </p>
              </div>

              <Button
                onClick={onFollowClick}
                disabled={isFollowing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium py-3 mb-4"
              >
                {isFollowing ? "Following..." : "Follow"}
              </Button>

              <Button
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
