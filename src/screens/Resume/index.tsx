/* eslint-disable import/no-duplicates */
import React, { useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';

import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/core';
import { useTheme } from 'styled-components';
import { useTransaction } from '../../hooks/transaction';

import { HistoryCard } from '../../components/HistoryCard';

import { formatToUSD } from '../../utils/formatToUSD';
import { getRandomColor } from '../../utils/getRandomColor';
import { getCoinsWithoutDuplicates } from '../../utils/getCoinsWithoutDuplicates';

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
  image?: string;
  total: number;
  totalFormatted: string;
  quantity: string;
  percent: string;
  color: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCoin, setTotalByCoin] = useState<CoinData[]>([]);

  const theme = useTheme();
  const { transactions } = useTransaction();

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

    const purchases = transactions.filter(
      (transaction) =>
        transaction.type === 'positive' &&
        new Date(transaction.date).getMonth() <= selectedDate.getMonth() &&
        new Date(transaction.date).getFullYear() <= selectedDate.getFullYear(),
    );

    const sales = transactions.filter(
      (transaction) =>
        transaction.type === 'negative' &&
        new Date(transaction.date).getMonth() <= selectedDate.getMonth() &&
        new Date(transaction.date).getFullYear() <= selectedDate.getFullYear(),
    );

    const purchasesTotal = purchases.reduce((accumulator, purchase) => {
      const amount = purchase.coin.quantity * purchase.coin.price;
      return accumulator + Number(amount);
    }, 0);

    const salesTotal = sales.reduce((accumulator, purchase) => {
      const amount = purchase.coin.quantity * purchase.coin.price;
      return accumulator + Number(amount);
    }, 0);

    const total = purchasesTotal - salesTotal;

    const totalByCoins: CoinData[] = [];
    const purchasedCoinsWithoutDuplicates =
      getCoinsWithoutDuplicates(purchases);

    purchasedCoinsWithoutDuplicates.forEach((coin) => {
      let coinSum = 0;
      let coinQuantity = 0;

      purchases.forEach((purchase) => {
        if (purchase.coin.id === coin.id) {
          const amount = purchase.coin.quantity * purchase.coin.price;
          coinSum += Number(amount);
          coinQuantity += purchase.coin.quantity;
        }
      });

      sales.forEach((sale) => {
        if (sale.coin.id === coin.id) {
          const amount = sale.coin.quantity * sale.coin.price;
          coinSum -= Number(amount);
          coinQuantity -= sale.coin.quantity;
        }
      });

      if (coinSum > 0) {
        const percent = `${((coinSum / total) * 100).toFixed(1)}%`;

        totalByCoins.push({
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          total: coinSum,
          totalFormatted: formatToUSD(coinSum),
          quantity: String(coinQuantity.toFixed(8)),
          percent,
          color: getRandomColor(),
        });
      }
    });

    setTotalByCoin(totalByCoins);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, transactions.length]),
  );

  return (
    <Container>
      <Header>
        <Title>Divisão dos aportes</Title>
      </Header>

      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            // eslint-disable-next-line react-hooks/rules-of-hooks
            paddingBottom: useBottomTabBarHeight(),
          }}
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
              colorScale={totalByCoin.map((coin) => coin.color)}
              x="percent"
              y="total"
              labelRadius={50}
              style={{
                labels: {
                  fontSize: `${RFValue(18)}px`,
                  fontFamily: theme.fonts.regular,
                  fill: theme.colors.shape,
                },
              }}
            />
          </ChartContainer>

          {totalByCoin.map((coin) => (
            <HistoryCard
              key={coin.symbol}
              color={coin.color}
              image={coin.image}
              title={coin.name}
              quantity={coin.quantity}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}
