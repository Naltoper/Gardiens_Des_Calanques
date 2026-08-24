import { LogIn, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { LyceeBackground } from '../components/backgrounds/LyceeBackground';
import { GradientButton } from '../components/buttons/GradientButton';
import { PageHeader } from '../components/headers/PageHeader';
import { Colors, GARDIAN_CLAIR } from '../constants/theme';
import { DEFAULT_TEST_PROFILE, useAuth } from '../contexts/AuthContext';

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

  const handleLogin = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await login();
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
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.jpg')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.title}>Les Gardiens des Calanques</Text>
          <Text style={styles.subtitle}>Espace élève — mode test</Text>

          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <Shield color={C.primary} size={26} strokeWidth={2.5} />
            </View>
            <Text style={styles.cardTitle}>Authentification simplifiée</Text>
            <Text style={styles.cardText}>
              Un clic suffit pour accéder à l'application avec le profil de test
              « {DEFAULT_TEST_PROFILE.displayName} ». Aucun identifiant n'est
              demandé.
            </Text>

            <GradientButton
              title={busy ? 'Connexion…' : 'Se connecter'}
              icon={
                <LogIn color="#FFFFFF" size={20} strokeWidth={2.5} />
              }
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
        </View>
      </LyceeBackground>
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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 140,
    height: 164,
    borderRadius: 48,
    backgroundColor: C.surface,
    marginBottom: 16,
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
    fontSize: 26,
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
    marginBottom: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: C.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: C.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
  },
  footer: {
    marginTop: 28,
    fontSize: 11,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
});
