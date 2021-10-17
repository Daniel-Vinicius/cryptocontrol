import React from 'react';

import { Container, Coin, Icon } from './styles';

interface CoinSelectButtonProps {
  title: string;
  onPress: () => void;
}

export function CoinSelectButton({ title, onPress }: CoinSelectButtonProps) {
  return (
    <Container onPress={onPress}>
      <Coin>{title}</Coin>
      <Icon name="chevron-down" />
    </Container>
  );
}
