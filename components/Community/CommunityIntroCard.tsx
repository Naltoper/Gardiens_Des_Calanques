import { StyleSheet, Text, View } from 'react-native';

import { GARDIAN_CLAIR } from '../../constants/theme';

export function CommunityIntroCard() {
  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Forum de la communauté</Text>
      <Text style={styles.text}>
        Publie un sujet, partage ton ressenti et échange avec les autres élèves.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: GARDIAN_CLAIR,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(2, 62, 138, 0.12)',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#023e8a',
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
});
