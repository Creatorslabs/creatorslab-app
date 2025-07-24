"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { logger } from "@/lib/logger";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Error caught by boundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

function DefaultErrorFallback({
  error,
  resetError,
}: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 w-full">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              width={30}
              height={30}
              alt="CreatorsLab logo"
            />
            <span className="text-foreground text-2xl font-semibold">
              creatorslab
            </span>
          </div>
        </div>

        {/* Error Icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-12 h-12 text-foreground" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-red-500/20 rounded-full blur-xl animate-ping"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            An unexpected error occurred. Please try refreshing the page or
            contact support if the problem persists.
          </p>

          {error && process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800 text-left">
              <p className="text-red-400 text-sm font-mono break-all">
                {error.message}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={resetError}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-foreground px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-foreground px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
