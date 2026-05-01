import type { Spot } from "@/src/types/spot";

export function spotToDetailParams(spot: Spot) {
  return {
    id: spot.id,
    name: spot.name,
    address: spot.address,
    price: spot.price_category || "₱80–₱120",
  };
}
