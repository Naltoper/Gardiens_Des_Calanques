import React from 'react';
import { ScrollView, Text, StyleSheet, View, Dimensions, ImageBackground, Image, TouchableOpacity, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Info, ShieldCheck, Zap, Heart, Shield, ChevronLeft, ExternalLink } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface EngagementProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  colors: [string, string, ...string[]];
}

export default function CelluleScreen() {
  const router = useRouter();

  // Fonction pour ouvrir le lien web
  const openWebLink = () => {
    Linking.openURL('https://view.genially.com/6745954c37cfac416f351af9');
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground 
        source={require('../../assets/images/backgroundCellule.jpg')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(248, 250, 252, 0.4)']}
          style={styles.overlay}
        >
          {/* BOUTON RETOUR POSITIONNÉ EN ABSOLU */}
          <TouchableOpacity 
            onPress={() => router.replace('/(tabs)')} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ChevronLeft color="#023e8a" size={30} strokeWidth={2.5} />
          </TouchableOpacity>

          <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
              
              {/* En-tête */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Info color="#023e8a" size={40} />
                </View>
                <Text style={[styles.headerTitle, styles.textShadow]}>La Cellule</Text>
                
                <View style={styles.portraitContainer}>
                  <Image 
                    source={require('../../assets/images/portraitCellule.png')} 
                    style={styles.portraitImage}
                    resizeMode="contain"
                  />
                </View>

                <View style={styles.divider} />
                <View style={styles.subtitleContainer}>
                   <Text style={styles.subtitle}>
                    {"Les Gardiens des Calanques est une unité dédiée à votre protection et à votre écoute."}
                  </Text>
                </View>
              </View>

              {/* Section Présentation Card */}
              <View style={styles.introCard}>
                <Text style={styles.introText}>
                  Notre mission est d&apos;écouter, protéger et agir pour que chaque élève se sente en sécurité. 
                  <Text style={styles.bold}> Brisons le silence ensemble.</Text>
                </Text>
              </View>

              <Text style={[styles.sectionTitle, styles.textShadow]}>Nos engagements</Text>

              {/* Liste des engagements */}
              <View style={styles.listContainer}>
                <EngagementItem 
                  icon={<ShieldCheck color="white" size={24} />} 
                  title="Anonymat total" 
                  desc={"Tes échanges avec nous restent strictement confidentiels.\nAucune donnée personnelle n'est collectée."}
                  colors={["#00b4d8", "#0077b6"]} 
                />
                <EngagementItem 
                  icon={<Zap color="white" size={24} />} 
                  title="Réponse rapide" 
                  desc="Nos intervenants se mobilisent pour te répondre au plus vite."
                  colors={["#48a4f4ff", "#10ac56ff"]} 
                />
                <EngagementItem 
                  icon={<Heart color="white" size={24} />} 
                  title="Soutien bienveillant" 
                  desc="Une équipe à ton écoute pour t'accompagnement sans jugement."
                  colors={["#76c893", "#52b69a"]} 
                />
              </View>

              {/* NOUVEAU BOUTON LIEN WEB EXTERNE */}
              <TouchableOpacity 
                style={styles.webLinkButton} 
                onPress={openWebLink}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#f8fafc", "#f1f5f9"]}
                  style={styles.webLinkGradient}
                >
                  <View style={styles.webLinkContent}>
                    <Text style={styles.webLinkText}>Voir le contenu Genially des Gardiens Des Calanques</Text>
                    <ExternalLink size={18} color="#023e8a" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Pied de page */}
              <View style={styles.footer}>
                <View style={styles.securityBadge}>
                  <Shield size={14} color="#0077b6" />
                  <Text style={styles.footerNote}> Espace sécurisé</Text>
                </View>
                <Text style={[styles.lyceeNote, styles.textShadowMini]}>Lycée des Calanques • Marseille</Text>
              </View>
              
              <View style={{ height: 40 }} /> 
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const EngagementItem = ({ icon, title, desc, colors }: EngagementProps) => (
  <View style={styles.itemWrapper}>
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientIcon}
    >
      {icon}
    </LinearGradient>
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemDesc}>{desc}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
  },
  safeArea: { 
    flex: 1, 
  },
  container: { 
    padding: 24 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 30, 
    paddingTop: 10 
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 15,
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#023e8a', 
    textAlign: 'center',
    marginBottom: 20
  },
  portraitContainer: {
    width: width * 0.7, 
    height: width * 0.9, 
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  portraitImage: {
    width: '95%',
    height: '95%',
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
  divider: {
    width: 50,
    height: 4,
    backgroundColor: '#76c893', 
    borderRadius: 2,
    marginVertical: 12,
  },
  subtitleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  subtitle: { 
    fontSize: 16, 
    color: '#1e293b', 
    textAlign: 'center', 
    lineHeight: 22,
    fontWeight: '600'
  },
  introCard: { 
    backgroundColor: '#FFFFFF', 
    padding: 20, 
    borderRadius: 24, 
    borderLeftWidth: 8,
    borderLeftColor: '#48a4f4',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 35
  },
  introText: { 
    fontSize: 17, 
    lineHeight: 26, 
    color: '#1e293b',
    fontWeight: '500'
  },
  bold: { fontWeight: '800', color: '#023e8a' },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#023e8a', 
    marginBottom: 20 
  },
  listContainer: { gap: 15 },
  itemWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  gradientIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 17, fontWeight: '800', color: '#1e293b' },
  itemDesc: { fontSize: 14, color: '#475569', marginTop: 3, lineHeight: 18, fontWeight: '500' },
  
  // STYLES DU NOUVEAU BOUTON WEB
  webLinkButton: {
    marginTop: 30,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  webLinkGradient: {
    padding: 18,
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
    marginTop: 50, 
    alignItems: 'center' 
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 10,
    elevation: 2,
  },
  footerNote: { fontSize: 14, color: '#0077b6', fontWeight: '700' },
  lyceeNote: {
    fontSize: 11,
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '700'
  }
});