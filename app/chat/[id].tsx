import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { ImagePlus, Send, ShieldCheck, X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
} from 'react-native';

import { ChatHeader } from '../../components/headers/ChatHeader';
import { ChatBubble } from '../../components/cards/ChatBubble';
import { KeyboardAwareBody } from '../../components/layout/KeyboardAwareBody';
import { ScreenErrorBoundary } from '../../components/layout/ScreenErrorBoundary';
import { ImageLightboxModal } from '../../components/modals/ImageLightboxModal';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';
import { ReportDetailModal } from '../../components/modals/ReportDetailModal';
import { supabase } from '../../lib/supabase';
import { Report } from '../../types/report';
import { uploadImageToSupabase } from '../../utils/uploadImage';
import { notify } from '../../utils/notify';
import { markChatRead } from '../../utils/chatReadState';
import { parseRouteParam } from '../../utils/routeParam';

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    role?: string | string[];
  }>();
  const reportId = parseRouteParam(params.id);
  const role = parseRouteParam(params.role) === 'admin' ? 'admin' : 'user';
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerWrap} pointerEvents="box-none">
        <ChatHeader
          reportId={reportId}
          role={role}
          onShowDetails={reportId ? () => setModalVisible(true) : undefined}
        />
      </View>

      {!reportId ? (
        <ChatUnavailable
          title="Discussion introuvable"
          subtitle="L'identifiant du signalement est manquant. Reviens à Mes Suivis pour ouvrir le chat depuis une carte."
        />
      ) : (
        <ScreenErrorBoundary
          fallback={(retry) => (
            <ChatUnavailable
              title="Impossible d'ouvrir le chat"
              subtitle="Le chargement a échoué. Tu peux réessayer ou revenir en arrière."
              onRetry={retry}
            />
          )}
        >
          <ChatConversation
            reportId={reportId}
            role={role}
            modalVisible={modalVisible}
            onCloseModal={() => setModalVisible(false)}
          />
        </ScreenErrorBoundary>
      )}
    </View>
  );
}

function ChatUnavailable({
  title,
  subtitle,
  onRetry,
}: {
  title: string;
  subtitle: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackTitle}>{title}</Text>
      <Text style={styles.fallbackSubtitle}>{subtitle}</Text>
      {onRetry ? (
        <TouchableOpacity
          onPress={onRetry}
          style={styles.retryBtn}
          accessibilityRole="button"
          accessibilityLabel="Réessayer"
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function ChatConversation({
  reportId,
  role,
  modalVisible,
  onCloseModal,
}: {
  reportId: string;
  role: 'user' | 'admin';
  modalVisible: boolean;
  onCloseModal: () => void;
}) {
  const [newMessage, setNewMessage] = useState('');
  const [pendingImage, setPendingImage] = useState<{
    uri: string;
    mimeType?: string;
    fileName?: string;
  } | null>(null);
  const [lightboxUri, setLightboxUri] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [reportData, setReportData] = useState<Report | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const stickToEndRef = useRef(true);

  const { messages, sendMessage, loading, fetchMessages, error } = useChatMessages(reportId);
  const keyboardVisible = useKeyboardVisible();

  const scrollToLatest = useCallback((animated = true) => {
    if (!stickToEndRef.current) return;
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      void markChatRead(reportId);
    }, [reportId]),
  );

  useEffect(() => {
    if (messages.length === 0) return;
    void markChatRead(reportId);
  }, [reportId, messages.length]);

  useEffect(() => {
    if (messages.length === 0) return;
    const frame = requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    });
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [messages.length]);

  useEffect(() => {
    if (!keyboardVisible || messages.length === 0) return;
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(timeout);
  }, [keyboardVisible, messages.length]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const show = Keyboard.addListener(showEvent, (event) => {
      const delay = Math.min((event?.duration ?? 250) + 40, 400);
      timeout = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, delay);
    });
    return () => {
      show.remove();
      if (timeout) clearTimeout(timeout);
    };
  }, []);

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
      stickToEndRef.current = true;
      return;
    }

    notify('Erreur', "Impossible d'envoyer le message.");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchReportDetails = async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('reports')
          .select('*')
          .eq('id', reportId)
          .maybeSingle();

        if (cancelled) return;
        if (queryError) {
          console.warn('[chat] report', queryError.message);
          return;
        }
        if (data) setReportData(data as Report);
      } catch (caught) {
        console.warn('[chat] report', caught);
      }
    };

    void fetchReportDetails();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  return (
    <>
      <KeyboardAwareBody>
        <ImageBackground
          source={require('../../assets/images/lyceeBg.jpg')}
          style={styles.chatBackground}
          imageStyle={styles.chatBackgroundImage}
          resizeMode="cover"
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => String(item?.id ?? index)}
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
            onScroll={(event) => {
              const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
              const distanceFromEnd =
                contentSize.height - (contentOffset.y + layoutMeasurement.height);
              stickToEndRef.current = distanceFromEnd < 80;
            }}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <ChatBubble
                item={item}
                isMyMessage={item.sender_role === role}
                index={index}
                onImagePress={setLightboxUri}
              />
            )}
            ListEmptyComponent={
              loading ? (
                <View style={styles.emptyChatWrapper}>
                  <ActivityIndicator size="large" color="#48a4f4" />
                  <Text style={styles.loadingText}>Chargement de la discussion…</Text>
                </View>
              ) : (
                <View style={styles.emptyChatWrapper}>
                  <View style={styles.emptyChatContainer}>
                    <View style={styles.emptyIconWrapper}>
                      <ShieldCheck color="#76c893" size={36} strokeWidth={2} />
                    </View>
                    <Text style={styles.emptyChatText}>
                      {error ?? 'Aucun message pour le moment.'}
                    </Text>
                    <Text style={styles.emptyChatSubText}>
                      {error
                        ? 'Le bouton retour reste disponible en haut à gauche.'
                        : role === 'user'
                          ? "Pose tes questions ou apporte des précisions. Ton échange avec la cellule est strictement confidentiel et sécurisé."
                          : "Initiez la discussion avec l'élève de manière bienveillante. Cet espace d'échange est entièrement sécurisé."}
                    </Text>
                  </View>
                </View>
              )
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
              onFocus={() => {
                stickToEndRef.current = true;
                scrollToLatest(true);
              }}
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
      <ReportDetailModal
        visible={modalVisible}
        onClose={onCloseModal}
        report={reportData}
      />
      <ImageLightboxModal
        visible={!!lightboxUri}
        uri={lightboxUri}
        onClose={() => setLightboxUri(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#E2F4F3' },
  headerWrap: {
    zIndex: 40,
    elevation: 40,
  },
  listContent: { padding: 20, flexGrow: 1 },
  inputWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#E2F4F3',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 25,
    padding: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#1e293b',
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  fallbackTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  fallbackSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#023E8A',
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
