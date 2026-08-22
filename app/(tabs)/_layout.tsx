import { Tabs } from 'expo-router';
import { Home, MessageSquare, Shield, Users } from 'lucide-react-native';
import { Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, GARDIAN_CLAIR, PAGE_SCENE_BACKDROP } from '../../constants/theme';

const TAB_ICON_SIZE = 22;
const TAB_LABEL_FONT = 11;
const TAB_BAR_CONTENT_HEIGHT = 56;
const isWeb = Platform.OS === 'web';

function TabLabel({ color, children }: { color: string; children: string }) {
  return (
    <Text
      style={[styles.tabBarLabel, { color, zIndex: 20 }]}
      numberOfLines={1}
      allowFontScaling={false}
    >
      {children}
    </Text>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = isWeb ? 0 : insets.bottom;
  const tabBarHeight = isWeb ? 68 : TAB_BAR_CONTENT_HEIGHT + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: GARDIAN_CLAIR,
          borderTopColor: Colors.light.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingTop: isWeb ? 6 : 4,
          paddingBottom: isWeb ? 10 : bottomInset,
          elevation: 24,
          zIndex: 100,
          overflow: 'visible',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
        },
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarAllowFontScaling: false,
        tabBarLabel: ({ color, children }) => (
          <TabLabel color={color}>{String(children)}</TabLabel>
        ),
        // Empêche le fond de scène de passer au-dessus des labels
        sceneStyle: {
          backgroundColor: 'transparent',
          overflow: 'visible',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => (
            <Home color={color} size={TAB_ICON_SIZE} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="signaler"
        options={{
          title: 'Signaler',
          tabBarIcon: ({ color }) => (
            <Shield color={color} size={TAB_ICON_SIZE} strokeWidth={2.2} />
          ),
          sceneStyle: {
            backgroundColor: PAGE_SCENE_BACKDROP,
            overflow: 'visible',
          },
        }}
      />
      <Tabs.Screen
        name="suivis"
        options={{
          title: 'Mes Suivis',
          tabBarIcon: ({ color }) => (
            <MessageSquare color={color} size={TAB_ICON_SIZE} strokeWidth={2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="communaute"
        options={{
          title: 'Communauté',
          tabBarIcon: ({ color }) => (
            <Users color={color} size={TAB_ICON_SIZE} strokeWidth={2.2} />
          ),
          sceneStyle: {
            backgroundColor: PAGE_SCENE_BACKDROP,
            overflow: 'visible',
          },
        }}
      />
      <Tabs.Screen name="cellule" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="numeros" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 2,
    overflow: 'visible',
    zIndex: 10,
  },
  tabBarIcon: {
    marginTop: 0,
    marginBottom: 0,
  },
  tabBarLabel: {
    fontSize: TAB_LABEL_FONT,
    fontWeight: '700',
    lineHeight: 14,
    marginTop: 2,
    marginBottom: 0,
    overflow: 'visible',
    ...(Platform.OS === 'android' ? { includeFontPadding: false as const } : {}),
  },
});
