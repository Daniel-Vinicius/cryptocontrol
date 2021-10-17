import { CoinDetails, Transaction } from "../services/types";

export function getCoinsWithoutDuplicates(transactions: Transaction[]) {
  const coinsWithDuplicates = transactions.map(coin => coin.coin);
  const coins: CoinDetails[] = [];

  coinsWithDuplicates.forEach(coin => {
    const coinDoesNotExists = coins.findIndex(c => c.id === coin.id) < 0;

    if (coinDoesNotExists) {
      const { id, name, symbol, image } = coin;
      coins.push({ id, name, symbol, image });
    }
  });

  return coins;
}
