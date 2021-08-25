import React, { useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/core';
import { useAuth } from '../../hooks/auth';

import { formatToUSD } from '../../utils/formatToUSD';
import { getCoinPriceNow } from '../../utils/getCoinDataNow';
import { getLastTransactionDate } from '../../utils/getLastTransactionDate';

import { HighlightCard } from '../../components/HighlightCard';
import { HighlightCardTotal } from '../../components/HighlightCardTotal';
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
  amount: number;
  amountFormatted: string;
}

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
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);

  const theme = useTheme();
  const { signOut, user } = useAuth();

  async function loadTransactions() {
    const collectionKeyTransactions = `@cryptocontrol:transactions_user:${user.id}`;

    const transactionsStringified = await AsyncStorage.getItem(collectionKeyTransactions);
    const transactionsParsed = transactionsStringified ? JSON.parse(transactionsStringified) : [];

    let purchasesTotal = 0;
    let salesTotal = 0;

    const transactionsFormatted: DataListProps[] = transactionsParsed.map((transaction: Omit<DataListProps, "amountFormatted" | "amount">) => {
      const amount = transaction.coin.quantity * transaction.coin.price;

      if (transaction.type === 'positive') {
        purchasesTotal += Number(amount);
      }

      if (transaction.type === 'negative') {
        salesTotal += Number(amount);
      }

      const amountFormatted = formatToUSD(Number(amount));

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(transaction.date));

      return {
        id: transaction.id,
        name: transaction.name,
        type: transaction.type,
        amount,
        amountFormatted,
        date,
        coin: transaction.coin,
      };
    });

    setTransactions(transactionsFormatted);

    const transactionsCoins = transactionsFormatted.map(coin => coin.coin);
    const coinsNoDuplicates: typeof transactionsCoins = [];

    transactionsCoins.forEach(coin => {
      if (!coinsNoDuplicates.find(coinNoDuplicated => coinNoDuplicated.id === coin.id)) {
        coinsNoDuplicates.push(coin);
      }
    });


    const purchases = transactionsFormatted.filter(transaction => transaction.type === 'positive');
    const sales = transactionsFormatted.filter(transaction => transaction.type === 'negative');

    const promisesToPopulateArrayWithCoinsWithPriceAndQuantityUpdated = coinsNoDuplicates.map(async (coin) => {
      const coinPrice = await getCoinPriceNow(coin.id);
      let quantityCoin = 0;

      purchases.forEach(purchase => {
        if (purchase.coin.id === coin.id) {
          quantityCoin += purchase.coin.quantity;
        }
      })

      sales.forEach(sale => {
        if (sale.coin.id === coin.id) {
          quantityCoin -= sale.coin.quantity;
        }
      })

      const data = {
        ...coin,
        priceUpdated: coinPrice,
        quantity: quantityCoin,
      };

      return data;
    });

    const coinsWithPriceAndQuantityUpdated = await Promise.all(promisesToPopulateArrayWithCoinsWithPriceAndQuantityUpdated);

    const total = purchasesTotal - salesTotal;
    const totalUpdated = coinsWithPriceAndQuantityUpdated.reduce((acc, coin) => {
      const amount = coin.priceUpdated * coin.quantity;
      return acc + amount;
    }, 0)

    const formattedDateLastPurchase = getLastTransactionDate(transactionsParsed, 'positive');
    const formattedDateLastSale = getLastTransactionDate(transactionsParsed, 'negative');
    const totalInterval = `01 à ${formattedDateLastSale || formattedDateLastPurchase}`;

    const percentageCalc = 100 - ((total / totalUpdated) * 100);
    const percentageText = `${percentageCalc.toFixed(2)}%`;
    let percentage = '';

    if (percentageCalc >= 0) {
      percentage = `+ ${percentageText}`;
    }

    if (percentageCalc < 0) {
      percentage = `- ${percentageText}`;
    }


    setHighlightData({
      purchases: {
        amount: formatToUSD(purchasesTotal),
        dateLastTransaction: formattedDateLastPurchase ?
          `Última compra dia ${formattedDateLastPurchase}` : 'Não há compras'
      },
      sales: {
        amount: formatToUSD(salesTotal),
        dateLastTransaction: formattedDateLastSale ?
          `Última venda dia ${formattedDateLastSale}` : 'Não há vendas'
      },
      total: {
        profiting: total <= totalUpdated,
        percentage,
        amountFormatted: formatToUSD(total),
        amountUpdatedFormatted: formatToUSD(totalUpdated),
        dateLastTransaction: formattedDateLastSale || formattedDateLastPurchase ?
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
      {isLoading ? (
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
              currentAmountFormatted={highlightData.total.amountUpdatedFormatted}
              investedAmountFormatted={highlightData.total.amountFormatted}
              lastTransaction={highlightData.total.dateLastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />

          </Transactions>
        </>
      }
    </Container>
  );
};
