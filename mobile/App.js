import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RecordsScreen from "./src/screens/RecordsScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <RecordsScreen />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}