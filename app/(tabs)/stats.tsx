/**
 * app/(tabs)/stats.tsx - The STATS screen.
 *
 * Displays your Pomodoro progress using simple card components.
 * No heavy chart libraries needed — we keep dependencies minimal!
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { StatCard } from '../../components/StatCard';
import { useStats } from '../../hooks/useStats';
import { useThemeColors } from '../../hooks/useThemeColors';
import { Colors } from '../../utils/constants';

export default function StatsScreen() {
  const { stats, resetStats } = useStats();
  const colors = useThemeColors();

  // Format total minutes into hours and minutes for readability
  const formattedTime =
    stats.totalMinutes >= 60
      ? `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`
      : `${stats.totalMinutes}m`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header section */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>Your Progress</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Keep going! Every focus session counts.
          </Text>
        </View>

        {/* Stats grid - 2 columns */}
        <View style={styles.grid}>
          <StatCard
            icon="checkmark-circle"
            label="Total Sessions"
            value={stats.totalSessions}
            color={colors.focus}
          />
          <StatCard
            icon="time"
            label="Focus Time"
            value={formattedTime}
            color={colors.shortBreak}
          />
        </View>

        <View style={styles.grid}>
          <StatCard
            icon="today"
            label="Today"
            value={stats.todaySessions}
            color={colors.longBreak}
          />
          <StatCard
            icon="flame"
            label="Day Streak"
            value={stats.streak}
            color="#ff9f43"
          />
        </View>

        {/* Simple visual progress bar for today */}
        <View style={[styles.progressSection, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Text style={[styles.progressLabel, { color: colors.textPrimary }]}>Today's Progress</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  // Show progress toward a goal of 8 sessions per day
                  width: `${Math.min(100, (stats.todaySessions / 8) * 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressHint, { color: colors.textMuted }]}>
            {stats.todaySessions}/8 sessions (daily goal)
          </Text>
        </View>

        {/* Reset button */}
        <Pressable
          onPress={resetStats}
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.pressed,
          ]}
          accessibilityLabel="Reset all statistics"
          accessibilityRole="button"
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.resetText}>Reset Stats</Text>
        </Pressable>
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
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  progressSection: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.surface,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.longBreak,
    borderRadius: 6,
  },
  progressHint: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.danger + '40',
  },
  resetText: {
    fontSize: 15,
    color: Colors.danger,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
