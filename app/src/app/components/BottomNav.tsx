import { Home, Dumbbell, Apple, Heart, BarChart3 } from "lucide-react";

interface BottomNavProps {
  active: string;
  onChange: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", icon: Home, label: "Home" },
  { id: "workout", icon: Dumbbell, label: "Workout" },
  { id: "nutrition", icon: Apple, label: "Nutrition" },
  { id: "recovery", icon: Heart, label: "Recovery" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pb-6 pt-3"
      style={{
        background: "rgba(7, 7, 15, 0.85)",
        backdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200"
            style={{ minWidth: 56 }}
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))"
                  : "transparent",
              }}
            >
              <Icon
                size={22}
                style={{
                  color: isActive ? "#3B82F6" : "rgba(160,160,200,0.5)",
                  filter: isActive ? "drop-shadow(0 0 8px rgba(59,130,246,0.6))" : "none",
                  transition: "all 0.2s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: isActive ? "#3B82F6" : "rgba(160,160,200,0.45)",
                fontFamily: "Outfit, sans-serif",
                letterSpacing: "0.02em",
                transition: "color 0.2s ease",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
