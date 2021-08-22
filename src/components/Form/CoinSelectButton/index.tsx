import React from 'react';

import {
  Container,
  Category,
  Icon,
} from './styles';

interface CoinSelectButtonProps {
  title: string;
  onPress: () => void;
}

export function CoinSelectButton({ title, onPress }: CoinSelectButtonProps) {
  return (
    <Container onPress={onPress}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
};
