import { useState } from "react";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { Dashboard } from "./components/Dashboard";
import { WorkoutPage } from "./components/WorkoutPage";
import { NutritionPage } from "./components/NutritionPage";
import { RecoveryPage } from "./components/RecoveryPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { BottomNav } from "./components/BottomNav";
import { SignalFitDataProvider } from "./data/useSignalFitData";

type Phase = "onboarding" | "main";
type Tab = "dashboard" | "workout" | "nutrition" | "recovery" | "analytics";

export default function App() {
  const [phase, setPhase] = useState<Phase>("onboarding");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "workout": return <WorkoutPage />;
      case "nutrition": return <NutritionPage />;
      case "recovery": return <RecoveryPage />;
      case "analytics": return <AnalyticsPage />;
    }
  };

  return (
    <SignalFitDataProvider>
      {phase === "onboarding" ? (
        <div
          className="size-full overflow-y-auto"
          style={{ fontFamily: "Outfit, Inter, system-ui, sans-serif" }}
        >
          <OnboardingFlow onComplete={() => setPhase("main")} />
        </div>
      ) : (
        <div
          className="size-full overflow-y-auto relative"
          style={{
            fontFamily: "Outfit, Inter, system-ui, sans-serif",
            maxWidth: 480,
            margin: "0 auto",
            background: "#07070F",
          }}
        >
          {renderPage()}
          <BottomNav active={activeTab} onChange={(tab) => setActiveTab(tab as Tab)} />
        </div>
      )}
    </SignalFitDataProvider>
  );
}
