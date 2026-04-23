import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MessagesSquare } from 'lucide-react-native';

// IMPORT DU COMPOSANT RÉUTILISABLE
import PreviewRibbon from '../../components/PreviewRibbon'; 

export default function ContactScreen() {
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      {/* HEADER AVEC FLÈCHE ET TITRE CENTRÉ */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => router.replace('/(tabs)')} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ChevronLeft color="#023e8a" size={30} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discussion</Text>
      </View>

      {/* CONTENU CENTRAL (MESSAGE D'ATTENTE) */}
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MessagesSquare size={50} color="#00b4d8" strokeWidth={1.5} />
        </View>
        
        <Text style={styles.title}>Discuter avec un intervenant</Text>
        <Text style={styles.info}>
          {"L'interface de chat sera disponible ici bientôt pour poser vos questions en direct et en toute confidentialité."}
        </Text>
        
        {/* UTILISATION DU COMPOSANT (Il se centre automatiquement par défaut) */}
        <PreviewRibbon position="top"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: '#f8fafc' 
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 55 : 35,
    padding: 10,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#023e8a',
    textAlign: 'center',
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 40 
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#00b4d8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  title: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#1e293b',
    marginBottom: 15,
    textAlign: 'center'
  },
  info: { 
    textAlign: 'center', 
    color: '#64748b', 
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30
  }
});