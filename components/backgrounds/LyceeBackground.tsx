import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import { GARDIAN_CLAIR } from '../../constants/theme';

type LyceeBackgroundProps = {
  children: React.ReactNode;
};

/** Fond photo lycée + voile clair opaque — Accueil / La Cellule. */
export function LyceeBackground({ children }: LyceeBackgroundProps) {
  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../assets/images/lyceeBg.jpg')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageInner}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(213, 237, 236, 0.28)', 'rgba(213, 237, 236, 0.55)']}
          style={styles.overlay}
        >
          {children}
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: GARDIAN_CLAIR,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: GARDIAN_CLAIR,
  },
  backgroundImageInner: {
    opacity: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
