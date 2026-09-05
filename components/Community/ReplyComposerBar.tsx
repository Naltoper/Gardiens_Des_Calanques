import { Send, X } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Platform,
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
import { RevealIdentityWarningModal } from '../modals/RevealIdentityWarningModal';

type ReplyComposerBarProps = {
  content: string;
  setContent: (text: string) => void;
  isAnonyme: boolean;
  setIsAnonyme: (value: boolean) => void;
  authorName: string;
  setAuthorName: (text: string) => void;
  loading: boolean;
  onSend: () => void;
  onClose?: () => void;
  showClose?: boolean;
  autoFocus?: boolean;
};

export function ReplyComposerBar({
  content,
  setContent,
  isAnonyme,
  setIsAnonyme,
  authorName,
  setAuthorName,
  loading,
  onSend,
  onClose,
  showClose = true,
  autoFocus = true,
}: ReplyComposerBarProps) {
  const inputRef = useRef<TextInput>(null);
  const reveal = useRevealIdentity(isAnonyme, setIsAnonyme);

  useEffect(() => {
    if (!autoFocus) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, [autoFocus]);

  return (
    <View style={styles.bar}>
      <View style={styles.topRow}>
        <Text style={styles.label}>Répondre</Text>
        <View style={styles.anonRow}>
          <Text style={styles.anonLabel}>Anonyme</Text>
          <Switch
            value={isAnonyme}
            onValueChange={reveal.onAnonymityChange}
            trackColor={{ false: '#cbd5e1', true: '#76c893' }}
            thumbColor={isAnonyme ? '#10ac56' : '#f4f4f5'}
          />
          {showClose && onClose ? (
            <TouchableOpacity
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Fermer la saisie"
            >
              <X color="#64748b" size={18} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {!isAnonyme ? (
        <TextInput
          style={styles.nameInput}
          placeholder="Ton nom public"
          placeholderTextColor="#94a3b8"
          value={authorName}
          onChangeText={setAuthorName}
          {...autofillNameProps}
        />
      ) : null}

      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Ajouter un commentaire..."
          placeholderTextColor="#94a3b8"
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus={autoFocus}
          returnKeyType="send"
          onSubmitEditing={onSend}
          {...autofillOffProps}
        />
        <TouchableOpacity
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
          onPress={onSend}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Publier le commentaire"
        >
          <Send color="#ffffff" size={16} />
        </TouchableOpacity>
      </View>

      <RevealIdentityWarningModal
        visible={reveal.warningVisible}
        onCancel={reveal.cancelReveal}
        onConfirm={reveal.confirmReveal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(2, 62, 138, 0.16)',
    backgroundColor: GARDIAN_CLAIR,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#023e8a',
  },
  anonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  anonLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.16)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 8,
    backgroundColor: GARDIAN_CLAIR,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(2, 62, 138, 0.16)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#F4FBFA',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#023e8a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});
