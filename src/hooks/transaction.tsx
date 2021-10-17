/* eslint-disable prettier/prettier */
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Transaction } from '../services/types';
import { useAuth } from './auth';

interface TransactionProviderProps {
  children: ReactNode;
}

interface IAuthContextData {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  removeAllTransactions: () => Promise<void>;
}

const AuthContext = createContext({} as IAuthContextData);

function TransactionProvider({ children }: TransactionProviderProps) {
  const { user, userStorageLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function removeAllTransactions() {
    try {
      const collectionKeyTransactions = `@cryptocontrol:transactions_user:${user.id}`;
      await AsyncStorage.removeItem(collectionKeyTransactions);
      setTransactions([]);
    } catch (error) {
      throw new Error(String(error));
    }
  }

  useEffect(() => {
    async function loadTransaction() {
      const collectionKeyTransactions = `@cryptocontrol:transactions_user:${user.id}`;
      const transactionsStringified = await AsyncStorage.getItem(collectionKeyTransactions);
      const transactionsParsed: Transaction[] = transactionsStringified ? JSON.parse(transactionsStringified) : [];
      setTransactions(transactionsParsed);
    }

    if (!userStorageLoading) {
      loadTransaction();
    }
  }, [user.id, userStorageLoading]);

  return (
    <AuthContext.Provider
      value={{
        transactions,
        setTransactions,
        removeAllTransactions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useTransaction() {
  const context = useContext(AuthContext);
  return context;
}

export { TransactionProvider, useTransaction };
