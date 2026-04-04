import { router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function DetailScreen() {
  const { id, name, address, price, tags } = useLocalSearchParams<{
    id?: string;
    name?: string;
    address?: string;
    price?: string;
    tags?: string;
  }>();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <Text style={styles.title}>{name || "Restaurant details"}</Text>
      <Text style={styles.text}>Spot ID: {id}</Text>
      <Text style={styles.text}>{address}</Text>
      <Text style={styles.text}>{price}</Text>
      <Text style={styles.text}>{tags}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingTop: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#444",
    marginBottom: 6,
  },
  backBtn: {
    marginBottom: 14,
    alignSelf: "flex-start",
  },
  backText: {
    fontWeight: "700",
    color: "#111",
  },
});
