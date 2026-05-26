// utils/uploadImage.ts
import * as FileSystem from 'expo-file-system/legacy'; // <-- LA CORRECTION EST ICI
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import { Platform } from 'react-native';

export const uploadImageToSupabase = async (fileUri: string, bucketName: string = 'report-photos'): Promise<string | null> => {
  try {
    console.log("🚀 Début de l'upload avec FileSystem Legacy...");

    // 1. Nettoyer l'URI et générer un nom unique
    const cleanUri = fileUri.split('?')[0];
    const fileExt = cleanUri.split('.').pop() || 'jpeg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const contentType = `image/${fileExt === 'png' ? 'png' : 'jpeg'}`;

    let fileData: ArrayBuffer | Blob;

    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      fileData = await response.blob();
    } else {
      // Lecture du fichier avec l'API Legacy
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: 'base64', 
      });
      fileData = decode(base64);
      console.log("✅ Fichier lu et converti en ArrayBuffer !");
    }

    // 2. Envoi à Supabase
    console.log("⏳ Envoi vers Supabase...");
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileData, {
        contentType: contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Erreur Supabase :", uploadError.message);
      return null;
    }

    // 3. Récupération de l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log("✅ Upload terminé ! URL :", publicUrl);
    return publicUrl;

  } catch (error) {
    console.error("❌ Erreur critique lors de l'upload :", error);
    return null;
  }
};