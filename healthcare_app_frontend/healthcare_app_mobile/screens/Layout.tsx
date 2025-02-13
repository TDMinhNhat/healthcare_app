import { View, StyleSheet, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LayoutProps {
  children: React.ReactNode;
  style?: any;
}

export default function Layout({ children, style }: LayoutProps) {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={[styles.container, style]}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
