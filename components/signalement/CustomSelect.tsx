import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

type CustomSelectProps = {
  label: string;
  value: string;
  options: string[];
  visible: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  placeholder: string;
};

export default function CustomSelect({
  label,
  value,
  options,
  visible,
  onToggle,
  onSelect,
  placeholder,
}: CustomSelectProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity style={styles.customSelect} onPress={onToggle} activeOpacity={0.7}>
        <Text style={[styles.selectText, !value && { color: '#94a3b8' }]}>
          {value ? value : placeholder}
        </Text>

        {visible ? (
          <ChevronUp size={20} color="#023e8a" />
        ) : (
          <ChevronDown size={20} color="#023e8a" />
        )}
      </TouchableOpacity>

      {visible && (
        <View style={styles.optionsContainer}>
          {/* 🟢 On entoure la liste par un ScrollView pour activer le défilement vertical */}
          <ScrollView 
            nestedScrollEnabled={true} // Requis pour que le défilement fonctionne bien à l'intérieur d'un autre ScrollView parent
            showsVerticalScrollIndicator={true} // On affiche la barre pour que l'élève comprenne qu'il y a une suite
          >
            {options.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.optionItem}
                onPress={() => {
                  onSelect(item);
                  onToggle();
                }}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 18,
    // 🟢 TRÈS IMPORTANT : Permet au zIndex de l'enfant (le menu) de s'appliquer
    // par rapport à ce bloc de sélection précis. 
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  customSelect: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 15,
    color: '#1e293b',
    flex: 1,
  },
  optionsContainer: {
    position: 'absolute',
    top: 67,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 5,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#bdc7d3',
    borderTopColor: '#ffffff', 
    borderRadius: 1,
    borderBottomRightRadius:12,
    borderBottomLeftRadius: 12,
    overflow: 'hidden',
    paddingTop:0,
    
    // 🟢 On augmente la hauteur maximale pour afficher plus d'éléments d'un coup
    maxHeight: 220, 
  },
  optionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#abb2bc',
  },
  optionText: {
    fontSize: 15,
    color: '#1e293b',
  },
});