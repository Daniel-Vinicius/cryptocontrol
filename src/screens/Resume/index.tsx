import React, { useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/core';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import { HistoryCard } from '../../components/HistoryCard';

import { DataListProps } from '../Dashboard';

import { formatToUSD } from '../../utils/formatToUSD';
import { getRandomColor } from '../../utils/getRandomColor';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  Month,
  MonthSelectIcon,
  LoadContainer,
} from './styles';

interface CoinData {
  symbol: string;
  name: string;
  total: number;
  totalFormatted: string;
  percent: string;
  color: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCoin, setTotalByCoin] = useState<CoinData[]>([]);

  const theme = useTheme();
  const { user } = useAuth();

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }

    if (action === 'prev') {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
    }
  }

  async function loadData() {
    setIsLoading(true);
    const collectionKeyTransactions = `@cryptocontrol:transactions_user:${user.id}`;

    const response = await AsyncStorage.getItem(collectionKeyTransactions);
    const transactionsParsed = response ? JSON.parse(response) as Omit<DataListProps, "amountFormatted" | "amount">[] : [];

    const purchases = transactionsParsed.filter(transaction =>
      transaction.type === 'positive' &&
      new Date(transaction.date).getMonth() <= selectedDate.getMonth() &&
      new Date(transaction.date).getFullYear() <= selectedDate.getFullYear()
    );

    const sales = transactionsParsed.filter(transaction =>
      transaction.type === 'negative' &&
      new Date(transaction.date).getMonth() <= selectedDate.getMonth() &&
      new Date(transaction.date).getFullYear() <= selectedDate.getFullYear()
    );

    const purchasesTotal = purchases.reduce((accumulator, purchase) => {
      const amount = purchase.coin.quantity * purchase.coin.price;
      return accumulator + Number(amount);
    }, 0);

    const salesTotal = sales.reduce((accumulator, purchase) => {
      const amount = purchase.coin.quantity * purchase.coin.price;
      return accumulator + Number(amount);
    }, 0);


    const totalBoughtMinusTotalSold = purchasesTotal - salesTotal;

    const purchasedCoins = purchases.map(p => p.coin);

    const totalByCoins: CoinData[] = [];

    purchasedCoins.forEach(coin => {
      let coinSum = 0;

      purchases.forEach(purchase => {
        if (purchase.coin.id === coin.id) {
          const amount = purchase.coin.quantity * purchase.coin.price;
          coinSum += Number(amount);
        }
      })

      sales.forEach(sale => {
        if (sale.coin.id === coin.id) {
          const amount = sale.coin.quantity * sale.coin.price;
          coinSum -= Number(amount);
        }
      })

      if (coinSum > 0) {
        const percent = `${(coinSum / totalBoughtMinusTotalSold * 100).toFixed(1)}%`;

        totalByCoins.push({
          name: coin.name,
          symbol: coin.symbol,
          total: coinSum,
          totalFormatted: formatToUSD(coinSum),
          percent,
          color: getRandomColor()
        });
      }
    });

    setTotalByCoin(totalByCoins);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [selectedDate])
  )

  return (
    <Container>
      <Header>
        <Title>Resumo por moeda</Title>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: useBottomTabBarHeight() }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              data={totalByCoin}
              colorScale={totalByCoin.map(coin => coin.color)}
              x="percent"
              y="total"
              labelRadius={50}
              style={{
                labels: {
                  fontSize: `${RFValue(18)}px`,
                  fontFamily: theme.fonts.regular,
                  fill: theme.colors.shape
                }
              }}
            />
          </ChartContainer>

          {totalByCoin.map(coin => (
            <HistoryCard
              key={coin.symbol}
              color={coin.color}
              title={coin.name}
              amount={coin.totalFormatted}
            />
          ))}
        </Content>
      )}
    </Container>
  );
};
