/* One-time native-shell setup: status-bar styling + hide the splash once the
 * web view is ready. No-ops on the web preview. */
import { isNative } from './platform';

export async function initNativeChrome(): Promise<void> {
  if (!isNative()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    // The app draws its own status row, so use dark icons on the light canvas.
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch {
    /* status-bar plugin unavailable */
  }
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide();
  } catch {
    /* splash plugin unavailable */
  }
}
