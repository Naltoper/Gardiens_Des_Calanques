import { X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ImageLightboxModal } from './ImageLightboxModal';
import { Report } from '../../types/report';

const ANIM_DURATION = 140;

interface ReportDetailModalProps {
  visible: boolean;
  onClose: () => void;
  report: Report | null;
}

export const ReportDetailModal = ({
  visible,
  onClose,
  report,
}: ReportDetailModalProps) => {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.96)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);
  const [lightboxUri, setLightboxUri] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      overlayOpacity.setValue(0);
      cardScale.setValue(0.96);
      cardOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: ANIM_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: ANIM_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: ANIM_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!mounted) return;

    setLightboxUri(null);

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: ANIM_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: ANIM_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.96,
        duration: ANIM_DURATION,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, mounted, overlayOpacity, cardOpacity, cardScale]);

  if (!report || !mounted) return null;

  const imageUrl =
    typeof report.image_url === 'string' ? report.image_url : undefined;

  return (
    <>
      <Modal animationType="none" transparent visible={mounted} onRequestClose={onClose}>
        <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
          <Animated.View
            style={[
              styles.modalView,
              {
                opacity: cardOpacity,
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Détails du signalement</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color="#023e8a" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <DetailRow
                label="Type de harcèlement"
                value={report.type_harcelement ?? undefined}
              />
              <DetailRow
                label="Niveau d'urgence"
                value={report.urgence ?? undefined}
                color={
                  String(report.urgence ?? '').includes('Élevé')
                    ? '#e63946'
                    : '#334155'
                }
              />
              <DetailRow label="Lieu des faits" value={report.lieu ?? undefined} />
              <DetailRow label="Date / Période" value={report.date_faits ?? undefined} />
              <DetailRow label="Fréquence" value={report.frequence ?? undefined} />
              <DetailRow label="Victimes" value={report.nb_victimes ?? undefined} />

              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>Description complète :</Text>
                <Text style={styles.fullDescription}>{String(report.content ?? '')}</Text>
              </View>

              {imageUrl ? (
                <View style={styles.imageSection}>
                  <Text style={styles.imageLabel}>Pièce jointe (appuyer pour agrandir) :</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setLightboxUri(imageUrl)}
                    accessibilityRole="button"
                    accessibilityLabel="Voir la pièce jointe en grand"
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.attachedImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imageSection}>
                  <Text style={styles.noImageText}>Aucune pièce jointe associée</Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>

      <ImageLightboxModal
        visible={!!lightboxUri}
        uri={lightboxUri}
        onClose={() => setLightboxUri(null)}
      />
    </>
  );
};

const DetailRow = ({
  label,
  value,
  color = '#334155',
}: {
  label: string;
  value?: string;
  color?: string;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label} :</Text>
    <Text style={[styles.detailValue, { color }]}>{value || 'Non précisé'}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalView: {
    width: '100%',
    backgroundColor: '#E2F4F3',
    borderRadius: 24,
    padding: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#94A3B8',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#023e8a',
  },
  detailRow: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#94A3B8',
  },
  detailLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
  },
  fullDescription: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginTop: 5,
    fontStyle: 'italic',
  },
  imageSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  imageLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  attachedImage: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    backgroundColor: '#cbd5e1',
  },
  noImageText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 10,
  },
});
