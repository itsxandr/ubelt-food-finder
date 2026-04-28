export type Spot = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  vibe_tags: string[];
  price_category?: string;
  rating?: number;
  distance?: string;
};
