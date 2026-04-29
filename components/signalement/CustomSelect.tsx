import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 18,
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    marginTop: 6,
    overflow: 'hidden',
  },
  optionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  optionText: {
    fontSize: 15,
    color: '#1e293b',
  },
});