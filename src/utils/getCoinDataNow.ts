import { Coin } from '../services/types';

export async function getCoinDataNow(coinId: string): Promise<Coin | null> {
  const apiCoingeckoCoinURL = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false`;
  const response = await fetch(apiCoingeckoCoinURL);
  const responseJSON = await response.json();

  if (responseJSON.error) {
    return null;
  }

  const priceCoinNowInDollar = responseJSON.market_data.current_price.usd as number;

  const coin: Coin = {
    id: responseJSON.id,
    symbol: responseJSON.symbol,
    name: responseJSON.name,
    image: responseJSON.image.large,
    current_price: priceCoinNowInDollar,
  };

  return coin;
}
