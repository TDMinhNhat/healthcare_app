import { SafeAreaView, Text, StatusBar } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{marginTop: StatusBar.currentHeight }}>
        <Text>Hello World!</Text>
    </SafeAreaView>
  );
}