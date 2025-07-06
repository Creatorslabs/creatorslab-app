import { Eye, Users, Share2 } from "lucide-react";

interface Props {
  active: string;
  onChange: (tab: "overview" | "participants" | "analytics") => void;
}

export default function TaskModalTabs({ active, onChange }: Props) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "participants", label: "Participants", icon: Users },
    { id: "analytics", label: "Analytics", icon: Share2 },
  ];

  return (
    <div className="flex items-center gap-1 mb-6 bg-background rounded-lg p-1">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id as any)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            active === id
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-white hover:bg-card"
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
