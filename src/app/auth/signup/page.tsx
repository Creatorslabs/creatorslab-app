"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function SignUp() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"user" | "creator">("user")
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete: async (data) => {
      if (data.isNewUser) {
        try {
          await fetch("/api/user/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              privyId: data.user?.id,
              email: data.user?.email?.address,
              role,
            }),
          });
        } catch (err) {
          console.error("Failed to create new user:", err);
        }
      }

      toast({
        title: "Login successful",
        description: "You are now logged in!",
        variant: "success",
      });
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast({
        title: error || "Login failed",
        variant: "destructive",
      });
    },
  });

  const disableLogin = !ready || (ready && authenticated);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await sendCode({ email });
      setStep(2);
    } catch (error) {
      console.error("Failed to send code:", error);
      toast({
        title: (error as Error).message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    try {
      await loginWithCode({ code: otp });
      router.push("/");
    } catch (error) {
      console.error("Failed to login:", error);
      toast({
        title: (error as Error).message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-40 right-32 w-24 h-24 bg-purple-500 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-pink-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [-360, -180, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-20 w-28 h-28 bg-cyan-500 rounded-full blur-2xl"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              width={25}
              height={25}
              alt="Creatorlab logo"
            />
            <span className="text-xl font-bold text-white">creatorslab</span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400 hidden sm:block">
              Already have an account?
            </span>
            <Link
              href="/auth/signin"
              className="text-white border border-gray-600 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
            >
              Log in
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold text-white mb-2">
                  Welcome to CreatorsLab
                </h1>
                <p className="text-gray-400 mb-8">
                  Join the global community of content creators and earn.
                </p>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="address@email.com"
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <motion.button
                  onClick={() => setStep(2)}
                  disabled={isLoading || !email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    "Continue with email"
                  )}
                </motion.button>

                <p className="text-xs text-gray-400 mt-6 text-center">
                  By continuing, you agree to our{" "}
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-white underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm transition-colors"
                  disabled={isLoading || disableLogin}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <h1 className="text-2xl font-bold text-white mb-2">
                  Choose your role
                </h1>

                <div className="flex justify-around flex-no-wrap py-8">
                <div className="p-8 rounded-md border-2 border-card bg-white/50 hover:scale-1"><p>User</p></div>
                <div className="p-8 rounded-md border-2 border-card bg-white/50 hover:scale-1"><p>Creator</p></div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm transition-colors"
                  disabled={isLoading || disableLogin}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <h1 className="text-2xl font-bold text-white mb-2">
                  Enter verification code
                </h1>
                <p className="text-gray-400 mb-8">
                  We&apos;ve sent a 6-digit code to{" "}
                  <span className="text-white">{email}</span>
                </p>

                <form onSubmit={handleOtpSubmit}>
                  <div className="mb-6">
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-white mb-2"
                    >
                      Verification code
                    </label>
                    <input
                      type="text"
                      id="otp"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="000000"
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading || otp.length !== 6 || disableLogin}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify and continue"
                    )}
                  </motion.button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400 mb-2">
                    Didn&apos;t receive the code?
                  </p>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                    Resend code
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
