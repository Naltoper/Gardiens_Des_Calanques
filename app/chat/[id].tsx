import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { ImagePlus, Send, ShieldCheck, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, RefreshControl, StatusBar, 
  StyleSheet, TextInput, TouchableOpacity, View, Text, ImageBackground } from 'react-native';
import { ChatHeader } from '../../components/headers/ChatHeader';
import { ChatBubble } from '../../components/cards/ChatBubble';
import { KeyboardAwareBody } from '../../components/layout/KeyboardAwareBody';
import { ImageLightboxModal } from '../../components/modals/ImageLightboxModal';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';
import { ReportDetailModal } from '../../components/modals/ReportDetailModal';
import { supabase } from '../../lib/supabase';
import { Report } from '../../types/report';
import { uploadImageToSupabase } from '../../utils/uploadImage';
import { notify } from '../../utils/notify';
import { markChatRead } from '../../utils/chatReadState';



export default function ChatScreen() {
  const params = useLocalSearchParams();
  const reportId = Array.isArray(params.id) ? params.id[0] : params.id;
  const role = params.role as 'user' | 'admin';
  
  const [newMessage, setNewMessage] = useState('');
  const [pendingImage, setPendingImage] = useState<{
    uri: string;
    mimeType?: string;
    fileName?: string;
  } | null>(null);
  const [lightboxUri, setLightboxUri] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // --- NOUVEAUX ÉTATS POUR LA MODALE ---
  const [reportData, setReportData] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { messages, sendMessage, loading, fetchMessages } = useChatMessages(reportId);
  const keyboardVisible = useKeyboardVisible();

  const scrollToLatest = useCallback((animated = true) => {
    const run = () => flatListRef.current?.scrollToEnd({ animated });
    requestAnimationFrame(() => {
      setTimeout(run, 60);
      setTimeout(run, 320);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!reportId) return;
      void markChatRead(String(reportId));
    }, [reportId]),
  );

  useEffect(() => {
    if (!reportId || messages.length === 0) return;
    void markChatRead(String(reportId));
  }, [reportId, messages.length]);

  useEffect(() => {
    if (keyboardVisible && messages.length > 0) {
      scrollToLatest(true);
    }
  }, [keyboardVisible, messages.length, scrollToLatest]);

  const pickChatImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      notify('Permission refusée', 'Autorise l’accès aux photos pour envoyer une image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;
    const asset = result.assets[0];
    setPendingImage({
      uri: asset.uri,
      mimeType: asset.mimeType ?? undefined,
      fileName: asset.fileName ?? undefined,
    });
  };

  const handleSend = async () => {
    if (!newMessage.trim() && !pendingImage) return;

    let imageUrl: string | null = null;
    if (pendingImage) {
      imageUrl = await uploadImageToSupabase(pendingImage.uri, 'report-photos', {
        mimeType: pendingImage.mimeType,
        fileName: pendingImage.fileName,
      });
      if (!imageUrl) {
        notify('Erreur', "Impossible d'envoyer l'image.");
        return;
      }
    }

    const success = await sendMessage(newMessage, role, imageUrl);
    if (success) {
      setNewMessage('');
      setPendingImage(null);
      return;
    }

    notify('Erreur', "Impossible d'envoyer le message.");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
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
      scrollToLatest(true);
    }
  }, [messages, scrollToLatest]);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. PASSAGE DE LAFONCTION AU HEADER */}
      <ChatHeader 
        reportId={reportId} 
        role={role} 
        onShowDetails={() => setModalVisible(true)} 
      />

      <KeyboardAwareBody>
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
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#48a4f4"
                />
              }
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item, index }) => (
                <ChatBubble 
                  item={item} 
                  isMyMessage={item.sender_role === role}
                  index={index}
                  onImagePress={setLightboxUri}
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
          {pendingImage ? (
            <View style={styles.previewRow}>
              <Image source={{ uri: pendingImage.uri }} style={styles.previewImage} />
              <TouchableOpacity
                onPress={() => setPendingImage(null)}
                style={styles.previewRemove}
                accessibilityRole="button"
                accessibilityLabel="Retirer l'image"
              >
                <X size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={pickChatImage}
              style={styles.attachBtn}
              accessibilityRole="button"
              accessibilityLabel="Ajouter une image"
            >
              <ImagePlus size={20} color="#023e8a" />
            </TouchableOpacity>
            <TextInput 
              style={[styles.input, { outlineStyle: 'none' } as any]}
              value={newMessage} 
              onChangeText={setNewMessage} 
              placeholder="Ton message..."
              placeholderTextColor="#94a3b8"
              multiline
              onFocus={() => scrollToLatest(true)}
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={(!newMessage.trim() && !pendingImage) || loading}
            >
              <LinearGradient
                colors={
                  newMessage.trim() || pendingImage
                    ? ['#48a4f4', '#10ac56']
                    : ['#e2e8f0', '#cbd5e1']
                }
                style={styles.sendBtn}
              >
                <Send size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareBody>
      {/* 2. AJOUT DE LA MODALE EXISTANTE */}
      <ReportDetailModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        report={reportData} 
      />
      <ImageLightboxModal
        visible={!!lightboxUri}
        uri={lightboxUri}
        onClose={() => setLightboxUri(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#E2F4F3' },
  listContent: { padding: 20 },
  inputWrapper: { 
    paddingHorizontal: 15, 
    paddingVertical: 15, 
    backgroundColor: '#E2F4F3', 
    borderTopWidth: 1, 
    borderTopColor: '#e2e8f0',

    // --- EFFET DE SUPERPOSITION / OMBRE VERS LE HAUT ---
    zIndex: 10,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },  
  attachBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewRow: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  previewImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#cbd5e1',
  },
  previewRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
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
    height: '100%',
    backgroundColor: '#E2F4F3',
  },
  chatBackgroundImage: {
    opacity: 0.16,
  },
  emptyChatWrapper: {
    flex: 1,
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});