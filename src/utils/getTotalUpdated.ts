import { getCoinDataNow } from './getCoinDataNow';
import { CoinDetails, CoinInTransaction, Transaction } from '../services/types';

interface GetTotalUpdatedParams {
  coinsWithoutDuplicates: CoinDetails[];
  purchases: Transaction[];
  sales: Transaction[];
}

type PromisesReturn = Promise<CoinInTransaction | null>[];

export async function getTotalUpdated({
  purchases,
  sales,
  coinsWithoutDuplicates,
}: GetTotalUpdatedParams) {
  // This is the promise array that populates the coins array with updated price
  const promises: PromisesReturn = coinsWithoutDuplicates.map(async (coin) => {
    const coinData = await getCoinDataNow(coin.id);
    let quantityCoin = 0;

    if (!coinData) {
      return null;
    }

    purchases.forEach((purchase) => {
      if (purchase.coin.id === coin.id) {
        quantityCoin += purchase.coin.quantity;
      }
    });

    sales.forEach((sale) => {
      if (sale.coin.id === coin.id) {
        quantityCoin -= sale.coin.quantity;
      }
    });

    const data: CoinInTransaction = {
      ...coin,
      price: coinData.current_price,
      quantity: quantityCoin,
    };

    return data;
  });

  const coinsWithPriceUpdated = await Promise.all(promises);

  const totalUpdated = coinsWithPriceUpdated.reduce((acc, coin) => {
    let amount = 0;

    if (coin) {
      amount = coin.price * coin.quantity;
    }

    return acc + amount;
  }, 0);

  return totalUpdated;
}
