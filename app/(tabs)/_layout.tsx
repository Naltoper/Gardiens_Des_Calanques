import { Tabs } from 'expo-router';
import { Home, MessageSquare, Shield, Users } from 'lucide-react-native';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from '../../components/navigation/TabBarVisibility';
import { Colors, GARDIAN_CLAIR } from '../../constants/theme';
import { ChatActivityProvider, useChatActivityContext } from '../../contexts/ChatActivityContext';
import { useWebPush } from '../../hooks/useWebPush';

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

function SuivisTabIcon({ color }: { color: string }) {
  const { hasAnyUnread } = useChatActivityContext();

  return (
    <View style={styles.tabIconWrap}>
      <MessageSquare color={color} size={TAB_ICON_SIZE} strokeWidth={2.2} />
      {hasAnyUnread ? (
        <View
          style={styles.tabUnreadBadge}
          accessibilityLabel="Nouveaux messages non lus"
        />
      ) : null}
    </View>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { hidden } = useTabBarVisibility();
  const bottomInset = isWeb ? 0 : insets.bottom;
  const tabBarHeight = isWeb ? 68 : TAB_BAR_CONTENT_HEIGHT + bottomInset;

  const visibleTabBarStyle: ViewStyle = {
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
  };

  const hiddenTabBarStyle: ViewStyle = {
    display: 'none',
    height: 0,
    overflow: 'hidden',
    position: 'absolute',
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: hidden ? hiddenTabBarStyle : visibleTabBarStyle,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarAllowFontScaling: false,
        tabBarLabel: ({ color, children }) => (
          <TabLabel color={color}>{String(children)}</TabLabel>
        ),
        // Empêche le fond de scène de passer au-dessus des labels
        sceneStyle: {
          backgroundColor: GARDIAN_CLAIR,
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
            backgroundColor: GARDIAN_CLAIR,
            overflow: 'visible',
          },
        }}
      />
      <Tabs.Screen
        name="suivis"
        options={{
          title: 'Mes Suivis',
          tabBarIcon: ({ color }) => <SuivisTabIcon color={color} />,
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
            backgroundColor: GARDIAN_CLAIR,
            overflow: 'visible',
          },
        }}
      />
      <Tabs.Screen name="cellule" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="numeros" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}

function WebPushSync() {
  useWebPush();
  return null;
}

export default function TabLayout() {
  return (
    <TabBarVisibilityProvider>
      <ChatActivityProvider>
        <WebPushSync />
        <TabNavigator />
      </ChatActivityProvider>
    </TabBarVisibilityProvider>
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
  tabIconWrap: {
    width: TAB_ICON_SIZE + 10,
    height: TAB_ICON_SIZE + 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  tabUnreadBadge: {
    position: 'absolute',
    top: -2,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.light.status.error,
    borderWidth: 1.5,
    borderColor: GARDIAN_CLAIR,
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
