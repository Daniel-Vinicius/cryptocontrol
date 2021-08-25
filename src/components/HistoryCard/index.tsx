import React from 'react';

import {
  Container,
  Coin,
  Title,
  Image,
  Quantity
} from './styles';

interface HistoryCardProps {
  title: string;
  quantity: string;
  color: string;
  image?: string;
}

export function HistoryCard({ title, quantity, color, image }: HistoryCardProps) {
  return (
    <Container color={color}>
      <Coin>
        {image && <Image source={{ uri: image }} />}
        <Title>{title}</Title>
      </Coin>
      <Quantity>{quantity}</Quantity>
    </Container>
  );
};
