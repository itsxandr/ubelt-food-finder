import { colors, radius, space, type } from "@/src/theme/tokens";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

type Variant = "solid" | "outline";
type Size = "sm" | "lg";

export function AppChip({
  label,
  variant = "outline",
  size = "sm",
  fullWidth = false,
  style,
  textStyle,
}: {
  label: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}) {
  return (
    <View
      style={[
        styles.base,
        size === "lg" ? styles.sizeLg : styles.sizeSm,
        variant === "solid" ? styles.solid : styles.outline,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <Text
        style={[
          size === "lg" ? styles.textLg : styles.textSm,
          variant === "solid" ? styles.textSolid : styles.textOutline,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: { width: "100%" },
  sizeSm: {
    paddingHorizontal: space.sm,
    paddingVertical: space.micro,
  },
  sizeLg: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  outline: {
    backgroundColor: colors.mutedBtn,
    borderWidth: 1,
    borderColor: colors.border,
  },
  solid: {
    backgroundColor: colors.mutedBtn,
  },
  textSm: {
    fontWeight: "700",
    fontSize: type.small,
  },
  textLg: {
    fontWeight: "700",
    fontSize: type.body,
  },
  textOutline: {
    color: colors.mutedBtnText,
  },
  textSolid: {
    color: colors.subtext,
  },
});
