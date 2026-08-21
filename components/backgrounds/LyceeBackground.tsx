import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type LyceeBackgroundProps = {
  children: React.ReactNode;
};

/** Fond photo lycée + voile clair — partagé Accueil / La Cellule. */
export function LyceeBackground({ children }: LyceeBackgroundProps) {
  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../../assets/images/lyceeBg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(248, 250, 252, 0.4)']}
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
  },
  backgroundImage: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    flex: 1,
  },
});
