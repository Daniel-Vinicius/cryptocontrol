import React, { ReactNode } from 'react';

import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './auth';
import { TransactionProvider } from './transaction';

import theme from '../global/styles/theme';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <TransactionProvider>{children}</TransactionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
