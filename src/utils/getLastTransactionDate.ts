import { DataListProps } from "../screens/Dashboard";

export function getLastTransactionDate(transactions: DataListProps[], type: 'positive' | 'negative'): string {
  const transactionsFiltered = transactions.filter(transaction => transaction.type === type);

  const timestampsArrayTransactions = transactionsFiltered.map(transaction => {
    return new Date(transaction.date).getTime()
  });

  if (!timestampsArrayTransactions[0]) {
    return ''
  }

  const lastTransactionTimestamp = Math.max.apply(Math, timestampsArrayTransactions);

  const dateLastTransaction = new Date(lastTransactionTimestamp);
  const day = dateLastTransaction.getDate();
  const month = dateLastTransaction.toLocaleString('pt-BR', { month: 'long' });

  const dateLastTransactionFormatted = `${day} de ${month}`

  return dateLastTransactionFormatted;
}
