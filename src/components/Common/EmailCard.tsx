import { ArrowRight, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "********";

  const visible = name.slice(0, 2);
  const masked = "*".repeat(Math.max(name.length - 2, 4));
  return `${visible}${masked}@${domain}`;
};

export const EmailCard = ({
  email,
  action,
}: {
  email: string;
  action?: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!action) return;
    setLoading(true);
    try {
      await action();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center border border-[#606060] rounded-lg p-4 w-full max-w-[450px]">
      <div className="flex gap-3 items-center">
        <div className="p-2 bg-yellow-500 rounded-md">
          <Mail className="w-5 h-5" />
        </div>
        <span className="text-sm text-gray-200">
          {email ? maskEmail(email) : "Email not linked"}
        </span>
      </div>
      <Button
        className="px-4 py-2 rounded-lg bg-card text-foreground hover:bg-card-box"
        variant="default"
        disabled={!!email || loading}
        onClick={handleClick}
      >
        {email ? (
          "Linked"
        ) : loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};
