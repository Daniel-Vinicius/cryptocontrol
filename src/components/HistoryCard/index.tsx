import React from 'react';

import {
  Container,
  Title,
  Amount
} from './styles';

interface HistoryCardProps {
  title: string;
  amount: string;
  color: string;
}

export function HistoryCard({ title, amount, color }: HistoryCardProps) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
};
