import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { useUserToken } from './useUserToken';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToSupabase } from '../utils/uploadImage';

export const useSignalementForm = () => {
  const userToken = useUserToken();
  const isWeb = Platform.OS === 'web';

  // États du formulaire
  const [isAnonyme, setIsAnonyme] = useState(true);
  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');
  const [typeHarcelement, setTypeHarcelement] = useState('');
  const [urgence, setUrgence] = useState('');
  const [dateApproximative, setDateApproximative] = useState('');
  const [lieu, setLieu] = useState('');
  const [frequence, setFrequence] = useState('');
  const [nbVictimes, setNbVictimes] = useState('');
  const [image, setImage] = useState<string | null>(null);

  // États de gestion de l'interface
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const resetForm = () => {
    setIsAnonyme(true);
    setNom('');
    setDesc('');
    setTypeHarcelement('');
    setUrgence('');
    setDateApproximative('');
    setLieu('');
    setFrequence('');
    setNbVictimes('');
    setImage(null);
  };

  const handleSend = async () => {
    // Validation
    if (!desc.trim() || !typeHarcelement) {
      const msg = "Veuillez remplir le type de harcèlement et la description.";
      isWeb ? alert(msg) : Alert.alert("Erreur", msg);
      return;
    }

    if (!userToken) {
      const msg = "Identifiant utilisateur non disponible.";
      isWeb ? alert(msg) : Alert.alert("Erreur", msg);
      return;
    }

    const confirmationMessage =
      "Je confirme que les informations transmises sont sincères. Un signalement volontairement inexact peut donner lieu à des sanctions (Art. 226-10 du Code pénal).";

    const processUpload = async () => {
      setLoading(true);
      
      // <-- NOUVEAU : 1. Gestion de l'upload de l'image
      let imageUrl: string | null = null;
      if (image) {
        imageUrl = await uploadImageToSupabase(image, 'report-photos');
        if (!imageUrl) {
          const msg = "Échec de l'envoi de la photo. Le signalement va être transmis sans pièce jointe.";
          isWeb ? alert(msg) : Alert.alert("Attention", msg);
        }
      }

      // <-- MODIFIÉ : 2. Ajout de image_url dans l'insert
      const { error } = await supabase.from('reports').insert([
        {
          content: desc,
          is_anonyme: isAnonyme,
          author_name: isAnonyme ? "Anonyme" : nom,
          user_token: userToken,
          status: "Non traité",
          type_harcelement: typeHarcelement,
          urgence: urgence,
          date_faits: dateApproximative,
          lieu: lieu,
          frequence: frequence,
          nb_victimes: nbVictimes,
          image_url: imageUrl, // <-- NOUVEAU : On sauvegarde le lien public
        },
      ]);
      setLoading(false);

      if (error) {
        const msg = "Impossible d'envoyer le signalement.";
        isWeb ? alert(msg) : Alert.alert("Erreur", msg);
      } else {
        resetForm();
        setIsSent(true);
      }
    };

    // Logique de confirmation selon la plateforme
    if (isWeb) {
      if (window.confirm(confirmationMessage)) processUpload();
    } else {
      Alert.alert("Confirmation importante", confirmationMessage, [
        { text: "Modifier", style: "cancel" },
        { text: "Confirmer l'envoi", onPress: () => processUpload() },
      ]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      quality: 0.7, 
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  

  return {
    // États
    isAnonyme, setIsAnonyme,
    nom, setNom,
    desc, setDesc,
    typeHarcelement, setTypeHarcelement,
    urgence, setUrgence,
    dateApproximative, setDateApproximative,
    lieu, setLieu,
    frequence, setFrequence,
    nbVictimes, setNbVictimes,
    image, setImage,
    pickImage,
    loading,
    isSent,
    setIsSent,
    // Actions
    handleSend,
    resetForm
  };
};