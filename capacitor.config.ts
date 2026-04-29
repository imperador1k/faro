import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.myduolingo', // ID profissional sem branding Median
  appName: 'MyDuolingo',
  webDir: 'out', // Pasta de build padrão
  server: {
    url: 'https://myduolingo.vercel.app',
    allowNavigation: [
      'myduolingo.vercel.app',
      '*.clerk.accounts.dev',
      '*.clerk.com',
      '*.onesignal.com'
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false,
      androidScaleType: "CENTER_CROP"
    },
    StatusBar: {
      backgroundColor: "#ffffff"
    },
    Keyboard: {
      resize: "body" as any,
      style: "light" as any
    }
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.jks',
      keystoreAlias: 'my-key-alias',
    }
  }
};

export default config;
