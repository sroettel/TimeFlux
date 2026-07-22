/**
 * app/(tabs)/settings.tsx - The SETTINGS screen.
 *
 * Lets users customize their Pomodoro timer durations and accessibility
 * preferences. All changes are saved automatically to local storage.
 *
 * WHY LOCAL STORAGE?
 * We don't need accounts or a backend for this app. Settings are stored
 * directly on the device, so they persist between app sessions.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { SettingRow } from '../../components/SettingRow';
import { useSettings } from '../../hooks/useSettings';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Colors } from '../../utils/constants';

export default function SettingsScreen() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Timer Durations ──────────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Timer Durations</Text>

        <SettingRow
          label="Focus"
          value={settings.focusMinutes}
          unit="min"
          min={1}
          max={90}
          step={5}
          onChange={(v) => updateSettings({ focusMinutes: v })}
        />

        <SettingRow
          label="Short Break"
          value={settings.shortBreakMinutes}
          unit="min"
          min={1}
          max={30}
          step={1}
          onChange={(v) => updateSettings({ shortBreakMinutes: v })}
        />

        <SettingRow
          label="Long Break"
          value={settings.longBreakMinutes}
          unit="min"
          min={5}
          max={60}
          step={5}
          onChange={(v) => updateSettings({ longBreakMinutes: v })}
        />

        <SettingRow
          label="Cycles before long break"
          value={settings.cyclesBeforeLongBreak}
          unit=""
          min={2}
          max={8}
          step={1}
          onChange={(v) => updateSettings({ cyclesBeforeLongBreak: v })}
        />

        {/* ─── Accessibility ───────────────────────────────────────────── */}
        <Text style={[styles.sectionTitle, { marginTop: 32, color: colors.textMuted }]}>
          Accessibility
        </Text>

        {/* High Contrast Toggle */}
        <View style={[styles.switchRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.switchLabel}>
            <Ionicons name="contrast" size={20} color={colors.textSecondary} />
            <Text style={[styles.switchText, { color: colors.textPrimary }]}>High Contrast</Text>
          </View>
          <Switch
            value={settings.highContrast}
            onValueChange={(v) => updateSettings({ highContrast: v })}
            trackColor={{ false: colors.surface, true: colors.focus }}
            thumbColor={colors.textPrimary}
            accessibilityLabel="Toggle high contrast mode"
          />
        </View>

        {/* Reduced Motion Toggle */}
        <View style={[styles.switchRow, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.switchLabel}>
            <Ionicons
              name="accessibility"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={[styles.switchText, { color: colors.textPrimary }]}>Reduced Motion</Text>
          </View>
          <Switch
            value={settings.reducedMotion}
            onValueChange={(v) => updateSettings({ reducedMotion: v })}
            trackColor={{ false: colors.surface, true: colors.focus }}
            thumbColor={colors.textPrimary}
            accessibilityLabel="Toggle reduced motion for animations"
          />
        </View>

        {/* ─── Reset ───────────────────────────────────────────────────── */}
        <Pressable
          onPress={resetSettings}
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.pressed,
          ]}
          accessibilityLabel="Reset all settings to defaults"
          accessibilityRole="button"
        >
          <Ionicons name="refresh" size={18} color={colors.textSecondary} />
          <Text style={[styles.resetText, { color: colors.textSecondary }]}>Reset to Defaults</Text>
        </Pressable>

        {/* App info */}
        <Text style={[styles.version, { color: colors.textMuted }]}>TimeFlux v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetText: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  version: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 24,
  },
});
