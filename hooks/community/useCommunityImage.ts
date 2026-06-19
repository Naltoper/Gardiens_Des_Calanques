import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import type { SelectedImage } from '../../types/community';
import {
    COMMUNITY_IMAGE_BUCKET,
    MAX_COMMUNITY_IMAGE_SIZE,
} from '../../utils/community';

export const useCommunityImage = () => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission refusée',
        'Tu dois autoriser l’accès aux photos pour ajouter une image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    if (asset.fileSize && asset.fileSize > MAX_COMMUNITY_IMAGE_SIZE) {
      Alert.alert(
        'Image trop grande',
        'La photo ne doit pas dépasser 2 Mo.'
      );
      return;
    }

    setSelectedImage({
      uri: asset.uri,
      fileName: asset.fileName,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
    });
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const uploadPostImage = async () => {
    if (!selectedImage) {
      return null;
    }

    const response = await fetch(selectedImage.uri);
    const blob = await response.blob();

    const extension =
      selectedImage.fileName?.split('.').pop() ||
      selectedImage.mimeType?.split('/').pop() ||
      'jpg';

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(COMMUNITY_IMAGE_BUCKET)
      .upload(fileName, blob, {
        contentType: selectedImage.mimeType || 'image/jpeg',
      });

    if (uploadError) {
      console.error('Erreur upload image:', uploadError.message);
      Alert.alert('Erreur', 'Impossible d’envoyer la photo.');
      return null;
    }

    const { data } = supabase.storage
      .from(COMMUNITY_IMAGE_BUCKET)
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  return {
    selectedImage,
    pickImage,
    removeSelectedImage,
    uploadPostImage,
  };
};