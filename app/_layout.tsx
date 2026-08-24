import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Platform, StyleSheet, View, ViewStyle } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "../contexts/AuthContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const bgColor = "#E2F4F3";
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
        <AuthProvider>
          <RootNavigator bgColor={bgColor} />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function RootNavigator({ bgColor }: { bgColor: string }) {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#023E8A" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000dbfff" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "800", fontSize: 18 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: bgColor, flex: 1 },
      }}
    >
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="community/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2F4F3",
  },
});
