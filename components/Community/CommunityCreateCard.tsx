import React from 'react';
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ImagePlus, Send, X } from 'lucide-react-native';

import { GARDIAN_CLAIR } from '../../constants/theme';
import { GradientButton } from '../buttons/GradientButton';

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
    <View style={styles.composer}>
      <Text style={styles.sectionTitle}>Nouveau sujet</Text>

      <TextInput
        style={styles.textArea}
        placeholder="Titre ou message du sujet..."
        placeholderTextColor="#94a3b8"
        multiline
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <ImagePlus color="#023e8a" size={18} />
        <Text style={styles.imagePickerText}>
          {selectedImage ? 'Changer la photo' : 'Joindre une photo'}
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
        height={52}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    backgroundColor: GARDIAN_CLAIR,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(2, 62, 138, 0.12)',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#023e8a',
    marginBottom: 10,
  },
  textArea: {
    minHeight: 88,
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#0f172a',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.16)',
    marginBottom: 12,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    marginBottom: 12,
  },
  imagePickerText: {
    color: '#023e8a',
    fontSize: 14,
    fontWeight: '700',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  imagePreview: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#d1e4e3',
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
    marginBottom: 12,
    gap: 12,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#023e8a',
  },
  switchSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  input: {
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.16)',
    marginBottom: 12,
  },
});
