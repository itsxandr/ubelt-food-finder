import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { getDistance } from "geolib";

export type TimeBucket = "breakfast" | "lunch" | "dinner" | "late";

type SessionState = {
  lastPreference?: string;
  dontShowEveryTime?: boolean;
  lastSeenAt?: number; // epoch ms
  lastTimeBucket?: TimeBucket;
  lastLocation?: { latitude: number; longitude: number };
};

const KEY = "ubelt_session_v1";

// Tweak thresholds here
const INACTIVITY_MS = 1000 * 60 * 60; // 1 hour
const LOCATION_CHANGE_METERS = 1200; // 1.2km = 1200

export function getTimeBucket(date = new Date()): TimeBucket {
  const h = date.getHours();
  if (h >= 5 && h < 11) return "breakfast";
  if (h >= 11 && h < 16) return "lunch";
  if (h >= 16 && h < 22) return "dinner";
  return "late";
}

export async function loadSession(): Promise<SessionState> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as SessionState) : {};
}

export async function saveSession(patch: Partial<SessionState>) {
  const prev = await loadSession();
  const next = { ...prev, ...patch };
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

export async function getCurrentLocationSafe(): Promise<
  { latitude: number; longitude: number } | undefined
> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return undefined;
    const pos = await Location.getCurrentPositionAsync({});
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  } catch {
    return undefined;
  }
}

export async function shouldShowNeedScreen(): Promise<{
  showNeed: boolean;
  reason: string;
  lastPreference?: string;
}> {
  const now = Date.now();
  const nowBucket = getTimeBucket();
  const session = await loadSession();

  // First-time user
  if (!session.lastPreference) {
    return { showNeed: true, reason: "first_time" };
  }

  // If user didn't disable the screen, show it normally
  if (!session.dontShowEveryTime) {
    return {
      showNeed: true,
      reason: "toggle_off",
      lastPreference: session.lastPreference,
    };
  }

  // Check inactivity
  if (session.lastSeenAt && now - session.lastSeenAt > INACTIVITY_MS) {
    return {
      showNeed: true,
      reason: "inactive",
      lastPreference: session.lastPreference,
    };
  }

  // Check time bucket change
  if (session.lastTimeBucket && session.lastTimeBucket !== nowBucket) {
    return {
      showNeed: true,
      reason: "time_changed",
      lastPreference: session.lastPreference,
    };
  }

  // Check significant location change (if we can fetch current location)
  const currentLoc = await getCurrentLocationSafe();
  if (session.lastLocation && currentLoc) {
    const meters = getDistance(session.lastLocation, currentLoc);
    if (meters > LOCATION_CHANGE_METERS) {
      return {
        showNeed: true,
        reason: "location_changed",
        lastPreference: session.lastPreference,
      };
    }
  }

  return {
    showNeed: false,
    reason: "stable_context",
    lastPreference: session.lastPreference,
  };
}
