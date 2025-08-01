import Link from "next/link";
import Image from "next/image";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 w-full">
      <div className="max-w-2xl mx-auto text-center">
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

        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-12 h-12 text-foreground" />
            </div>
            <div className="absolute inset-0 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl animate-ping"></div>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page not found
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Double-check the URL or go back to the homepage.
          </p>
        </div>

        <div className="flex justify-center">
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
