/**
 * useSound.ts - Play start and completion sounds using the Web Audio API.
 *
 * WHY WEB AUDIO API?
 * Instead of bundling audio files, we generate simple tones programmatically.
 * This works across web and keeps the app lightweight.
 * On native platforms, expo-av could be used instead, but for this web-focused
 * app we use the built-in browser audio capabilities.
 */

import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';

/**
 * Creates an AudioContext lazily (browsers require user interaction first).
 */
function getAudioContext(): AudioContext | null {
  if (Platform.OS !== 'web') return null;
  if (typeof AudioContext !== 'undefined') return new AudioContext();
  return null;
}

/**
 * Play a tone with the given frequency, duration, and envelope.
 */
function playTone(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  startTime: number,
  volume: number = 0.3,
  type: OscillatorType = 'sine'
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  // Smooth fade in/out to avoid clicks
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureContext = useCallback(() => {
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      // Resume if suspended (browsers suspend until user interaction)
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      return ctxRef.current;
    }
    ctxRef.current = getAudioContext();
    return ctxRef.current;
  }, []);

  /** Short upward "ping" when the timer starts */
  const playStartSound = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Two quick ascending tones
    playTone(ctx, 523.25, 0.12, now, 0.25, 'sine');       // C5
    playTone(ctx, 659.25, 0.15, now + 0.1, 0.3, 'sine');  // E5
  }, [ensureContext]);

  /** Completion chime — a pleasant three-note sequence */
  const playCompleteSound = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Three-note ascending chime
    playTone(ctx, 523.25, 0.2, now, 0.3, 'sine');         // C5
    playTone(ctx, 659.25, 0.2, now + 0.2, 0.3, 'sine');   // E5
    playTone(ctx, 783.99, 0.35, now + 0.4, 0.35, 'sine'); // G5
  }, [ensureContext]);

  return { playStartSound, playCompleteSound };
}
