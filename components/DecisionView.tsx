import {
  BookOpen,
  ChevronDown,
  Coffee,
  DollarSign,
  Heart,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DecisionViewProps {
  onSelectIntent: (intent: string) => void;
}

export default function DecisionView({ onSelectIntent }: DecisionViewProps) {
  const [showMore, setShowMore] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.brandBox} />
      <Text style={styles.title}>What do you need right now?</Text>

      <View style={styles.grid}>
        <DecisionTile
          label="I’m broke"
          icon={<DollarSign size={22} color="#1A1A1A" />}
          onPress={() => onSelectIntent("budget")}
        />
        <DecisionTile
          label="Study place"
          icon={<BookOpen size={22} color="#1A1A1A" />}
          onPress={() => onSelectIntent("study")}
        />
        <DecisionTile
          label="Need a snack"
          icon={<Coffee size={22} color="#1A1A1A" />}
          onPress={() => onSelectIntent("snack")}
        />
        <DecisionTile
          label="Date spot"
          icon={<Heart size={22} color="#1A1A1A" />}
          onPress={() => onSelectIntent("date")}
        />
        <DecisionTile
          label="Pick for me"
          icon={<Zap size={22} color="#FFF" />}
          isFeatured
          onPress={() => onSelectIntent("random")}
        />
      </View>

      <TouchableOpacity
        style={styles.expandTrigger}
        onPress={() => setShowMore(!showMore)}
      >
        <Text style={styles.expandText}>More options</Text>
        <ChevronDown size={16} color="#999" />
      </TouchableOpacity>

      {showMore && (
        <View style={styles.extraGrid}>
          {["High Protein", "Open Late", "Aircon"].map((tag) => (
            <TouchableOpacity
              key={tag}
              style={styles.tag}
              onPress={() => onSelectIntent(tag.toLowerCase())}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don’t show every time</Text>
        <Switch value={dontShowAgain} onValueChange={setDontShowAgain} />
      </View>
    </ScrollView>
  );
}

const DecisionTile = ({ label, icon, isFeatured, onPress }: any) => (
  <TouchableOpacity
    style={[styles.tile, isFeatured && styles.tileFeatured]}
    onPress={onPress}
  >
    <View style={styles.iconWrap}>{icon}</View>
    <Text style={[styles.tileLabel, isFeatured && styles.tileLabelFeatured]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  content: { padding: 24, paddingTop: 80 },
  brandBox: {
    width: 64,
    height: 64,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 32,
  },
  grid: { gap: 12 },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  tileFeatured: { backgroundColor: "#1A1A1A", borderColor: "#1A1A1A" },
  iconWrap: { marginRight: 16 },
  tileLabel: { fontSize: 17, fontWeight: "600", color: "#1A1A1A" },
  tileLabelFeatured: { color: "#FFF" },
  expandTrigger: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 6,
  },
  expandText: { color: "#999", fontSize: 15, fontWeight: "500" },
  extraGrid: { flexDirection: "row", gap: 8, marginTop: 16, flexWrap: "wrap" },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#EEE",
    borderRadius: 12,
  },
  tagText: { fontSize: 13, color: "#444", fontWeight: "600" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  footerText: { color: "#BBB", fontSize: 14 },
});
