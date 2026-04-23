import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldAlert, MessageSquare, Info, Phone, Mail, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');


const InstallBanner = () => {
  // On n'affiche la bannière QUE sur le Web et sur un navigateur Mobile
  // (Note: Sur PC, Platform.OS est aussi 'web', mais on cible l'usage mobile)
  if (Platform.OS !== 'web') return null;

  const apkUrl = "https://github.com/Naltoper/GardiensApp_v0/releases/download/v1.0.0/GDC.apk"; // lien apk
// TODO
  return (
    <View style={styles.bannerContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.bannerTitle}>Application Intervenants</Text>
        <Text style={styles.bannerSubtitle}>Installez l&apos;app pour recevoir les alertes en direct.</Text>
      </View>
      <TouchableOpacity 
        onPress={() => Linking.openURL(apkUrl)}
        style={styles.downloadBtn}
      >
        <Text style={styles.downloadBtnText}>Installer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();

  const menuButtons = [
    { 
        title: "Fiche de Signalement", 
        route: "/(tabs)/signalement", 
        colors: ["#48a4f4ff", "#10ac56ff","#48a4f4ff"], 
        icon: <ShieldAlert color="white" size={32} />, 
        fullWidth: true,
        isPriority: true
    },
    { 
        title: "Mes signalements", 
        route: "/(tabs)/mes-signalements", 
        colors: ["#00b4d8", "#76c893"], 
        icon: <MessageSquare color="white" size={24} /> 
    },
    { 
        title: "La Cellule", 
        route: "/(tabs)/cellule", 
        colors: ["#76c893","#00b4d8"], 
        icon: <Info color="white" size={24} /> 
    },
    { 
        title: "Numéros Utiles", 
        route: "/(tabs)/numeros", 
        colors: ["#48cae4", "#99d98c"], 
        icon: <Phone color="white" size={24} /> 
    },
    { 
        title: "Nous Contacter", 
        route: "/(tabs)/contact", 
        colors: ["#99d98c","#48cae4"], 
        icon: <Mail color="white" size={24} /> 
    },
  ];

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* --- AJOUT DE LA BANNIÈRE ICI --- */}
        <InstallBanner />

        {/* En-tête avec votre logo en rond */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.headerTitle}>Les Gardiens des Calanques</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>
            {"Un espace sécurisé et bienveillant pour briser le silence et lutter contre le harcélement scolaire.\n\n Votre anonymat est notre priorité."}
          </Text>
        </View>
        
        
        {/* Grille de navigation avec Gradients */}
        <View style={styles.grid}>
          {menuButtons.map((btn, index) => (
            <TouchableOpacity 
              key={index}
              style={btn.fullWidth ? styles.fullWidthContainer : styles.halfWidthContainer}
              activeOpacity={0.9}
              onPress={() => router.push(btn.route as any)}
            >
              <LinearGradient
                colors={btn.colors as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <View style={styles.iconContainer}>{btn.icon}</View>
                <Text style={styles.buttonText}>
                  {btn.title}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <View style={styles.securityBadge}>
            <Shield size={14} color="#0077b6" />
            <Text style={styles.footerNote}> Anonymat garanti</Text>
          </View>
          <Text style={styles.lyceeNote}>Lycée des Calanques • Marseille</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', // Laisse le layout gérer la couleur
  },
  container: { 
    flexGrow: 1, 
    padding: 24, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  logoContainer: {
    width: 170,
    height: 200,
    borderRadius: 60,
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    padding: 3,
    marginBottom: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#48a4f4ff',
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  headerTitle: { 
    fontSize: 34, 
    fontWeight: '800', 
    color: '#023e8a', 
    textAlign: 'center',
    letterSpacing: 0.5
  },
  divider: {
    width: 50,
    height: 4,
    backgroundColor: '#76c893', 
    borderRadius: 2,
    marginVertical: 12,
  },
  subtitle: { 
    fontSize: 20, 
    color: '#52718e', 
    textAlign: 'center', 
    lineHeight: 20,
    paddingHorizontal: 15
  },
  grid: { 
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 50,
  },
  fullWidthContainer: {
    width: '100%',
    marginBottom: 8,
  },
  halfWidthContainer: {
    width: '48%',
    height: 110,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    marginBottom: 5,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '700', 
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  footer: {
    marginTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#caf0f8',
  },
  footerNote: {
    fontSize: 15,
    color: '#0077b6',
    fontWeight: '600',
  },
  lyceeNote: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '500'
  },
  bannerContainer: {
    backgroundColor: '#023e8a',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#48a4f4ff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bannerTitle: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  bannerSubtitle: {
    color: '#caf0f8',
    fontSize: 11,
    marginTop: 2,
  },
  downloadBtn: {
    backgroundColor: '#76c893',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  downloadBtnText: {
    color: '#023e8a',
    fontWeight: '800',
    fontSize: 13,
  },
});