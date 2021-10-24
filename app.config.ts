import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Crypto Control',
  slug: 'cryptocontrol',
  scheme: 'cryptocontrol',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  description: 'Controle suas cryptos de forma muito simples!',
  githubUrl: 'https://github.com/Daniel-Vinicius/cryptocontrol',
  updates: {
    enabled: true,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.dan.cryptocontrol',
    buildNumber: '1.0.0',
  },
  android: {
    package: 'com.dan.cryptocontrol',
    versionCode: 2,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#5636d3',
    },
  },
});
