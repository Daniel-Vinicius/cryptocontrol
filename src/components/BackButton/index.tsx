import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { BorderlessButtonProps } from 'react-native-gesture-handler';

import { useTheme } from 'styled-components';

import {
  Container,
 } from './styles';

interface Props extends BorderlessButtonProps {
  color?: string;
}

export function BackButton({ color, onPress, ...rest }: Props) {
  const theme = useTheme();
  const iconColor = color ? color : theme.colors.secondary;

  return (
    <Container {...rest} onPress={onPress}>
      <MaterialIcons
        name="chevron-left"
        size={32}
        color={iconColor}
      />
    </Container>
  );
};
