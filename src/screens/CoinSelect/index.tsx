import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';

import { Button } from '../../components/Form/Button';

import {
  Container,
  Header,
  Title,
  Category,
  Name,
  Separator,
  Footer,
} from './styles';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
}

interface Props {
  coin: Coin;
  setCoin: (coin: Coin) => void;
  closeSelectCoin: () => void;
}

export function CoinSelect({ coin, setCoin, closeSelectCoin }: Props) {
  const [coins, setCoins] = useState<Coin[]>([]);

  function handleCoinSelect(item: Coin) {
    setCoin(item);
  }

  async function loadCoins() {
    const currency = 'brl';
    const apiCoingeckoCoinsURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

    const response = await fetch(apiCoingeckoCoinsURL);
    const coinsInfo = await response.json();

    const coinsFormatted: Coin[] = coinsInfo.map((item: any) => {
      return {
        id: item.id,
        symbol: item.symbol,
        name: item.name,
        image: item.image,
        current_price: item.current_price,
      };
    });

    setCoins(coinsFormatted);
    console.log("loadCoins")
  }

  useEffect(() => {
    loadCoins();
  }, []);

  return (
    <Container>
      <Header>
        <Title>
          Categoria
        </Title>
      </Header>
      <FlatList
        data={coins}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Separator />}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCoinSelect(item)}
            isActive={coin.id === item.id}
          >
            <Name>{item.name}</Name>
          </Category>
        )}
      />

      <Footer>
        <Button title="Selecionar" onPress={closeSelectCoin} />
      </Footer>
    </Container>
  );
};
