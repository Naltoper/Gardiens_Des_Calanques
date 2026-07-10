import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons'; // Ou tes icônes habituelles

export function AudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0); // Temps actuel en ms
  const [duration, setDuration] = useState(0); // Durée totale en ms

  // Chargement du son déclenché uniquement à la demande
  async function loadSound() {
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('../../assets/audio/hymneGDC.mp3'),
      { shouldPlay: false },
      onPlaybackStatusUpdate
    );
    soundRef.current = newSound;
    setSound(newSound);
    return newSound;
  }

  // Cette fonction s'exécute automatiquement en continu pendant la lecture
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);

      // Si le morceau est fini, on réinitialise au début
      if (status.didJustFinish) {
        setPosition(0);
        setIsPlaying(false);
      }
    }
  };

  // Référence pour manipuler le son de manière synchrone sans re-renders infinis
  const soundRef = useRef<Audio.Sound | null>(null);

  useFocusEffect(
    useCallback(() => {
      // Au focus : On ne charge rien automatiquement pour préserver le Web (Lazy Loading)
      
      // Au défocus (quand l'élève quitte la page) : Nettoyage immédiat de la musique
      return () => {
        if (soundRef.current) {
          soundRef.current.stopAsync().catch(() => {});
          soundRef.current.unloadAsync().catch(() => {});
          soundRef.current = null;
        }
        setSound(null);
        setIsPlaying(false);
        setPosition(0);
      };
    }, []) // 💡 Liste de dépendances vide pour éviter les boucles sur le Web
  );

  // Gestion du Play / Pause à la demande (Lazy Loading)
  async function handlePlayPause() {
    try {
      let currentSound = soundRef.current;

      // Si le son n'est pas encore chargé (premier clic), on le charge maintenant
      if (!currentSound) {
        currentSound = await loadSound();
      }

      if (isPlaying) {
        await currentSound.pauseAsync();
      } else {
        await currentSound.playAsync();
      }
    } catch (error) {
      console.warn("L'audio n'a pas pu se lancer ou est bloqué par le navigateur :", error);
    }
  }

  // Quand l'utilisateur déplace la barre de progression
  const handleSliderValueChange = async (value: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value);
    }
  };

  // Fonctions outils pour formater les millisecondes en MM:SS
  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.controlsContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={handleSliderValueChange}
          minimumTrackTintColor="#0077b6"
          maximumTrackTintColor="#0077b6"
          thumbTintColor="#0077b6"
        />
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00214d',
    padding: 15,
    borderRadius: 40,
    marginVertical: 10,
  },
  playButton: {
    backgroundColor: '#0077b6',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flex: 1,
    marginLeft: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
});