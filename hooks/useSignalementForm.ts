import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { supabase } from '../lib/supabase';
import { uploadImageToSupabase } from '../utils/uploadImage';
import { useUserToken } from './useUserToken';

type SelectedImage = {
  uri: string;
  mimeType?: string;
  fileName?: string;
};

export const useSignalementForm = () => {
  const userToken = useUserToken();
  const isWeb = Platform.OS === 'web';

  const [isAnonyme, setIsAnonyme] = useState(true);
  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');
  const [typeHarcelement, setTypeHarcelement] = useState('');
  const [urgence, setUrgence] = useState('');
  const [dateApproximative, setDateApproximative] = useState('');
  const [lieu, setLieu] = useState('');
  const [frequence, setFrequence] = useState('');
  const [nbVictimes, setNbVictimes] = useState('');
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const resetForm = useCallback(() => {
    setIsAnonyme(true);
    setNom('');
    setDesc('');
    setTypeHarcelement('');
    setUrgence('');
    setDateApproximative('');
    setLieu('');
    setFrequence('');
    setNbVictimes('');
    setSelectedImage(null);
  }, []);

  const handleSend = async () => {
    if (!desc.trim() || !typeHarcelement) {
      const msg = 'Veuillez remplir le type de harcèlement et la description.';
      isWeb ? alert(msg) : Alert.alert('Erreur', msg);
      return;
    }

    if (!userToken) {
      const msg = 'Identifiant utilisateur non disponible.';
      isWeb ? alert(msg) : Alert.alert('Erreur', msg);
      return;
    }

    setLoading(true);

    let imageUrl: string | null = null;
    if (selectedImage) {
      imageUrl = await uploadImageToSupabase(selectedImage.uri, 'report-photos', {
        mimeType: selectedImage.mimeType,
        fileName: selectedImage.fileName,
      });

      if (!imageUrl) {
        console.error('[signalement] Upload image échoué', {
          uri: selectedImage.uri,
          mimeType: selectedImage.mimeType,
          fileName: selectedImage.fileName,
        });
        const msg =
          "Échec de l'envoi de la photo. Le signalement va être transmis sans pièce jointe.";
        isWeb ? alert(msg) : Alert.alert('Attention', msg);
      }
    }

    const { error } = await supabase.from('reports').insert([
      {
        content: desc,
        is_anonyme: isAnonyme,
        author_name: isAnonyme ? 'Anonyme' : nom,
        user_token: userToken,
        status: 'Non traité',
        type_harcelement: typeHarcelement,
        urgence: urgence,
        date_faits: dateApproximative,
        lieu: lieu,
        frequence: frequence,
        nb_victimes: nbVictimes,
        image_url: imageUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error('[signalement] Insertion Supabase échouée', error.message);
      const msg = 'Impossible d\'envoyer le signalement.';
      isWeb ? alert(msg) : Alert.alert('Erreur', msg);
    } else {
      resetForm();
      setIsSent(true);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      const msg = 'Tu dois autoriser l\'accès aux photos pour ajouter une image.';
      isWeb ? alert(msg) : Alert.alert('Permission refusée', msg);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri,
        mimeType: asset.mimeType ?? undefined,
        fileName: asset.fileName ?? undefined,
      });
    }
  };

  return {
    isAnonyme,
    setIsAnonyme,
    nom,
    setNom,
    desc,
    setDesc,
    typeHarcelement,
    setTypeHarcelement,
    urgence,
    setUrgence,
    dateApproximative,
    setDateApproximative,
    lieu,
    setLieu,
    frequence,
    setFrequence,
    nbVictimes,
    setNbVictimes,
    image: selectedImage?.uri ?? null,
    setImage: (uri: string | null) => {
      if (!uri) {
        setSelectedImage(null);
        return;
      }
      setSelectedImage((prev) => ({
        uri,
        mimeType: prev?.uri === uri ? prev.mimeType : undefined,
        fileName: prev?.uri === uri ? prev.fileName : undefined,
      }));
    },
    pickImage,
    loading,
    isSent,
    setIsSent,
    handleSend,
    resetForm,
  };
};
