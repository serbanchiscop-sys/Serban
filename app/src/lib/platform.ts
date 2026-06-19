import { Capacitor } from '@capacitor/core';

export type Platform = 'ios' | 'android';

/** True when running inside the native Capacitor shell (not the web preview). */
export const isNative = (): boolean => Capacitor.isNativePlatform();

/**
 * The platform the UI should render chrome for.
 * - Native build: the real device platform (fixed).
 * - Web preview: defaults to iOS but is user-toggleable via the dev frame.
 */
export const detectPlatform = (): Platform => {
  const p = Capacitor.getPlatform();
  return p === 'android' ? 'android' : 'ios';
};
