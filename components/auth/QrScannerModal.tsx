import { CameraView, scanFromURLAsync, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, X } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors, GARDIAN_CLAIR } from '../../constants/theme';
import { notify } from '../../utils/notify';
import { extractIdentifierFromQr } from '../../utils/qrIdentifier';

type QrScannerModalProps = {
  visible: boolean;
  onClose: () => void;
  onScanned: (identifier: string) => void;
};

export function QrScannerModal({
  visible,
  onClose,
  onScanned,
}: QrScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleData = useCallback(
    (raw: string) => {
      const identifier = extractIdentifierFromQr(raw);
      if (!identifier) {
        notify('QR code invalide', "Aucune donnée d'identifiant n'a pu être lue.");
        setScanned(false);
        return;
      }
      onScanned(identifier);
      onClose();
      setScanned(false);
    },
    [onClose, onScanned],
  );

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    handleData(data);
  };

  const importFromImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      notify('Permission refusée', "Autorise l'accès aux photos pour lire un QR code.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (result.canceled) return;

    try {
      const matches = await scanFromURLAsync(result.assets[0].uri, ['qr']);
      const data = matches[0]?.data;
      if (!data) {
        notify('QR introuvable', "Aucune donnée n'a pu être extraite de cette image.");
        return;
      }
      handleData(data);
    } catch (error) {
      console.warn('[qr]', error);
      notify('QR introuvable', "Impossible de lire un QR code sur cette image.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>Scanner un QR code</Text>
          <Pressable
            onPress={() => {
              setScanned(false);
              onClose();
            }}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Fermer le scanner"
          >
            <X size={22} color={Colors.light.text} />
          </Pressable>
        </View>

        <View style={styles.preview}>
          {visible && permission?.granted ? (
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
          ) : (
            <View style={styles.permissionBox}>
              <Text style={styles.permissionText}>
                {Platform.OS === 'web'
                  ? 'Autorise la caméra du navigateur pour scanner un QR code, ou importe une image.'
                  : "Autorise l'accès à la caméra pour scanner ton identifiant."}
              </Text>
              <Pressable
                onPress={() => {
                  void requestPermission();
                }}
                style={styles.permissionBtn}
              >
                <Text style={styles.permissionBtnText}>Autoriser la caméra</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Text style={styles.hint}>
          Place le QR code dans le cadre. L'identifiant sera rempli automatiquement.
        </Text>

        <Pressable
          onPress={() => {
            void importFromImage();
          }}
          style={styles.importBtn}
          accessibilityRole="button"
          accessibilityLabel="Importer un QR code depuis une image"
        >
          <ImageIcon size={18} color={Colors.light.primary} />
          <Text style={styles.importBtnText}>Importer une image</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'web' ? 24 : 48,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GARDIAN_CLAIR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    minHeight: 280,
  },
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  permissionText: {
    color: '#E2E8F0',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  permissionBtn: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  hint: {
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13,
    lineHeight: 19,
  },
  importBtn: {
    marginTop: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: GARDIAN_CLAIR,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  importBtnText: {
    color: Colors.light.primary,
    fontWeight: '800',
    fontSize: 14,
  },
});
