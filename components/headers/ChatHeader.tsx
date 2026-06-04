import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Lock, Info, ShieldCheck, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ChatHeaderProps {
  reportId: string | undefined;
  role: 'user' | 'admin' | string | string[] | undefined;
  onShowDetails?: () => void; // <-- Callback pour déclencher l'ouverture de la modale
}

export const ChatHeader = ({ reportId, role, onShowDetails }: ChatHeaderProps) => {
  const router = useRouter();
  const isUserAuthor = role === 'user';

  const handleBack = () => {
    // ! Si c'est l'intervenant, on le redirige vers dashboard
    router.replace('/(tabs)/mes-signalements');
  };

  return (
    <LinearGradient
      colors={["#0071aa", "#42bf6e"]} // <-- Ton nouveau dégradé harmonisé avec tes boutons
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerGradient}
    >
      {/* Ligne supérieure : Retour + Titre & ID */}
      <View style={styles.headerTopContent}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color="white" size={30} strokeWidth={2.5} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {isUserAuthor ? "Échange avec un intervenant" : "Échange avec un élève"}
          </Text>
          <View style={styles.idBadge}>
            <Lock size={10} color="#caf0f8" style={{ marginRight: 4 }} />
            <Text style={styles.idText}>
                ID: {reportId?.toString().toUpperCase().slice(0, 8)}
            </Text>
          </View>
        </View>
        
        {/* Vue miroir invisible pour conserver le centrage parfait du titre */}
        <View style={styles.topRightPlaceholder} />
      </View>

      {/* Ligne inférieure : Bouton Détails centré en dessous */}
      {onShowDetails && (
        <View style={styles.headerBottomContent}>
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onShowDetails();
            }}
            style={styles.documentIconButton}
            activeOpacity={0.8}
          >
            <FileText size={15} color="#023e8a" style={{ marginRight: 6 }} />
            <Text style={styles.documentButtonText}>Détails du signalement</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 35,
    paddingBottom: 16,
    width: '100%', // S'assure que la bannière prend bien tout l'écran
    
    // --- EFFET DE SUPERPOSITION CORRIGÉ (D'UN BORD À L'AUTRE) ---
    zIndex: 10,
    elevation: 8, // Augmenté légèrement pour Android pour accompagner le changement iOS
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 }, // <-- REMIS À 0 : L'ombre descend verticalement sans dévier à gauche ou à droite
    shadowOpacity: 0.4, // Baissé un poil car l'étalement global (Radius) va intensifier l'ombre
    shadowRadius: 10, // <-- AUGMENTÉ : Propulse et diffuse l'ombre plus loin sur les côtés (gauche et droite inclus)
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTopContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center', // Centre le texte et le badge ID horizontalement
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  topRightPlaceholder: {
    width: 40, // Équilibre exact avec la largeur du backButton pour un centrage parfait
  },
  headerBottomContent: {
    alignItems: 'center',
    marginTop: 14, // Espace sous le titre pour éviter tout empiètement
  },
  idBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  idText: {
    color: '#caf0f8',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  infoButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 20, // Plus large pour une meilleure prise tactile
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  documentButtonText: {
    color: '#023e8a',
    fontSize: 13,
    fontWeight: '700',
  },
  placeholder: {
    width: 75, // Équilibre parfait pour conserver le centrage du titre
  },
  
});