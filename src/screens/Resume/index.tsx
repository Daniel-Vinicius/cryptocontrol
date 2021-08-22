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

import { categories } from '../../utils/categories';
import { formatToBRL } from '../../utils/formatToBRL';

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

interface CategoryData {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

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
    const collectionKeyTransactions = `@gofinances:transactions_user:${user.id}`;

    const response = await AsyncStorage.getItem(collectionKeyTransactions);
    const transactionsParsed = response ? JSON.parse(response) as DataListProps[] : [];

    const outputs = transactionsParsed.filter(transaction =>
      transaction.type === 'negative' &&
      new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
      new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
    );

    const outputsTotal = outputs.reduce((accumulator, output) => {
      return accumulator + Number(output.amount);
    }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      outputs.forEach(output => {
        if (output.category === category.key) {
          categorySum += Number(output.amount);
        }
      })

      if (categorySum > 0) {
        const percent = `${(categorySum / outputsTotal * 100).toFixed(1)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted: formatToBRL(categorySum),
          color: category.color,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
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
        <Title>Resumo por categoria</Title>
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
              data={totalByCategories}
              colorScale={totalByCategories.map(category => category.color)}
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

          {totalByCategories.map(category => (
            <HistoryCard
              key={category.key}
              title={category.name}
              amount={category.totalFormatted}
              color={category.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
};
