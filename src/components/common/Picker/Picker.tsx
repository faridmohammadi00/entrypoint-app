import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { colors } from '../../../theme/colors';

interface PickerItem {
  label: string;
  value: string;
}

interface PickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  placeholder?: string;
  label?: string;
}

export const Picker: React.FC<PickerProps> = ({
  selectedValue,
  onValueChange,
  items,
  placeholder = 'Select an option',
  label,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <RNPicker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          dropdownIconColor={colors.gray}
        >
          <RNPicker.Item label={placeholder} value="" />
          {items.map((item) => (
            <RNPicker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </RNPicker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  picker: {
    height: 48,
    color: '#2D3748',
  },
}); 