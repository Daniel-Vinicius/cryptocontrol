import React, { useEffect } from 'react';

import * as Updates from 'expo-updates';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { AppProvider } from './src/hooks';
import { Routes } from './src/routes';
import { useAuth } from './src/hooks/auth';

export default function App(): JSX.Element {
  useEffect(() => {
    async function updateApp(): Promise<void> {
      const { isAvailable } = await Updates.checkForUpdateAsync();

      if (isAvailable) {
        await Updates.fetchUpdateAsync();
      }
    }

    if (process.env.NODE_ENV !== 'development') {
      updateApp();
    }
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  const { userStorageLoading } = useAuth();

  if (!fontsLoaded || userStorageLoading) {
    return <AppLoading />;
  }

  return (
    <AppProvider>
      <StatusBar style="light" translucent />
      <Routes />
    </AppProvider>
  );
}
