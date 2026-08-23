import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AnonymityBadge } from '../../components/banners/AnonymityBadge';
import { GradientButton } from '../../components/buttons/GradientButton';
import { PageHeader } from '../../components/headers/PageHeader';
import { LegalWarningModal } from '../../components/modals/LegalWarningModal';
import { RevealIdentityWarningModal } from '../../components/modals/RevealIdentityWarningModal';
import CustomSelect from '../../components/signalement/CustomSelect';
import SignalementSuccess from '../../components/signalement/SignalementSuccess';
import { SELECT_FIELDS } from '../../constants/signalementFields';
import { Colors, GARDIAN_CLAIR, PAGE_SCENE_BACKDROP } from '../../constants/theme';
import { useRevealIdentity } from '../../hooks/useRevealIdentity';
import { useSignalementForm } from '../../hooks/useSignalementForm';

const C = {
  primary: Colors.light.primary,
  surface: Colors.light.surface,
  border: Colors.light.border,
  text: Colors.light.text,
  textMuted: Colors.light.textMuted,
  cardBg: GARDIAN_CLAIR,
  error: Colors.light.status.error,
};

const VALIDATION_MESSAGE =
  'Veuillez remplir le type de harcèlement et la description des faits pour envoyer le signalement';

function FormLabel({
  children,
  required = false,
}: {
  children: string;
  required?: boolean;
}) {
  return (
    <Text style={styles.label}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );
}

function ValidationToast({
  visible,
  message,
}: {
  visible: boolean;
  message: string;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -12, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.toast, { opacity, transform: [{ translateY }] }]}
      pointerEvents="none"
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

export default function SignalerScreen() {
  const router = useRouter();

  const {
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
    handleSend,
  } = useSignalementForm();

  const revealIdentity = useRevealIdentity(isAnonyme, setIsAnonyme);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleMenu = (menuName: string) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  const showValidationToast = () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000);
  };

  const handleSubmitPress = () => {
    const missingType = !typeHarcelement.trim();
    const missingDesc = !desc.trim();

    if (missingType || missingDesc) {
      showValidationToast();
      return;
    }

    setShowWarningModal(true);
  };

  const getValueById = (id: string) => {
    const values: Record<string, string> = {
      types: typeHarcelement,
      urgence,
      dateApproximative,
      lieu,
      frequence,
      nbVictimes,
    };
    if (id === 'date') return dateApproximative;
    return values[id];
  };

  const setterById = (id: string, val: string) => {
    const setters: Record<string, (v: string) => void> = {
      types: setTypeHarcelement,
      urgence: setUrgence,
      date: setDateApproximative,
      lieu: setLieu,
      frequence: setFrequence,
      nbVictimes: setNbVictimes,
    };
    setters[id](val);
  };

  useFocusEffect(
    useCallback(() => {
      // Réinitialisation uniquement à l'arrivée sur l'onglet (pas au blur, pas à chaque rendu)
      setIsSent(false);
      setShowWarningModal(false);
      setActiveMenu(null);
      setFocusedField(null);
      setToastVisible(false);

      return () => {
        if (toastTimer.current) {
          clearTimeout(toastTimer.current);
          toastTimer.current = null;
        }
      };
    }, []),
  );

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../assets/images/lyceeBgBlur.png')}
        style={styles.screenBackground}
        imageStyle={styles.screenBackgroundImage}
        resizeMode="cover"
      >
        <PageHeader
          title="Fiche de Signalement"
          subtitle="Signale une situation en toute confidentialité."
        />

        <ValidationToast visible={toastVisible} message={VALIDATION_MESSAGE} />

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <Text style={styles.formHeading}>Fiche de signalement</Text>

            <View style={styles.switchContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Rester anonyme ?</Text>
                <Text style={styles.subLabel}>Ton identité sera masquée</Text>
              </View>
              <Switch
                value={isAnonyme}
                onValueChange={revealIdentity.onAnonymityChange}
                trackColor={{ false: '#CBD5E1', true: '#76C893' }}
                thumbColor={isAnonyme ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            {!isAnonyme && (
              <View style={styles.section}>
                <FormLabel>Ton identité :</FormLabel>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === 'nom' && styles.inputFocused,
                  ]}
                  placeholder="Nom, Prénom et Classe"
                  placeholderTextColor={C.textMuted}
                  value={nom}
                  onChangeText={setNom}
                  onFocus={() => setFocusedField('nom')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            )}

            {[0, 2, 4].map((startIndex) => {
              const rowFields = SELECT_FIELDS.slice(startIndex, startIndex + 2);
              const isRowActive = rowFields.some((f) => activeMenu === f.id);

              return (
                <View
                  style={[styles.row, isRowActive && styles.rowActive]}
                  key={`row-${startIndex}`}
                >
                  {rowFields.map((field) => {
                    const isMenuOpen = activeMenu === field.id;
                    return (
                      <View
                        style={[styles.column, isMenuOpen && styles.columnActive]}
                        key={field.id}
                      >
                        <CustomSelect
                          label={field.label}
                          value={getValueById(field.id)}
                          options={field.options}
                          visible={isMenuOpen}
                          onToggle={() => toggleMenu(field.id)}
                          onSelect={(val) => setterById(field.id, val as string)}
                          placeholder={field.placeholder}
                          required={field.id === 'types'}
                        />
                      </View>
                    );
                  })}
                </View>
              );
            })}

            <View style={styles.section}>
              <FormLabel required>Description des faits :</FormLabel>
              <TextInput
                style={[
                  styles.input,
                  styles.inputLarge,
                  focusedField === 'desc' && styles.inputFocused,
                  !desc.trim() && toastVisible && styles.inputError,
                ]}
                multiline
                placeholder="Raconte-nous ce qu'il se passe..."
                placeholderTextColor={C.textMuted}
                value={desc}
                onChangeText={setDesc}
                onFocus={() => setFocusedField('desc')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.section}>
              <FormLabel>Pièce jointe (Optionnel) :</FormLabel>

              {image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setImage(null)}
                  >
                    <Text style={styles.removeImageText}>Supprimer la photo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickImage}
                  activeOpacity={0.7}
                >
                  <Text style={styles.uploadButtonText}>📸 Ajouter une photo / preuve</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Afin de garantir la protection de tous, rappelle-toi que le signalement de faits
                volontairement inexacts est sanctionné par la loi (Art. 226-10 du Code pénal).
              </Text>
            </View>

            <GradientButton
              title={loading ? 'Transmission...' : 'Envoyer le signalement'}
              onPress={handleSubmitPress}
              colors={[C.primary, '#0077B6']}
              height={62}
              fontSize={17}
              style={{ marginTop: 4, opacity: loading ? 0.6 : 1 }}
              disabled={loading}
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                {isAnonyme
                  ? '🛡️ Ce signalement est strictement anonyme. Aucune donnée personnelle n\'est enregistrée.'
                  : '👤 Ce signalement est nominatif. Seuls les intervenants autorisés pourront consulter ton nom.'}
              </Text>
            </View>
          </View>

          <View style={styles.anonymityFooter}>
            <AnonymityBadge />
          </View>

          <LegalWarningModal
            visible={showWarningModal}
            onClose={() => setShowWarningModal(false)}
            onConfirm={() => {
              setShowWarningModal(false);
              handleSend();
            }}
          />

          <RevealIdentityWarningModal
            visible={revealIdentity.warningVisible}
            onCancel={revealIdentity.cancelReveal}
            onConfirm={revealIdentity.confirmReveal}
          />
        </ScrollView>
      </ImageBackground>

      <SignalementSuccess
        visible={isSent}
        onGoSuivis={() => {
          setIsSent(false);
          router.replace('/(tabs)/suivis');
        }}
        onClose={() => {
          setIsSent(false);
          router.replace('/(tabs)');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: PAGE_SCENE_BACKDROP,
  },
  screenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: PAGE_SCENE_BACKDROP,
  },
  screenBackgroundImage: {
    opacity: 1,
  },
  toast: {
    position: 'absolute',
    top: 12,
    left: 20,
    right: 20,
    zIndex: 9999,
    backgroundColor: Colors.light.status.errorBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.light.status.error,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: {
    color: Colors.light.status.errorText,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: C.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'visible',
  },
  formHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: C.border,
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: C.text,
    marginBottom: 8,
  },
  required: {
    color: C.error,
    fontWeight: '800',
  },
  subLabel: {
    fontSize: 13,
    color: C.textMuted,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    backgroundColor: GARDIAN_CLAIR,
    color: C.text,
  },
  inputFocused: {
    borderColor: C.primary,
    backgroundColor: C.surface,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  inputError: {
    borderColor: C.error,
  },
  inputLarge: {
    height: 150,
    textAlignVertical: 'top',
    paddingTop: 13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
    overflow: 'visible',
  },
  rowActive: {
    zIndex: 500,
    elevation: 500,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
    zIndex: 1,
    overflow: 'visible',
  },
  columnActive: {
    zIndex: 1000,
    elevation: 1000,
  },
  uploadButton: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    backgroundColor: GARDIAN_CLAIR,
  },
  uploadButtonText: {
    color: C.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  imagePreviewContainer: {
    alignItems: 'center',
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 14,
    padding: 15,
    borderWidth: 1,
    borderColor: C.border,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeImageButton: {
    marginTop: 10,
    padding: 10,
  },
  removeImageText: {
    color: Colors.light.status.error,
    fontWeight: '700',
    fontSize: 14,
  },
  warningBox: {
    marginBottom: 18,
    padding: 14,
    backgroundColor: Colors.light.status.warningBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.status.warning,
  },
  warningText: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
  },
  infoBox: {
    marginTop: 18,
    padding: 14,
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: C.primary,
  },
  infoText: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  anonymityFooter: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
  },
});
