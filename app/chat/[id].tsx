import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { Send, ShieldCheck } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StatusBar, 
  StyleSheet, TextInput, TouchableOpacity, View, Text, ImageBackground } from 'react-native';
import { ChatHeader } from '../../components/headers/ChatHeader';
import { ChatBubble } from '../../components/cards/ChatBubble';
import { useChatMessages } from '../../hooks/useChatMessages';
import { ReportDetailModal } from '../../components/modals/ReportDetailModal';
import { supabase } from '../../lib/supabase';
import { Report } from '../../types/report';



export default function ChatScreen() {
  const params = useLocalSearchParams();
  const reportId = Array.isArray(params.id) ? params.id[0] : params.id;
  const role = params.role as 'user' | 'admin';
  
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // --- NOUVEAUX ÉTATS POUR LA MODALE ---
  const [reportData, setReportData] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { messages, sendMessage, loading } = useChatMessages(reportId);

  const handleSend = async () => {
    const success = await sendMessage(newMessage, role);
    if (success) setNewMessage('');
  };

  // Charger les détails du signalement pour la modale
  useEffect(() => {
    if (!reportId) return;

    const fetchReportDetails = async () => {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (!error && data) {
        setReportData(data as Report);
      }
    };

    fetchReportDetails();
  }, [reportId]);

  // Auto-scroll à chaque nouveau message
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />
      
      {/* 1. PASSAGE DE LAFONCTION AU HEADER */}
      <ChatHeader 
        reportId={reportId} 
        role={role} 
        onShowDetails={() => setModalVisible(true)} 
      />

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 35}
      >
        {/* IMAGE BACKGROUND AJOUTÉE ICI */}
        <ImageBackground
          source={require('../../assets/images/lyceeBg.jpg')}
          style={styles.chatBackground}
          imageStyle={styles.chatBackgroundImage}
          resizeMode="cover" // Remplit l'écran sans déformer le ratio de l'image
        >
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => (
                <ChatBubble 
                  item={item} 
                  isMyMessage={item.sender_role === role} 
                />
              )}
              // AJOUT DE L'ÉTAT VIDE STYLISÉ (Avec étirement forcé pour occuper le fond)
              ListEmptyComponent={
                <View style={styles.emptyChatWrapper}>
                  <View style={styles.emptyChatContainer}>
                  <View style={styles.emptyIconWrapper}>
                    <ShieldCheck color="#76c893" size={36} strokeWidth={2} />
                  </View>
                  <Text style={styles.emptyChatText}>Aucun message pour le moment.</Text>
                  <Text style={styles.emptyChatSubText}>
                    {role === 'user' 
                      ? "Pose tes questions ou apporte des précisions. Ton échange avec la cellule est strictement confidentiel et sécurisé."
                      : "Initiez la discussion avec l'élève de manière bienveillante. Cet espace d'échange est entièrement sécurisé."
                    }
                  </Text>
                </View>
                </View>
              }
            />
          </ImageBackground>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput 
              style={[styles.input, { outlineStyle: 'none' } as any]}
              value={newMessage} 
              onChangeText={setNewMessage} 
              placeholder="Ton message..."
              placeholderTextColor="#94a3b8"
              multiline
            />

            <TouchableOpacity onPress={handleSend} disabled={!newMessage.trim() || loading}>
              <LinearGradient
                colors={newMessage.trim() ? ["#48a4f4", "#10ac56"] : ["#e2e8f0", "#cbd5e1"]}
                style={styles.sendBtn}
              >
                <Send size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* 2. AJOUT DE LA MODALE EXISTANTE */}
      <ReportDetailModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        report={reportData} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1 },
  listContent: { padding: 20 },
  inputWrapper: { 
    paddingHorizontal: 15, 
    paddingVertical: 15, 
    backgroundColor: '#ffffff', 
    borderTopWidth: 1, 
    borderTopColor: '#e2e8f0', // Une couleur de bordure légèrement plus douce

    // --- EFFET DE SUPERPOSITION / OMBRE VERS LE HAUT ---
    zIndex: 10, // S'assure que la barre de saisie reste AU-DESSUS des messages qui défilent
    elevation: 8, // Force l'ombre sur Android (se diffuse tout autour, y compris vers le haut)
    shadowColor: '#000000', // Couleur de l'ombre sur iOS
    shadowOffset: { width: 0, height: -2 }, // <-- HEIGHT NÉGATIF : Propulse l'ombre vers le HAUT de l'écran
    shadowOpacity: 0.08, // Une opacité très douce pour ne pas alourdir le design
    shadowRadius: 6, // Un floutage large pour que l'effet soit très diffus et élégant
  },  
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 25, padding: 5 },
  input: { 
    flex: 1, 
    paddingHorizontal: 15, 
    fontSize: 15, 
    color: '#1e293b', 
    maxHeight: 100,
  },
  sendBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  emptyChatContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  emptyIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyChatText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyChatSubText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  chatBackground: {
    flex: 1,
    width: '100%',
    height: '100%', // Force l'étirement rigide jusqu'au bout du parent
    backgroundColor: '#f8fafc',
  },
  chatBackgroundImage: {
    opacity: 0.16, // Conserve ton superbe effet filigrane opaque
  },
  emptyChatWrapper: {
    flex: 1,
    minHeight: 400, // Donne une hauteur minimale pour forcer le composant à se détendre vers le bas
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});