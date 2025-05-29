import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'vite_react_shadcn_ts',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
