import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet,ViewStyle } from 'react-native';

export default function RootLayout() {
  const bgColor = '#cbe7e6c3'; // Définis ta couleur ici une seule fois
  // On définit le style Web à part avec un cast "any" pour accepter le '100dvh'
  // Cela évite l'erreur sur DimensionValue
  const webStyle: any = Platform.OS === 'web' ? {
    height: '100dvh',
    width: '100%',
    position: 'fixed',
    overflow: 'hidden',
  } : {};

  return (
    <SafeAreaProvider>
      {/* Barre d'état native */}
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      
      <SafeAreaView 
        style={[styles.container, { backgroundColor: bgColor }, webStyle as ViewStyle]} 
        edges={['top', 'bottom']}
      >
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#000dbfff' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '800', fontSize: 18 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: bgColor }, 
          }}
        >
          {/* Pas de header */}
          <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} /> 
          <Stack.Screen name="(tabs)/signalement" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/mes-signalements" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/cellule" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/numeros" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/contact" options={{ headerShown: false }} />
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