/**
 * storage.ts - Helper functions for saving and loading data locally.
 *
 * WHAT IS ASYNCSTORAGE?
 * Think of it like "localStorage" for mobile apps. It saves small pieces
 * of data (like settings) directly on the device — no internet needed.
 *
 * WHY THESE HELPERS?
 * AsyncStorage only stores strings, so we need to convert objects to JSON
 * (stringify) when saving and parse them back when loading. These helpers
 * handle that conversion and catch errors gracefully.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save any JavaScript object to local storage.
 * @param key - A unique string identifier (like a file name)
 * @param value - The data to save (will be converted to JSON)
 */
export async function saveData<T>(key: string, value: T): Promise<void> {
  try {
    const jsonString = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonString);
  } catch (error) {
    console.error(`[Storage] Failed to save "${key}":`, error);
  }
}

/**
 * Load data from local storage.
 * @param key - The identifier used when saving
 * @returns The parsed data, or null if nothing was saved
 */
export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const jsonString = await AsyncStorage.getItem(key);
    if (jsonString === null) return null;
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error(`[Storage] Failed to load "${key}":`, error);
    return null;
  }
}

/**
 * Remove data from local storage.
 * @param key - The identifier to delete
 */
export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Failed to remove "${key}":`, error);
  }
}
