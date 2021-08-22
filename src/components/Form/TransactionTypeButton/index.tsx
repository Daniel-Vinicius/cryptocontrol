import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
  Container,
  Button,
  Icon,
  Title,
} from './styles';

const icons = {
  positive: 'arrow-up-circle',
  negative: 'arrow-down-circle',
};

interface TransactionTypeButtonProps extends RectButtonProps {
  title: string;
  type: 'positive' | 'negative';
  isActive: boolean;
}

export function TransactionTypeButton({ title, type, isActive, ...rest }: TransactionTypeButtonProps) {
  return (
    <Container isActive={isActive} type={type}>
      <Button {...rest}>
        <Icon name={icons[type]} type={type} />
        <Title>{title}</Title>
      </Button>
    </Container>
  );
};
