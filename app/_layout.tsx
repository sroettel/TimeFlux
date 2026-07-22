/**
 * app/_layout.tsx - The ROOT layout for the entire app.
 *
 * WHAT IS A LAYOUT?
 * In Expo Router, layouts wrap around pages. The root layout wraps
 * everything — it's where we set up global providers, fonts, etc.
 *
 * Think of it like the <html> and <body> tags in a website.
 *
 * We wrap the app in SettingsProvider and StatsProvider so that
 * all tabs share the same settings and stats data via React Context.
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SettingsProvider } from '../contexts/SettingsContext';
import { StatsProvider } from '../contexts/StatsContext';
import { Colors } from '../utils/constants';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <StatsProvider>
        {/* StatusBar controls the clock/battery bar at the top of the phone */}
        <StatusBar style="light" />

        {/* Stack is a navigation container — here it just holds our tabs */}
        <Stack
          screenOptions={{
            headerShown: false, // We don't need a header above the tabs
            contentStyle: { backgroundColor: Colors.background },
          }}
        />
      </StatsProvider>
    </SettingsProvider>
  );
}
