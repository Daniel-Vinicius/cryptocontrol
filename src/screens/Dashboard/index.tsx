import React, { useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/core';
import { useAuth } from '../../hooks/auth';

import { formatToBRL } from '../../utils/formatToBRL';
import { getLastTransactionDate } from '../../utils/getLastTransactionDate';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, ITransactionCard } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer,
} from './styles';

export interface DataListProps extends ITransactionCard {
  id: string;
}

interface HighlightProps {
  amount: string;
  dateLastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  outputs: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  
  const theme = useTheme();
  const { signOut, user } = useAuth();

  async function loadTransactions() {
    const collectionKeyTransactions = `@gofinances:transactions_user:${user.id}`;

    const transactionsStringified = await AsyncStorage.getItem(collectionKeyTransactions);
    const transactionsParsed = transactionsStringified ? JSON.parse(transactionsStringified) : [];

    let entriesTotal = 0;
    let outputsTotal = 0;

    const transactionsFormatted: DataListProps[] = transactionsParsed.map((item: DataListProps) => {
      if (item.type === 'positive') {
        entriesTotal += Number(item.amount);
      }

      if (item.type === 'negative') {
        outputsTotal += Number(item.amount);
      }

      const amount = formatToBRL(Number(item.amount));

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      };
    });

    setTransactions(transactionsFormatted);
    
    const total = entriesTotal - outputsTotal;

    const formattedDateLastEntry = getLastTransactionDate(transactionsParsed, 'positive');
    const formattedDateLastOutput = getLastTransactionDate(transactionsParsed, 'negative');
    const totalInterval = `01 à ${formattedDateLastOutput || formattedDateLastEntry}`;
    
    setHighlightData({
      entries: {
        amount: formatToBRL(entriesTotal),
        dateLastTransaction: formattedDateLastEntry ?
        `Última entrada dia ${formattedDateLastEntry}` : 'Não há entradas' 
      },
      outputs: {
        amount: formatToBRL(outputsTotal),
        dateLastTransaction: formattedDateLastOutput ?
        `Última saída dia ${formattedDateLastOutput}` : 'Não há saídas'
      },
      total: {
        amount: formatToBRL(total),
        dateLastTransaction: formattedDateLastOutput || formattedDateLastEntry ?
        totalInterval : 'Não há transações'
      }
    });

    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions()
    }, [])
  )

  return (
    <Container>
      { isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{ uri: user.photo }}
                />
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>{user.name}</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              title="Entradas"
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.dateLastTransaction}
            />

            <HighlightCard
              type="down"
              title="Saídas"
              amount={highlightData.outputs.amount}
              lastTransaction={highlightData.outputs.dateLastTransaction}
            />

            <HighlightCard
              type="total"
              title="Total"
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.dateLastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} /> }
            />

          </Transactions>
        </>
      }
    </Container>
  );
};
