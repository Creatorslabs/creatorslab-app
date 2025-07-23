"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";

export default function EditableUsername({
  initialName,
  userId,
}: {
  initialName: string;
  userId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(initialName);
  const [debouncedUsername] = useDebounce(username, 500);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editing || !debouncedUsername || debouncedUsername === initialName) {
      setIsAvailable(null);
      return;
    }

    const checkUsername = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/user/check-username/${debouncedUsername}`
        );
        const data = await res.json();
        setIsAvailable(data.available);
      } catch (err) {
        console.error(err);
        setIsAvailable(null);
      } finally {
        setLoading(false);
      }
    };

    checkUsername();
  }, [debouncedUsername, editing, initialName]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/update-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "Username updated successfully" });
      setEditing(false);
    } catch (error: any) {
      toast({
        title: error.message || "Failed to update username",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {editing ? (
        <div className="flex items-center gap-2">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`h-8 w-40 text-sm ${
              isAvailable === false ? "border-red-500" : ""
            }`}
            placeholder="Enter username"
          />

          {/* Status Indicator */}
          <div className="min-w-[70px] text-xs">
            {loading ? (
              <span className="text-muted-foreground">Checking...</span>
            ) : isAvailable === false ? (
              <span className="text-red-500">Taken</span>
            ) : isAvailable === true ? (
              <span className="text-green-500">Available</span>
            ) : null}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!isAvailable}
            className="p-1 rounded-md border border-green-500 hover:bg-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4 text-green-500" />
          </button>

          {/* Cancel Button */}
          <button
            onClick={() => {
              setEditing(false);
              setUsername(initialName);
            }}
            className="p-1 rounded-md hover:bg-muted"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ) : (
        <h1 className="text-2xl font-semibold flex items-center gap-2 font-syne">
          {username}
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded-md hover:bg-muted"
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </button>
        </h1>
      )}
    </div>
  );
}
