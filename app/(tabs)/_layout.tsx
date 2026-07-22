/**
 * app/(tabs)/_layout.tsx - The tab bar layout.
 *
 * WHAT ARE TABS?
 * Tabs are the buttons at the bottom of the screen that let you
 * switch between different sections of the app (Timer, Stats, Settings).
 *
 * This file defines which tabs exist and how they look.
 * It uses useThemeColors() so the tab bar respects the high-contrast setting.
 */

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        // Style the tab bar
        tabBarActiveTintColor: colors.focus,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 12,
          paddingTop: 8,
          height: 72,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        // Style the header area
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        // Ensure content area has the right background
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      {/* Timer Tab (the main one, shown first) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Stats Tab */}
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
