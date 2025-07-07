"use client";
import { Send, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function WalletActionFooter() {
  return (
    <div className="p-4 space-y-4">
      <Separator className="bg-border" />
      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-primary hover:bg-primary/80 text-white">
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
        <Button
          variant="outline"
          className="border-border text-white hover:bg-card"
        >
          <Download className="w-4 h-4 mr-2" />
          Receive
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Powered by Privy • Secured by Solana
      </p>
    </div>
  );
}
