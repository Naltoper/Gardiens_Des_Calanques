import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { Send } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
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
        />

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
  inputWrapper: { paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 25, padding: 5 },
  input: { 
    flex: 1, 
    paddingHorizontal: 15, 
    fontSize: 15, 
    color: '#1e293b', 
    maxHeight: 100,
  },
  sendBtn: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
});