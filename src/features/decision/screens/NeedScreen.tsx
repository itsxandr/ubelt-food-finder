import { markSessionSeen, saveSession } from "@/src/services/sessionService";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

const PRIMARY_OPTIONS = [
  "I'm broke",
  "Need a study place",
  "Need a snack",
  "Date spot",
  "Pick for me",
];

const MORE_OPTIONS = ["High protein", "Open late", "Quick bite"];

export default function NeedScreen() {
  const [showMore, setShowMore] = useState(false);
  const [dontShowEveryTime, setDontShowEveryTime] = useState(false);

  const onPick = async (value: string) => {
    await saveSession({
      lastPreference: value,
      dontShowEveryTime,
    });
    await markSessionSeen();

    router.push({
      pathname: "/result",
      params: { need: value },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What do you need right now?</Text>

      {PRIMARY_OPTIONS.map((opt) => (
        <Pressable key={opt} style={styles.button} onPress={() => onPick(opt)}>
          <Text style={styles.buttonText}>{opt}</Text>
        </Pressable>
      ))}

      <Pressable onPress={() => setShowMore((v) => !v)}>
        <Text style={styles.more}>
          {showMore ? "Hide options" : "More options"}
        </Text>
      </Pressable>

      {showMore && (
        <View style={{ marginTop: 8, width: "100%" }}>
          {MORE_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              style={styles.secondaryButton}
              onPress={() => onPick(opt)}
            >
              <Text style={styles.secondaryText}>{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>Don't show every time</Text>
        <Switch
          value={dontShowEveryTime}
          onValueChange={setDontShowEveryTime}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 20 },
  button: {
    backgroundColor: "#FF5A5F",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  more: { marginTop: 6, color: "#666", fontWeight: "600" },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  secondaryText: { color: "#333", fontWeight: "600" },
  toggleRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleText: { fontSize: 15, color: "#444" },
});
