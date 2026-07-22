# TimeFlux - Pomodoro Timer ⏱️

A vibrant, accessible Pomodoro timer built with React Native + Expo.

## Features

- **Timer** — Focus, Short Break, Long Break with animated progress ring
- **Stats** — Track completed sessions, total focus minutes, daily streaks
- **Settings** — Customize durations, cycles, and accessibility options
- **Haptics** — Tactile feedback on mobile devices
- **Accessible** — High contrast mode, reduced motion, proper screen reader labels

## How to Run

### 1. Install dependencies

```bash
cd "TimeFlux - Pomodoro"
npm install
```

### 2. Start the development server

```bash
npx expo start
```

### 3. Open the app

- **Web preview**: Press `w` in the terminal (or visit the URL shown)
- **iOS**: Press `i` (requires iOS Simulator) or scan QR code with Expo Go app
- **Android**: Press `a` (requires Android Emulator) or scan QR code with Expo Go app
- **Expo Go (phone)**: Install "Expo Go" from App Store/Play Store, then scan the QR code

### Troubleshooting

If you see module resolution errors, try:
```bash
npx expo start --clear
```

## Project Structure

```
TimeFlux - Pomodoro/
├── app/                    # Screens (Expo Router file-based routing)
│   ├── _layout.tsx         # Root layout (wraps everything)
│   └── (tabs)/             # Tab-based navigation group
│       ├── _layout.tsx     # Tab bar configuration
│       ├── index.tsx       # Timer screen (default tab)
│       ├── stats.tsx       # Statistics screen
│       └── settings.tsx    # Settings screen
├── components/             # Reusable UI building blocks
│   ├── ProgressRing.tsx    # Animated circular progress
│   ├── TimerDisplay.tsx    # MM:SS countdown text
│   ├── TimerControls.tsx   # Play/Pause/Stop/Skip buttons
│   ├── StatCard.tsx        # Stat display card
│   └── SettingRow.tsx      # Numeric setting adjuster
├── hooks/                  # Custom React hooks (shared logic)
│   ├── useTimer.ts         # Core countdown & phase logic
│   ├── useSettings.ts     # Settings with persistence
│   └── useStats.ts        # Stats tracking with persistence
├── utils/                  # Helpers and constants
│   ├── constants.ts        # Colors, defaults, types
│   └── storage.ts          # AsyncStorage read/write helpers
├── assets/                 # Images (icons, splash)
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── babel.config.js         # Babel config (for Reanimated)
```

## Tech Stack

| Library | Purpose |
|---------|---------|
| Expo SDK 52 | Framework & tooling |
| Expo Router | File-based navigation |
| React Native Reanimated | Smooth animations |
| React Native SVG | Progress ring drawing |
| Expo Haptics | Vibration feedback |
| AsyncStorage | Local data persistence |

## For Beginners

- **Components** are like LEGO blocks — small, reusable pieces of UI.
- **Hooks** bundle related logic (timer countdown, saving settings) so screens stay clean.
- **Expo Router** uses the file system for navigation — each file in `app/` is a screen.
- **StyleSheet** is React Native's version of CSS — same idea, different syntax.
