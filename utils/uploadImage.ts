import { Platform } from 'react-native';

import { supabase } from '../lib/supabase';

export type UploadImageOptions = {
  mimeType?: string | null;
  fileName?: string | null;
};

function resolveExtension(
  uri: string,
  mimeType?: string | null,
  fileName?: string | null,
): string {
  if (fileName?.includes('.')) {
    return fileName.split('.').pop()!.toLowerCase();
  }

  const fromUri = uri.split('?')[0].split('.').pop()?.toLowerCase();
  if (fromUri && fromUri.length <= 5 && !fromUri.includes('/')) {
    return fromUri;
  }

  if (mimeType?.includes('/')) {
    const ext = mimeType.split('/')[1]?.toLowerCase();
    if (ext === 'jpeg') return 'jpg';
    if (ext) return ext;
  }

  return 'jpg';
}

function resolveContentType(ext: string, mimeType?: string | null, blobType?: string): string {
  if (mimeType) return mimeType;
  if (blobType && blobType.startsWith('image/')) return blobType;

  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    heic: 'image/heic',
    heif: 'image/heif',
    gif: 'image/gif',
  };

  return map[ext] || 'image/jpeg';
}

export const uploadImageToSupabase = async (
  fileUri: string,
  bucketName: string = 'report-photos',
  options?: UploadImageOptions,
): Promise<string | null> => {
  try {
    console.log('[uploadImage] Début upload', {
      bucketName,
      platform: Platform.OS,
      uriPreview: fileUri.slice(0, 80),
      mimeType: options?.mimeType,
      fileName: options?.fileName,
    });

    const response = await fetch(fileUri);
    if (!response.ok) {
      console.error('[uploadImage] Lecture fichier échouée', {
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    const blob = await response.blob();
    console.log('[uploadImage] Blob prêt', {
      size: blob.size,
      type: blob.type,
    });

    if (blob.size === 0) {
      console.error('[uploadImage] Fichier vide (0 octet)');
      return null;
    }

    const ext = resolveExtension(fileUri, options?.mimeType, options?.fileName);
    const contentType = resolveContentType(ext, options?.mimeType, blob.type);
    const storagePath = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, blob, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error('[uploadImage] Erreur Supabase Storage', {
        message: uploadError.message,
        name: uploadError.name,
        bucket: bucketName,
        contentType,
        fileSize: blob.size,
      });
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    console.log('[uploadImage] Upload réussi', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('[uploadImage] Erreur critique', error);
    return null;
  }
};
