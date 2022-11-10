import React from "react";
import { Text, Fill, useFont, Canvas } from "@shopify/react-native-skia";
import { Dimensions, StyleSheet } from "react-native";

export default function Textas() {
  const fontSize = 32;
  const font = useFont(require("./my-font.ttf"), fontSize);
  if (font === null) {
    return null;
  }
  return (
    <Text
      x={10}
      y={Dimensions.get("window").height - 30}
      text="Tauras Dubinskas"
      font={font}
    />
  );
}
