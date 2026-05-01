import type { Spot } from "@/src/types/spot";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type SpotSelectionContextValue = {
  selectedSpot: Spot | null;
  setSelectedSpot: (spot: Spot) => void;
  clearSelectedSpot: () => void;
};

const SpotSelectionContext = createContext<
  SpotSelectionContextValue | undefined
>(undefined);

export function SpotSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const value = useMemo(
    () => ({
      selectedSpot,
      setSelectedSpot,
      clearSelectedSpot: () => setSelectedSpot(null),
    }),
    [selectedSpot],
  );

  return (
    <SpotSelectionContext.Provider value={value}>
      {children}
    </SpotSelectionContext.Provider>
  );
}

export function useSpotSelection() {
  const context = useContext(SpotSelectionContext);
  if (!context) {
    throw new Error(
      "useSpotSelection must be used within SpotSelectionProvider",
    );
  }
  return context;
}
