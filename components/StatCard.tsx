/**
 * StatCard.tsx - A reusable card for displaying a single statistic.
 *
 * Used on the Stats tab to show things like "Total Sessions: 42".
 * Each card has an icon, a label, and a big number.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/constants';
import { useThemeColors } from '../hooks/useThemeColors';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap; // Icon name from Ionicons
  label: string;                         // What the stat is (e.g., "Total Sessions")
  value: string | number;               // The number to display
  color?: string;                        // Accent color for the icon
}

export function StatCard({
  icon,
  label,
  value,
  color = Colors.focus,
}: StatCardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: 140,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
