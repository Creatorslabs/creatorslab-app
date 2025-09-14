"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Wallet2, ArrowLeft } from "lucide-react";
import {
  useLogin,
  useLoginWithEmail,
  useLoginWithOAuth,
  usePrivy,
} from "@privy-io/react-auth";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SimpleIcon } from "@/components/Common/SimpleIcon";
import Image from "next/image";
import Illustration from "@/components/Common/3D-Illustration";
import { logger } from "@/lib/logger";

export default function SignIn() {
  const [loginType, setLoginType] = useState<"email" | "wallet">("wallet");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { initOAuth } = useLoginWithOAuth();

  const { login } = useLogin({
    onComplete: async (data) => {
      toast({
        title: "Login successful",
        description: "You are now logged in!",
        variant: "success",
      });
      router.push("/");
    },
    onError: (error) => {
      logger.error("Login error:", error);
      toast({
        title: error || "Login failed",
        variant: "destructive",
      });
    },
  });

  const handleWalletConnect = () => {
    setIsLoading(true);
    try {
      login({
        loginMethods: ["wallet"],
        walletChainType: "solana-only",
        disableSignup: true,
      });
    } catch (error) {
      toast({
        title: (error as Error).message || "Wallet login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { sendCode, loginWithCode } = useLoginWithEmail({
    onComplete: async (data) => {
      toast({
        title: "Login successful",
        description: "You are now logged in!",
        variant: "success",
      });
      router.push("/");
    },
    onError: (error) => {
      logger.error("Login error:", error);
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

    const res = await fetch("/api/user/exist", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      throw new Error("Error vetting user.");
    }

    const { exist } = await res.json();

    if (!exist) {
      throw new Error("User does not exist, please signup first!");
    }

    try {
      await sendCode({ email, disableSignup: true });
      setStep(2);
    } catch (error) {
      logger.error("Failed to send code:", error);
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
      logger.error("Failed to login:", error);
      toast({
        title: (error as Error).message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "twitter" | "discord") => {
    setIsLoading(true);
    try {
      await initOAuth({ provider });
      router.push("/");
    } catch (error) {
      toast({
        title: (error as Error).message || "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col w-full max-w-2xl mx-auto mb-4 gap-4"
          >
            <div className="flex justify-center">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/images/logo.png"
                  width={25}
                  height={25}
                  alt="Creatorlab logo"
                />
                <span className="text-xl font-bold text-white">
                  creatorslab
                </span>
              </Link>
            </div>

            <div className="flex justify-between items-center w-full text-sm">
              <span className="text-gray-400">New to CreatorsLab?</span>
              <Link
                href="/auth/signup"
                className="text-white border border-gray-600 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
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
              <h1 className="text-2xl font-bold text-white mb-2">
                Log in to CreatorsLab
              </h1>
              <p className="text-gray-400">Welcome back!</p>
            </div>

            {loginType === "email" && (
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleEmailSubmit}>
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
                        type="submit"
                        disabled={isLoading || !email}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4"
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
                    </form>
                  </motion.div>
                ) : (
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
                    <div className="flex flex-col space-y-2">
                      <p className="text-gray-400">
                        We&apos;ve sent a 6-digit code to{" "}
                        <span className="text-white">{email}</span>
                      </p>
                      <div className="flex gap-2 items-center">
                        <p className="text-sm text-gray-400 mb-2">
                          Didn&apos;t receive the code?
                        </p>
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                          Resend code
                        </button>
                      </div>
                    </div>

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
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
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
                        className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors mb-4"
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
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Wallet Login */}
            {loginType === "wallet" && (
              <div className="mb-8">
                <h3 className="text-white font-medium mb-4">
                  Log in with wallet
                </h3>
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
            )}

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
              <h3 className="text-white font-medium mb-4">
                Log in with Social account
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <motion.button
                  onClick={() => handleSocialLogin("twitter")}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-primary hover:bg-primary/70 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SimpleIcon platform="twitter" className="w-4 h-4" />
                  <span className="hidden sm:inline">Twitter</span>
                </motion.button>

                <motion.button
                  onClick={() => handleSocialLogin("discord")}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-secondary hover:bg-secondary/70 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SimpleIcon platform="discord" className="w-4 h-4" />
                  <span className="hidden sm:inline">Discord</span>
                </motion.button>

                {loginType === "email" && (
                  <motion.button
                    onClick={() => setLoginType("wallet")}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wallet2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Wallet</span>
                  </motion.button>
                )}

                {loginType === "wallet" && (
                  <motion.button
                    onClick={() => setLoginType("email")}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-primary hover:bg-primary/70 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="hidden sm:inline">Email</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - 3D-Illustration */}
      <Illustration />
    </div>
  );
}
