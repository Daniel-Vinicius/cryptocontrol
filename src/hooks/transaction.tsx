/* eslint-disable prettier/prettier */
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';

import { database } from '../database';
import { Transaction as ModelTransaction } from '../database/model/Transaction';

import { Transaction, TransactionType } from '../services/types';
import { useAuth } from './auth';

interface TransactionProviderProps {
  children: ReactNode;
}

type TransactionParam = Omit<Transaction, "id" | "user_id">;

interface IAuthContextData {
  transactions: Transaction[];
  removeAllTransactions: () => Promise<void>;
  createNewTransaction: (newTransaction: TransactionParam) => Promise<void>;
}

const AuthContext = createContext({} as IAuthContextData);

function TransactionProvider({ children }: TransactionProviderProps) {
  const { user, userStorageLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  async function removeAllTransactions() {
    try {
      const transactionCollection = database.get<ModelTransaction>('transactions');
      await database.write(async () => {
        await transactionCollection.query().destroyAllPermanently();
      });

      setTransactions([]);
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async function createNewTransaction(transactionParam: TransactionParam): Promise<void> {
    const { name, type, date, dateFormatted, amount, amountFormatted, coin } = transactionParam;

    const transactionCollection = database.get<ModelTransaction>('transactions');

    await database.write(async () => {
      const transactionModelDB = await transactionCollection.create((newTransaction) => {
        newTransaction.name = name,
          newTransaction.type = type,
          newTransaction.date = date,
          newTransaction.dateFormatted = dateFormatted,
          newTransaction.amount = amount,
          newTransaction.amountFormatted = amountFormatted,
          newTransaction.coin = coin,
          newTransaction.user_id = user.user_id;
      });

      const new_transaction: Transaction = {
        id: transactionModelDB.id,
        user_id: transactionModelDB.user_id,
        name: transactionModelDB.name,
        type: transactionModelDB.type as TransactionType,
        date: transactionModelDB.date,
        dateFormatted: transactionModelDB.dateFormatted,
        amount: transactionModelDB.amount,
        amountFormatted: transactionModelDB.amountFormatted,
        coin: transactionModelDB.coin,
      };

      setTransactions([...transactions, new_transaction]);
    })
  }

  useEffect(() => {
    async function loadTransactions() {
      const transactionCollection = database.get<ModelTransaction>('transactions');
      const response = await transactionCollection.query().fetch();

      if (response.length > 0) {
        const transactionsParsed: Transaction[] = response.map((modelTransaction) => ({
          id: modelTransaction.id,
          user_id: modelTransaction.user_id,
          name: modelTransaction.name,
          type: modelTransaction.type as TransactionType,
          date: modelTransaction.date,
          dateFormatted: modelTransaction.dateFormatted,
          amount: modelTransaction.amount,
          amountFormatted: modelTransaction.amountFormatted,
          coin: modelTransaction.coin,
        }));

        setTransactions(transactionsParsed);
      }

    }

    if (!userStorageLoading) {
      loadTransactions();
    }
  }, [user.user_id, userStorageLoading]);

  return (
    <AuthContext.Provider
      value={{
        transactions,
        removeAllTransactions,
        createNewTransaction
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
