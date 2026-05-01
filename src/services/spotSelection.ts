import type { Spot } from "@/src/types/spot";

let selectedSpot: Spot | null = null;

export function setSelectedSpot(spot: Spot) {
  selectedSpot = spot;
}

export function getSelectedSpot(id?: string) {
  if (!selectedSpot) return undefined;
  if (id && selectedSpot.id !== id) return undefined;
  return selectedSpot;
}

export function clearSelectedSpot() {
  selectedSpot = null;
}
