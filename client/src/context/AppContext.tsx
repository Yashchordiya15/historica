import { createContext, useContext, useState, ReactNode } from "react";
import { Monument } from "../data/monuments";

interface AppContextType {
  selectedMonument: Monument | null;
  setSelectedMonument: (monument: Monument | null) => void;
  isVRMode: boolean;
  setVRMode: (enabled: boolean) => void;
  isARMode: boolean;
  setARMode: (enabled: boolean) => void;
  timePeriod: "present" | "past" | "ancient";
  setTimePeriod: (period: "present" | "past" | "ancient") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const [isVRMode, setVRMode] = useState(false);
  const [isARMode, setARMode] = useState(false);
  const [timePeriod, setTimePeriod] = useState<"present" | "past" | "ancient">("present");

  return (
    <AppContext.Provider
      value={{
        selectedMonument,
        setSelectedMonument,
        isVRMode,
        setVRMode,
        isARMode,
        setARMode,
        timePeriod,
        setTimePeriod,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
