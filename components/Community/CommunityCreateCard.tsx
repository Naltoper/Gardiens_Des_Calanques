import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Image, 
  Switch 
} from 'react-native';
import { ImagePlus, Send, X } from 'lucide-react-native';
import { GradientButton } from '../buttons/GradientButton';

// Définition stricte des Props attendues par la carte
type CommunityCreateCardProps = {
  content: string;
  setContent: (text: string) => void;
  isAnonyme: boolean;
  setIsAnonyme: (value: boolean) => void;
  authorName: string;
  setAuthorName: (text: string) => void;
  loading: boolean;
  selectedImage: { uri: string } | null;
  pickImage: () => void;
  removeSelectedImage: () => void;
  handleCreatePost: () => void;
};

export function CommunityCreateCard({
  content,
  setContent,
  isAnonyme,
  setIsAnonyme,
  authorName,
  setAuthorName,
  loading,
  selectedImage,
  pickImage,
  removeSelectedImage,
  handleCreatePost,
}: CommunityCreateCardProps) {
  return (
    <View style={styles.createCard}>
      <Text style={styles.sectionTitle}>Nouveau post</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Écris ton message..."
        placeholderTextColor="#94a3b8"
        multiline
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <ImagePlus color="#023e8a" size={22} />
        <Text style={styles.imagePickerText}>
          {selectedImage ? 'Changer la photo' : 'Ajouter une photo'}
        </Text>
      </TouchableOpacity>

      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={removeSelectedImage}
          >
            <X color="#ffffff" size={18} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchTitle}>Publier anonymement</Text>
          <Text style={styles.switchSubtitle}>Ton nom ne sera pas affiché.</Text>
        </View>
        <Switch
          value={isAnonyme}
          onValueChange={setIsAnonyme}
          trackColor={{ false: '#cbd5e1', true: '#76c893' }}
          thumbColor={isAnonyme ? '#10ac56' : '#f4f4f5'}
        />
      </View>

      {!isAnonyme && (
        <TextInput
          style={styles.input}
          placeholder="Ton nom public"
          placeholderTextColor="#94a3b8"
          value={authorName}
          onChangeText={setAuthorName}
        />
      )}

      <GradientButton
        title={loading ? 'Publication...' : 'Publier'}
        icon={<Send color="white" size={20} />}
        colors={['#48a4f4', '#10ac56']}
        onPress={handleCreatePost}
        disabled={loading}
        height={64}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  createCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#caf0f8',
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#023e8a',
    marginBottom: 14,
  },
  textArea: {
    minHeight: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    fontSize: 16,
    color: '#0f172a',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 16,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#caf0f8',
  },
  imagePickerText: {
    color: '#023e8a',
    fontSize: 15,
    fontWeight: '800',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 190,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15,23,42,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#023e8a',
  },
  switchSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 16,
  },
});