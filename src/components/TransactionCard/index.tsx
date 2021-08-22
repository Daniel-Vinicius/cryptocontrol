import React from 'react';
import { categories } from '../../utils/categories';

import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from './styles';

export interface ITransactionCard {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface TransactionCardProps {
  data: ITransactionCard;
}

export function TransactionCard({ data }: TransactionCardProps) {
  const { type, name, amount, date } = data;

  const [category] = categories.filter(item => item.key === data.category);

  return (
    <Container>
      <Title>{name}</Title>
      <Amount type={type}>{type === 'negative' ? '- ' + amount : amount}</Amount>

      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>

        <Date>{date}</Date>
      </Footer>
    </Container> 
  );
};
