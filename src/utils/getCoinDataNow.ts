export async function getCoinPriceNow(coinId: string) {
  const apiCoingeckoCoinURL = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false`;
  const response = await fetch(apiCoingeckoCoinURL);
  const coin = await response.json();
  const priceCoinNowInDollar = coin.market_data.current_price.usd as number;

  return priceCoinNowInDollar;
}
