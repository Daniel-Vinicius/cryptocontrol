import React from 'react';

import {
  Container,
  Coin,
  Icon,
} from './styles';

interface CoinSelectButtonProps {
  title: string;
  onPress: () => void;
  onLongPress?: () => void;
}

export function CoinSelectButton({ title, onPress, onLongPress }: CoinSelectButtonProps) {

  return (
    <Container onPress={onPress} onLongPress={onLongPress}>
      <Coin>{title}</Coin>
      <Icon name="chevron-down" />
    </Container>
  );
};
