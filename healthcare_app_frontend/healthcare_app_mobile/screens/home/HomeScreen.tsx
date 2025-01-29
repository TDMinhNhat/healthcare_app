import React from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { HeaderHome } from "./HeaderHome";
import { PromoBanner } from "../../components/PromoBanner";
import { Categories } from "../../components/Categories";
import { TopDoctors } from "../../components/TopDoctors";

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome />
      <ScrollView>
        <PromoBanner />
        <Categories />
        <TopDoctors />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
