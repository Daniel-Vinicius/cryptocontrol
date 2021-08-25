interface Coin {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
}

export async function getCoinDataNow(coinId: string): Promise<Coin | false> {
  const apiCoingeckoCoinURL = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false`;
  const response = await fetch(apiCoingeckoCoinURL);
  const responseJSON = await response.json();

  if (responseJSON.error) {
    return false;
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

export async function getCoinPriceNow(coinId: string) {
  const apiCoingeckoCoinURL = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false`;
  const response = await fetch(apiCoingeckoCoinURL);
  const coin = await response.json();
  const priceCoinNowInDollar = coin.market_data.current_price.usd as number;

  return priceCoinNowInDollar;
}
