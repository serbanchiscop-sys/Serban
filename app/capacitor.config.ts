import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.familymomentsai.app',
  appName: 'Family Moments AI',
  webDir: 'dist',
  backgroundColor: '#F4F6FA',
  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: '#1B4794',
      showSpinner: false,
    },
  },
};

export default config;
