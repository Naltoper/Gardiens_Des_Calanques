import { LogIn, QrCode } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { QrScannerModal } from '../components/auth/QrScannerModal';
import { LyceeBackground } from '../components/backgrounds/LyceeBackground';
import { GradientButton } from '../components/buttons/GradientButton';
import { PageHeader } from '../components/headers/PageHeader';
import { KeyboardAwareBody } from '../components/layout/KeyboardAwareBody';
import { Colors, GARDIAN_CLAIR } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const C = {
  primary: Colors.light.primary,
  surface: GARDIAN_CLAIR,
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
};

export default function LoginScreen() {
  const { login } = useAuth();
  const [busy, setBusy] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<'id' | 'password' | null>(null);

  const handleLogin = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await login({ identifier, password });
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.screenRoot}>
      <LyceeBackground>
        <PageHeader
          title="Connexion"
          subtitle="Les Gardiens des Calanques"
        />
        <KeyboardAwareBody>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logo.jpg')}
                style={styles.logo}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.title}>Les Gardiens des Calanques</Text>
            <Text style={styles.subtitle}>Espace élève</Text>

            <View style={styles.card}>
              <Text style={styles.label}>Identifiant</Text>
              <View style={styles.identifierRow}>
                <TextInput
                  style={[
                    styles.input,
                    styles.identifierInput,
                    focusedField === 'id' && styles.inputFocused,
                  ]}
                  placeholder="Ton identifiant"
                  placeholderTextColor={C.textMuted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setFocusedField('id')}
                  onBlur={() => setFocusedField(null)}
                  accessibilityLabel="Identifiant"
                />
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => setScannerOpen(true)}
                  activeOpacity={0.82}
                  accessibilityRole="button"
                  accessibilityLabel="Scanner un QR code"
                >
                  <QrCode color={C.primary} size={22} strokeWidth={2.4} />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'password' && styles.inputFocused,
                ]}
                placeholder="Ton mot de passe"
                placeholderTextColor={C.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                accessibilityLabel="Mot de passe"
              />

              <Text style={styles.hint}>
                Les champs sont facultatifs en mode test : un clic sur
                « Se connecter » ouvre l'application.
              </Text>

              <GradientButton
                title={busy ? 'Connexion…' : 'Se connecter'}
                icon={<LogIn color="#FFFFFF" size={20} strokeWidth={2.5} />}
                onPress={handleLogin}
                colors={[C.primary, '#0077B6']}
                height={58}
                fontSize={17}
                compact
                disabled={busy}
                style={styles.loginButton}
              />
            </View>

            <Text style={styles.footer}>Lycée des Calanques • Marseille</Text>
          </ScrollView>
        </KeyboardAwareBody>
      </LyceeBackground>

      {scannerOpen ? (
        <QrScannerModal
          visible
          onClose={() => setScannerOpen(false)}
          onScanned={(value) => {
            setIdentifier(value);
            setScannerOpen(false);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: GARDIAN_CLAIR,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 108,
    height: 126,
    borderRadius: 36,
    backgroundColor: C.surface,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#48a4f4',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: C.primary,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textMuted,
    textAlign: 'center',
    marginBottom: 18,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
    marginBottom: 6,
  },
  identifierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    width: '100%',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    backgroundColor: GARDIAN_CLAIR,
    color: C.text,
    marginBottom: 14,
  },
  identifierInput: {
    flex: 1,
    width: undefined,
    marginBottom: 0,
  },
  inputFocused: {
    borderColor: C.primary,
    backgroundColor: C.surface,
  },
  qrButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
  },
  footer: {
    marginTop: 24,
    fontSize: 11,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
});
