import { colors, radius, space } from "@/src/theme/tokens";
import { Pressable, StyleSheet, Text } from "react-native";

type Variant = "primary" | "muted";

export function AppButton({
  label,
  onPress,
  variant = "primary",
  fullWidth = false,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  fullWidth?: boolean;
}) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.muted,
        fullWidth && styles.fullWidth,
      ]}
      onPress={onPress}
    >
      <Text style={isPrimary ? styles.primaryText : styles.mutedText}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: { width: "100%" },

  primary: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.primaryText,
    fontWeight: "700",
  },

  muted: {
    backgroundColor: colors.mutedBtn,
  },
  mutedText: {
    color: colors.mutedBtnText,
    fontWeight: "700",
  },
});
