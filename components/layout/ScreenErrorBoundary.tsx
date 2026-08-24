import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  children: ReactNode;
  fallback?: ReactNode | ((retry: () => void) => ReactNode);
};

type State = {
  error: Error | null;
};

/**
 * Empêche un crash de rendu de remplacer tout l'écran par une page blanche.
 * Le header (bouton retour) doit rester EN DEHORS de cette boundary.
 */
export class ScreenErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[screen]', error.message, info.componentStack);
  }

  retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    const { fallback } = this.props;
    if (typeof fallback === 'function') return fallback(this.retry);
    if (fallback) return fallback;

    return (
      <View style={styles.box}>
        <Text style={styles.title}>Impossible d'afficher cet écran</Text>
        <Text style={styles.subtitle}>Tu peux réessayer ou revenir en arrière.</Text>
        <TouchableOpacity
          onPress={this.retry}
          style={styles.retryBtn}
          accessibilityRole="button"
          accessibilityLabel="Réessayer"
        >
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#023E8A',
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
