import { Check, ChevronDown } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '../../constants/theme';

type CustomSelectProps = {
  label: string;
  value: string | string[];
  options: string[];
  visible: boolean;
  onToggle: () => void;
  onSelect: (value: string | string[]) => void;
  placeholder: string;
  multiSelect?: boolean;
  required?: boolean;
};

const LABEL_MIN_HEIGHT = 38;

export default function CustomSelect({
  label,
  value,
  options,
  visible,
  onToggle,
  onSelect,
  placeholder,
  multiSelect = false,
  required = false,
}: CustomSelectProps) {
  const animHeight = useRef(new Animated.Value(0)).current;
  const animOpacity = useRef(new Animated.Value(0)).current;

  const selectedValues = multiSelect
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : [];
  const displayValue = multiSelect
    ? selectedValues.length > 0
      ? selectedValues.join(', ')
      : ''
    : (typeof value === 'string' ? value : '');

  const isSelected = (option: string) =>
    multiSelect ? selectedValues.includes(option) : displayValue === option;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(animHeight, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      animHeight.setValue(0);
      animOpacity.setValue(0);
    }
  }, [visible, animHeight, animOpacity]);

  const handleSelect = (option: string) => {
    if (multiSelect) {
      const next = selectedValues.includes(option)
        ? selectedValues.filter((v) => v !== option)
        : [...selectedValues, option];
      onSelect(next);
    } else {
      onSelect(option);
      if (visible) onToggle();
    }
  };

  const maxDropdownHeight = Math.min(options.length * 44 + 4, 220);

  return (
    <View style={[styles.wrapper, visible && styles.wrapperOpen]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label} numberOfLines={2}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      <View style={styles.selectContainer}>
        <TouchableOpacity
          style={[styles.trigger, visible && styles.triggerOpen]}
          onPress={onToggle}
          activeOpacity={0.75}
        >
          <Text
            style={[styles.triggerText, !displayValue && styles.placeholderText]}
            numberOfLines={1}
          >
            {displayValue || placeholder}
          </Text>
          <ChevronDown
            size={18}
            color={visible ? Colors.light.primary : Colors.light.textMuted}
            style={{ transform: [{ rotate: visible ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {visible && (
          <Animated.View
            style={[
              styles.dropdown,
              {
                opacity: animOpacity,
                maxHeight: animHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, maxDropdownHeight],
                }),
              },
            ]}
          >
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={options.length > 4}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              {options.map((option, index) => {
                const selected = isSelected(option);
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionItem,
                      index === options.length - 1 && styles.optionItemLast,
                      selected && styles.optionItemSelected,
                    ]}
                    onPress={() => handleSelect(option)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {option}
                    </Text>
                    {selected && (
                      <View style={styles.checkCircle}>
                        <Check size={12} color="#ffffff" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      {multiSelect && visible && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={onToggle}
          activeOpacity={0.85}
        >
          <Text style={styles.doneButtonText}>Valider</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    zIndex: 1,
  },
  wrapperOpen: {
    zIndex: 999,
    elevation: 12,
  },
  labelContainer: {
    minHeight: LABEL_MIN_HEIGHT,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    lineHeight: 18,
  },
  required: {
    color: Colors.light.status.error,
    fontWeight: '800',
  },
  selectContainer: {
    position: 'relative',
    zIndex: 2,
  },
  trigger: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 13 : 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  triggerOpen: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.surface,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  triggerText: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
    fontWeight: '500',
  },
  placeholderText: {
    color: Colors.light.textMuted,
    fontWeight: '400',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.light.primary,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 9999,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.borderSubtle,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionItemSelected: {
    backgroundColor: '#F0F9FF',
  },
  optionText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  optionTextSelected: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  doneButton: {
    marginTop: 8,
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
