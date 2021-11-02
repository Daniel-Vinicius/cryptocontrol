import React from 'react';
import TextTicker from 'react-native-text-ticker';

import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction,
} from './styles';

interface HighlightCardProps {
  type: 'up' | 'down' | 'total';
  title: string;
  amount: string;
  lastTransaction: string;
}

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
  total: 'dollar-sign',
};

export function HighlightCard({
  type,
  title,
  amount,
  lastTransaction,
}: HighlightCardProps) {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icon[type]} type={type} />
      </Header>

      <Footer>
        <TextTicker
          style={{ marginTop: 38 }}
          duration={5000}
          loop
          bounce
          repeatSpacer={50}
          marqueeDelay={1000}
        >
          <Amount type={type}>{amount}</Amount>
        </TextTicker>
        <LastTransaction type={type}>{lastTransaction}</LastTransaction>
      </Footer>
    </Container>
  );
}
