import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Hammer } from 'lucide-react-native';

interface PreviewRibbonProps {
  message?: string;
  position?: 'top' | 'center' | 'bottom'; // Nouveau paramètre
}

export default function PreviewRibbon({ 
  message = "Cette fonctionnalité est en cours de développement",
  position = 'center' // Position par défaut
}: PreviewRibbonProps) {
  
  // On définit l'alignement vertical dynamiquement
  const getVerticalPosition = () => {
    switch (position) {
      case 'top': return 'flex-start';
      case 'bottom': return 'flex-end';
      default: return 'center';
    }
  };

  return (
    <View 
      style={[
        styles.previewContainer, 
        { justifyContent: getVerticalPosition() }
      ]} 
      pointerEvents="none"
    >
      <View style={[
        styles.previewRibbon,
        // On ajoute un peu de marge si c'est en haut ou en bas
        position === 'top' && { marginTop: Platform.OS === 'ios' ? 120 : 100 },
        position === 'bottom' && { marginBottom: 50 }
      ]}>
        <Hammer color="white" size={18} />
        <Text style={styles.previewRibbonText}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    zIndex: 100,
  },
  previewRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 61, 138, 0.63)', // Un peu moins transparent pour la lisibilité
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    marginHorizontal: 30,
    elevation: 10,
    shadowColor: '#0000000b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  previewRibbonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
    textAlign: 'center',
  },
});