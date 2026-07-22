/**
 * ProgressRing.tsx - An animated circular progress indicator.
 *
 * HOW IT WORKS:
 * We use an SVG (Scalable Vector Graphics) circle with a "stroke-dasharray"
 * trick. Imagine drawing a circle with a dashed line — by controlling the
 * dash length, we can show partial progress around the ring.
 *
 * The animation smoothly transitions the dash offset as time counts down.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../utils/constants';
import { useThemeColors } from '../hooks/useThemeColors';

// We need to make the SVG Circle work with Reanimated
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;    // 0 to 1 (0 = empty, 1 = full)
  size?: number;       // Diameter of the ring in pixels
  strokeWidth?: number;
  color?: string;
  reducedMotion?: boolean;
}

export function ProgressRing({
  progress,
  size = 280,
  strokeWidth = 12,
  color = Colors.focus,
  reducedMotion = false,
}: ProgressRingProps) {
  const colors = useThemeColors();

  // Calculate circle measurements
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated properties — this makes the ring smoothly fill/empty
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = reducedMotion
      ? circumference * (1 - progress)
      : withTiming(circumference * (1 - progress), {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        });

    return { strokeDashoffset };
  }, [progress, reducedMotion]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background ring (the grey track) */}
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.3}
        />
        {/* Foreground ring (the colored progress) */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          // Rotate so progress starts from the top
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
});
