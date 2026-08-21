import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, ViewStyle } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const bgColor = "#cbe7e6c3";
  // Sur web, overflow:hidden + 100dvh coupait horizontalement les labels de la tab bar.
  const webStyle: ViewStyle =
    Platform.OS === "web"
      ? {
          height: "100dvh" as unknown as number,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
        }
      : {};

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="black" translucent={false} />

      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: bgColor },
          webStyle,
        ]}
        edges={["top"]}
      >
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#000dbfff" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "800", fontSize: 18 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: bgColor, flex: 1 },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="community/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
