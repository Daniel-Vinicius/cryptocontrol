import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';

import { RFValue } from 'react-native-responsive-fontsize';

interface TotalProps {
  profiting: boolean;
}

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.shape};
  width: ${RFValue(300)}px;
  border-radius: 6px;

  padding: 18px 24px;
  padding-bottom: ${RFValue(42)}px;
  margin-right: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.title};
`;

export const Icon = styled(Feather)<TotalProps>`
  font-size: ${RFValue(30)}px;
  color: ${({ theme, profiting }) =>
    profiting ? theme.colors.success : theme.colors.attention};
`;

export const ContentWrapper = styled.View``;

export const Content = styled.View`
  margin-top: ${RFValue(24)}px;
  flex-direction: row;
  justify-content: space-between;
`;

export const Footer = styled.View`
  margin-top: auto;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: -16px;
`;

export const LastTransaction = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;

  color: ${({ theme }) => theme.colors.text};
`;

export const Label = styled.Text`
  font-size: ${RFValue(13)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.title};
`;

export const InvestedAmount = styled.Text<TotalProps>`
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;

export const CurrentAmount = styled.Text<TotalProps>`
  font-size: ${RFValue(18)}px;
  font-family: ${({ theme }) => theme.fonts.medium};

  color: ${({ theme, profiting }) =>
    profiting ? theme.colors.success : theme.colors.attention};
`;

export const Percent = styled.Text<TotalProps>`
  font-size: ${RFValue(16)}px;
  color: ${({ theme, profiting }) =>
    profiting ? theme.colors.success : theme.colors.attention};
`;
