import { ImagePlus, Send, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { GARDIAN_CLAIR } from '../../constants/theme';
import { useRevealIdentity } from '../../hooks/useRevealIdentity';
import { autofillNameProps, autofillOffProps } from '../../utils/textInputAutofill';
import { GradientButton } from '../buttons/GradientButton';
import { RevealIdentityWarningModal } from '../modals/RevealIdentityWarningModal';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const BACKDROP_MS = 220;
const SHEET_MS = 240;

type CommunityCreateModalProps = {
  visible: boolean;
  onClose: () => void;
  onPublished: () => void;
  title: string;
  setTitle: (text: string) => void;
  content: string;
  setContent: (text: string) => void;
  isAnonyme: boolean;
  setIsAnonyme: (value: boolean) => void;
  authorName: string;
  setAuthorName: (text: string) => void;
  loading: boolean;
  formError: string | null;
  selectedImage: { uri: string } | null;
  pickImage: () => void;
  removeSelectedImage: () => void;
  handleCreatePost: () => Promise<boolean> | boolean;
};

export function CommunityCreateModal({
  visible,
  onClose,
  onPublished,
  title,
  setTitle,
  content,
  setContent,
  isAnonyme,
  setIsAnonyme,
  authorName,
  setAuthorName,
  loading,
  formError,
  selectedImage,
  pickImage,
  removeSelectedImage,
  handleCreatePost,
}: CommunityCreateModalProps) {
  const reveal = useRevealIdentity(isAnonyme, setIsAnonyme);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(-SCREEN_HEIGHT * 0.35);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: BACKDROP_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: SHEET_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!mounted) return;

    Animated.parallel([
      Animated.timing(sheetTranslateY, {
        toValue: -SCREEN_HEIGHT * 0.35,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, mounted, backdropOpacity, sheetTranslateY]);

  const onPublish = async () => {
    const published = await handleCreatePost();
    if (published) {
      onPublished();
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Modal
        visible={mounted}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={onClose}
      >
        <View style={styles.root}>
          <Animated.View
            pointerEvents="auto"
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Fermer"
            />
          </Animated.View>

          <KeyboardAvoidingView
            style={styles.sheetWrap}
            behavior={undefined}
            pointerEvents="box-none"
          >
            <Animated.View
              style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}
            >
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Créer un sujet</Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel="Fermer"
                >
                  <X color="#64748b" size={22} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.fieldLabel}>Titre du sujet</Text>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Titre du sujet"
                  placeholderTextColor="#94a3b8"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={80}
                  {...autofillOffProps}
                />

                <Text style={styles.fieldLabel}>Contenu</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Écris ton message..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  value={content}
                  onChangeText={setContent}
                  {...autofillOffProps}
                />

                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                  <ImagePlus color="#023e8a" size={18} />
                  <Text style={styles.imagePickerText}>
                    {selectedImage ? 'Changer la photo' : 'Joindre une photo'}
                  </Text>
                </TouchableOpacity>

                {selectedImage ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={removeSelectedImage}
                    >
                      <X color="#ffffff" size={18} />
                    </TouchableOpacity>
                  </View>
                ) : null}

                <View style={styles.switchRow}>
                  <View style={styles.switchCopy}>
                    <Text style={styles.switchTitle}>Rester anonyme</Text>
                    <Text style={styles.switchSubtitle}>Ton nom ne sera pas affiché.</Text>
                  </View>
                  <Switch
                    value={isAnonyme}
                    onValueChange={reveal.onAnonymityChange}
                    trackColor={{ false: '#cbd5e1', true: '#76c893' }}
                    thumbColor={isAnonyme ? '#10ac56' : '#f4f4f5'}
                  />
                </View>

                {!isAnonyme ? (
                  <TextInput
                    style={styles.input}
                    placeholder="Ton nom public"
                    placeholderTextColor="#94a3b8"
                    value={authorName}
                    onChangeText={setAuthorName}
                    {...autofillNameProps}
                  />
                ) : null}

                {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

                <GradientButton
                  title={loading ? 'Publication...' : 'Publier'}
                  icon={<Send color="white" size={16} />}
                  colors={['#48a4f4', '#10ac56']}
                  onPress={onPublish}
                  disabled={loading}
                  compact
                  height={46}
                  fontSize={15}
                />
              </ScrollView>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <RevealIdentityWarningModal
        visible={reveal.warningVisible}
        onCancel={reveal.cancelReveal}
        onConfirm={reveal.confirmReveal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
  },
  sheetWrap: {
    width: '100%',
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
  sheet: {
    backgroundColor: GARDIAN_CLAIR,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    maxHeight: SCREEN_HEIGHT * 0.72,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.12)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(2, 62, 138, 0.12)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#023e8a',
  },
  scroll: {
    maxHeight: SCREEN_HEIGHT * 0.58,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#023e8a',
    marginBottom: 6,
  },
  titleInput: {
    backgroundColor: '#F4FBFA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.16)',
    marginBottom: 14,
  },
  textArea: {
    minHeight: 72,
    backgroundColor: '#F4FBFA',
    borderRadius: 10,
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
  switchCopy: {
    flex: 1,
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
    backgroundColor: '#F4FBFA',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.16)',
    marginBottom: 12,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 18,
  },
});
