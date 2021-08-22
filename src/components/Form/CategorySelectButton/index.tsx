import React from 'react';

import {
  Container,
  Category,
  Icon,
} from './styles';

interface CategorySelectButtonProps {
  title: string;
  onPress: () => void;
}

export function CategorySelectButton({ title, onPress }: CategorySelectButtonProps) {
  return (
    <Container onPress={onPress}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
};
