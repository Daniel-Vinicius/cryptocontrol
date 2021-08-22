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

export interface ITransactionCard {
  name: string;
  type: 'positive' | 'negative';
  date: string;
  amountFormatted: string;
  coin: {
    quantity: number;
    price: number;
    id: string;
    name: string;
    symbol: string;
    image?: string;
  }
}

interface TransactionCardProps {
  data: ITransactionCard;
}

export function TransactionCard({ data }: TransactionCardProps) {
  const { type, name, coin, date, amountFormatted } = data;

  return (
    <Container>
      <Title>{name}</Title>
      <Amount type={type}>{type === 'negative' ? '- ' + amountFormatted : amountFormatted}</Amount>

      <Footer>
        <Coin>
          {coin.image && <CoinImage source={{ uri: coin.image }} /> }
          <CoinName>{coin.name}</CoinName>
        </Coin>
        <Date>{date}</Date>
      </Footer>
    </Container> 
  );
};
