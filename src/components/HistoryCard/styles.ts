import styled from 'styled-components/native';

import { RFValue } from 'react-native-responsive-fontsize';

interface ContainerProps {
  color: string;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.shape};

  flex-direction: row;
  justify-content: space-between;

  border-radius: 5px;
  border-left-width: 5px;
  border-left-color: ${({ color }) => color};

  padding: 12px 24px;
  margin-bottom: 8px;
`;

export const Coin = styled.View`
  flex-direction: row;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(15)}px;
`;

export const Image = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: ${RFValue(8)}px;
`;

export const Quantity = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFValue(15)}px;
`;
