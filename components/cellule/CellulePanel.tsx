import { LinearGradient } from 'expo-linear-gradient';
import {
  ExternalLink,
  Heart,
  Info,
  Shield,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EngagementItem from '../cards/EngagementItem';
import { AudioPlayer } from '../ui/AudioPlayer';
import { ENGAGEMENTS, GENIALLY_URL } from '../../constants/cellule';

const { width } = Dimensions.get('window');

export function CellulePanel() {
  const openWebLink = async () => {
    try {
      const supported = await Linking.canOpenURL(GENIALLY_URL);
      if (supported) {
        await Linking.openURL(GENIALLY_URL);
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture du lien :", error);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Info color="#023e8a" size={40} />
        </View>
        <Text style={[styles.headerTitle, styles.textShadow]}>La Cellule</Text>
        <View style={styles.portraitContainer}>
          <Image
            source={require('../../assets/images/portraitCellule.jpg')}
            style={styles.portraitImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            Les Gardiens des Calanques est une unité dédiée à votre protection et à
            votre écoute.
          </Text>
        </View>
      </View>

      <View style={styles.introCard}>
        <Text style={styles.introText}>
          Notre mission est d&apos;écouter, protéger et agir pour que chaque élève se
          sente en sécurité.
          <Text style={styles.bold}> Brisons le silence ensemble.</Text>
        </Text>
      </View>

      <View style={styles.audioCard}>
        <Text style={styles.audioTitle}>
          Notre cellule « Les gardiens des calanques » en musique 🎵
        </Text>
        <Text style={styles.audioSubtitle}>
          Une chanson pour mieux nous connaître et partager nos valeurs.
        </Text>
        <AudioPlayer />
      </View>

      <Text style={[styles.sectionTitle, styles.textShadow]}>Nos engagements</Text>

      <View style={styles.listContainer}>
        {ENGAGEMENTS.map((engagement) => (
          <EngagementItem
            key={engagement.title}
            icon={
              engagement.icon === 'shield' ? (
                <ShieldCheck color="white" size={24} />
              ) : engagement.icon === 'zap' ? (
                <Zap color="white" size={24} />
              ) : (
                <Heart color="white" size={24} />
              )
            }
            title={engagement.title}
            desc={engagement.desc}
            colors={engagement.colors}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.webLinkButton}
        onPress={openWebLink}
        activeOpacity={0.8}
      >
        <LinearGradient colors={['#D5EDEC', '#C8E6E4']} style={styles.webLinkGradient}>
          <View style={styles.webLinkContent}>
            <Text style={styles.webLinkText}>
              Voir le contenu Genially des Gardiens Des Calanques
            </Text>
            <ExternalLink size={18} color="#023e8a" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.securityBadge}>
          <Shield size={14} color="#0077b6" />
          <Text style={styles.footerNote}> Espace sécurisé</Text>
        </View>
        <Text style={[styles.lyceeNote, styles.textShadowMini]}>
          Lycée des Calanques • Marseille
        </Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 4,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D5EDEC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#023e8a',
    textAlign: 'center',
    marginBottom: 16,
  },
  // Image native 1024×1536 (ratio 2:3) — cadre aligné pour éviter tout étirement
  portraitContainer: {
    width: width * 0.48,
    aspectRatio: 2 / 3,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 6,
    marginBottom: 10,
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  divider: {
    width: 50,
    height: 4,
    backgroundColor: '#76c893',
    borderRadius: 2,
    marginVertical: 12,
  },
  subtitleContainer: {
    backgroundColor: '#D5EDEC',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  subtitle: {
    fontSize: 15,
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
  introCard: {
    backgroundColor: '#D5EDEC',
    padding: 18,
    borderRadius: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#48a4f4',
    marginBottom: 24,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1e293b',
    fontWeight: '500',
  },
  bold: {
    fontWeight: '800',
    color: '#023e8a',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#023e8a',
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
  webLinkButton: {
    marginTop: 24,
    borderRadius: 18,
    overflow: 'hidden',
  },
  webLinkGradient: {
    padding: 16,
  },
  webLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  webLinkText: {
    fontSize: 14,
    color: '#023e8a',
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  footer: {
    marginTop: 36,
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D5EDEC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 10,
  },
  footerNote: {
    fontSize: 14,
    color: '#0077b6',
    fontWeight: '700',
  },
  lyceeNote: {
    fontSize: 11,
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700',
  },
  textShadow: {
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  textShadowMini: {
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  bottomSpacer: {
    height: 16,
  },
  audioCard: {
    backgroundColor: '#D5EDEC',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginBottom: 20,
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
    lineHeight: 23,
  },
  audioSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
    lineHeight: 18,
  },
});
