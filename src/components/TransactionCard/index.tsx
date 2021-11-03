import React from 'react';

import {
  Container,
  Title,
  Amount,
  Footer,
  Coin,
  CoinImage,
  CoinName,
  Date,
} from './styles';

import { ScroolHorizontalText } from '../../global/ComponentsStyled';

import { Transaction } from '../../services/types';

interface TransactionCardProps {
  data: Transaction;
}

export function TransactionCard({ data }: TransactionCardProps) {
  const { type, name, coin, dateFormatted, amountFormatted } = data;

  return (
    <Container>
      <Title>{name}</Title>
      <ScroolHorizontalText style={{ marginTop: 2 }}>
        <Amount type={type}>
          {type === 'negative' ? `- ${amountFormatted}` : amountFormatted}
        </Amount>
      </ScroolHorizontalText>

      <Footer>
        <Coin>
          {coin.image && <CoinImage source={{ uri: coin.image }} />}
          <CoinName>{coin.name}</CoinName>
        </Coin>
        <Date>{dateFormatted}</Date>
      </Footer>
    </Container>
  );
}
