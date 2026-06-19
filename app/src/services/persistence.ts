/* Durable key/value persistence via Capacitor Preferences (real on device,
 * localStorage-backed on web). Used to remember premium status, cart, and
 * settings across launches. */
import { Preferences } from '@capacitor/preferences';

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const { value } = await Preferences.get({ key });
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await Preferences.set({ key, value: JSON.stringify(value) });
  } catch {
    /* ignore quota/availability errors */
  }
}
