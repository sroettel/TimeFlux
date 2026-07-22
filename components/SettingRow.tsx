/**
 * SettingRow.tsx - A reusable row for adjusting a numeric setting.
 *
 * Shows a label, the current value, and +/- buttons to change it.
 * Used on the Settings tab for things like "Focus Duration: 25 min".
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, MIN_BUTTON_SIZE } from '../utils/constants';
import { useThemeColors } from '../hooks/useThemeColors';

interface SettingRowProps {
  label: string;          // What this setting controls
  value: number;          // Current value
  unit?: string;          // Display unit (e.g., "min")
  min?: number;           // Minimum allowed value
  max?: number;           // Maximum allowed value
  step?: number;          // How much to change per tap
  onChange: (newValue: number) => void;
}

export function SettingRow({
  label,
  value,
  unit = 'min',
  min = 1,
  max = 60,
  step = 1,
  onChange,
}: SettingRowProps) {
  const colors = useThemeColors();

  // Decrease value (but don't go below minimum)
  const decrease = () => {
    const newVal = Math.max(min, value - step);
    onChange(newVal);
  };

  // Increase value (but don't go above maximum)
  const increase = () => {
    const newVal = Math.min(max, value + step);
    onChange(newVal);
  };

  return (
    <View
      style={[styles.row, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      accessibilityLabel={`${label}: ${value} ${unit}`}
    >
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <View style={styles.controls}>
        {/* Minus button */}
        <Pressable
          onPress={decrease}
          style={({ pressed }) => [styles.button, { backgroundColor: colors.surfaceLight }, pressed && styles.pressed]}
          accessibilityLabel={`Decrease ${label}`}
          accessibilityRole="button"
          disabled={value <= min}
        >
          <Ionicons
            name="remove"
            size={20}
            color={value <= min ? colors.textMuted : colors.textPrimary}
          />
        </Pressable>

        {/* Current value display */}
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {value} {unit}
        </Text>

        {/* Plus button */}
        <Pressable
          onPress={increase}
          style={({ pressed }) => [styles.button, { backgroundColor: colors.surfaceLight }, pressed && styles.pressed]}
          accessibilityLabel={`Increase ${label}`}
          accessibilityRole="button"
          disabled={value >= max}
        >
          <Ionicons
            name="add"
            size={20}
            color={value >= max ? colors.textMuted : colors.textPrimary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: MIN_BUTTON_SIZE,
    height: MIN_BUTTON_SIZE,
    borderRadius: MIN_BUTTON_SIZE / 2,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    minWidth: 60,
    textAlign: 'center',
  },
});
