import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';

interface InstallBannerProps {
  title: string;
  subtitle: string;
  url: string;
}

export const InstallBanner = ({ title, subtitle, url }: InstallBannerProps) => {
  // Si on est déjà sur l'app mobile, on n'affiche rien
  if (Platform.OS !== 'web') return null;

  const handleDownload = () => {
    Linking.openURL(url).catch((err) => 
      console.error("Impossible d'ouvrir le lien :", err)
    );
  };

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.bannerTitle}>{title}</Text>
        <Text style={styles.bannerSubtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity 
        onPress={handleDownload}
        style={styles.downloadBtn}
        activeOpacity={0.8}
      >
        <Text style={styles.downloadBtnText}>Installer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#023e8a',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#48a4f4ff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  bannerSubtitle: {
    color: '#caf0f8',
    fontSize: 11,
    marginTop: 2,
  },
  downloadBtn: {
    backgroundColor: '#76c893',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  downloadBtnText: {
    color: '#023e8a',
    fontWeight: '800',
    fontSize: 13,
  },
});