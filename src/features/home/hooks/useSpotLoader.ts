import { getUbeltSpots } from "@/src/services/dataService";
import type { Spot } from "@/src/types/spot";
import { useEffect, useState } from "react";

export function useSpotLoader() {
  const [allSpots, setAllSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = (await getUbeltSpots()) as Spot[];
        if (!active) return;
        setAllSpots(data);
      } catch (e) {
        console.error("Init error:", e);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { allSpots, loading };
}
