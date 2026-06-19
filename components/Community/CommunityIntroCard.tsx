import { LinearGradient } from 'expo-linear-gradient';
import { Users } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { COMMUNITY_GRADIENT_COLORS } from '../../utils/community';

export function CommunityIntroCard() {
  return (
    <LinearGradient
      colors={COMMUNITY_GRADIENT_COLORS}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.icon}>
        <Users color="#ffffff" size={32} />
      </View>

      <Text style={styles.title}>Espace d’échange</Text>

      <Text style={styles.text}>
        Publie un message, partage ton ressenti et échange avec les autres élèves.
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 22,
    alignItems: 'center',
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    color: '#e0f2fe',
    textAlign: 'center',
    lineHeight: 22,
  },
});