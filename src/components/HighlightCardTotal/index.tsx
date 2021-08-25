import React from 'react';

import {
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Content,
  ContentWrapper,
  Label,
  InvestedAmount,
  CurrentAmount,
  LastTransaction,
  Percent,
} from './styles';


interface HighlightCardTotalProps {
  title: string;
  lastTransaction: string;
  profiting: boolean;
  percentage: string;
  investedAmountFormatted: string;
  currentAmountFormatted: string;
}

export function HighlightCardTotal({
  title,
  lastTransaction,
  profiting,
  percentage,
  investedAmountFormatted,
  currentAmountFormatted,
}: HighlightCardTotalProps) {

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        <Icon name='dollar-sign' profiting={profiting} />
      </Header>

      <Content>
        <ContentWrapper>
          <Label>Valor investido</Label>
          <Label style={{ marginTop: 12 }}>Valor atual</Label>
        </ContentWrapper>

        <ContentWrapper>
          <ContentWrapper>
            <InvestedAmount profiting={profiting}>
              {investedAmountFormatted}
            </InvestedAmount>
          </ContentWrapper>

          <ContentWrapper>
            <CurrentAmount profiting={profiting}>
              {currentAmountFormatted}
            </CurrentAmount>
          </ContentWrapper>
        </ContentWrapper>
      </Content>

      <Footer>
        <LastTransaction>{lastTransaction}</LastTransaction>
        <Percent profiting={profiting}>{percentage}</Percent>
      </Footer>
    </Container>
  );
};
