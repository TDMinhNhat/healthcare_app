import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { theme } from "../theme/theme";
import i18n from "../utils/locales/i18n";

export const PromoBanner = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{i18n.t("lookingForSpecialistDoctor")}</Text>
        <Text style={styles.subtitle}>{i18n.t("upLoadAPrescription")}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{i18n.t("bookNow")}</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{
          uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-73w7dPshOLP3OUhNvPDwfSbG76utCu.png",
        }}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#cdc3ff",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: "row",
  },
  content: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#442c81",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
});
