import React, { useState, useCallback } from 'react';
import { ActivityIndicator, Alert } from 'react-native';

import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/core';

import { useAuth } from '../../hooks/auth';
import { useTransaction } from '../../hooks/transaction';

import { formatToUSD } from '../../utils/formatToUSD';
import { getLastTransactionDate } from '../../utils/getLastTransactionDate';
import { getPercentage } from '../../utils/getPercentage';
import { getTotalUpdated } from '../../utils/getTotalUpdated';
import { getCoinsWithoutDuplicates } from '../../utils/getCoinsWithoutDuplicates';

import { HighlightCard } from '../../components/HighlightCard';
import { HighlightCardTotal } from '../../components/HighlightCardTotal';
import { TransactionCard } from '../../components/TransactionCard';
import { Button } from '../../components/Form/Button';

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
  TransactionsList,
  LogoutButton,
  LoadContainer,
} from './styles';

interface HighlightProps {
  amount: string;
  dateLastTransaction: string;
}

interface HighlightData {
  purchases: HighlightProps;
  sales: HighlightProps;
  total: {
    profiting: boolean;
    percentage: string;
    amountFormatted: string;
    amountUpdatedFormatted: string;
    dateLastTransaction: string;
  };
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData,
  );

  const theme = useTheme();
  const { signOut, user } = useAuth();
  const { transactions, removeAllTransactions } = useTransaction();

  async function loadData() {
    const purchases = transactions.filter(
      (transaction) => transaction.type === 'positive',
    );
    const sales = transactions.filter(
      (transaction) => transaction.type === 'negative',
    );
    const coinsWithoutDuplicates = getCoinsWithoutDuplicates(transactions);

    const formattedDateLastPurchase = getLastTransactionDate(
      transactions,
      'positive',
    );
    const formattedDateLastSale = getLastTransactionDate(
      transactions,
      'negative',
    );
    const totalInterval = `01 à ${
      formattedDateLastSale || formattedDateLastPurchase
    }`;

    let purchasesTotal = 0;
    let salesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'positive') {
        purchasesTotal += Number(transaction.amount);
      }

      if (transaction.type === 'negative') {
        salesTotal += Number(transaction.amount);
      }
    });

    const total = purchasesTotal - salesTotal;
    const totalUpdated = await getTotalUpdated({
      purchases,
      sales,
      coinsWithoutDuplicates,
    });
    const percentage = getPercentage(total, totalUpdated);

    setHighlightData({
      purchases: {
        amount: formatToUSD(purchasesTotal),
        dateLastTransaction: formattedDateLastPurchase
          ? `Última compra dia ${formattedDateLastPurchase}`
          : 'Não há compras',
      },
      sales: {
        amount: formatToUSD(salesTotal),
        dateLastTransaction: formattedDateLastSale
          ? `Última venda dia ${formattedDateLastSale}`
          : 'Não há vendas',
      },
      total: {
        profiting: total <= totalUpdated,
        percentage,
        amountFormatted: formatToUSD(total),
        amountUpdatedFormatted: formatToUSD(totalUpdated),
        dateLastTransaction:
          formattedDateLastSale || formattedDateLastPurchase
            ? totalInterval
            : 'Não há transações',
      },
    });

    setIsLoading(false);
  }

  async function excludeAllData() {
    Alert.alert(
      'Excluir todos os dados',
      `Você deseja remover todos os dados de transações?`,
      [
        {
          text: 'Sim quero remover',
          onPress: async () => {
            try {
              await removeAllTransactions();
            } catch (error) {
              Alert.alert('Não foi possível remover! 😥');
            }
          },
        },
        {
          text: 'Não foi engano',
          style: 'cancel',
        },
      ],
    );
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions.length]),
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
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
              title="Compras"
              amount={highlightData.purchases.amount}
              lastTransaction={highlightData.purchases.dateLastTransaction}
            />

            <HighlightCard
              type="down"
              title="Vendas"
              amount={highlightData.sales.amount}
              lastTransaction={highlightData.sales.dateLastTransaction}
            />

            <HighlightCardTotal
              title="Total"
              profiting={highlightData.total.profiting}
              percentage={highlightData.total.percentage}
              currentAmountFormatted={
                highlightData.total.amountUpdatedFormatted
              }
              investedAmountFormatted={highlightData.total.amountFormatted}
              lastTransaction={highlightData.total.dateLastTransaction}
            />
          </HighlightCards>

          <Transactions>
            {transactions.length > 0 && (
              <Button
                title="Excluir todos os dados"
                style={{ height: 50, marginTop: -10, marginBottom: 16 }}
                onPress={excludeAllData}
              />
            )}

            <TransactionsList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
