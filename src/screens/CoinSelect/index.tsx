import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { useTheme } from 'styled-components';

import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';

import {
  Container,
  Header,
  Title,
  Coin,
  Name,
  Separator,
  Footer,
  LoadContainer,
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
  const [isLoading, setIsLoading] = useState(true);
  const [coinSearch, setCoinSearch] = useState('');
  const [coinsBackup, setCoinsBackup] = useState<Coin[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);

  const theme = useTheme();

  function handleCoinSelect(item: Coin) {
    setCoin(item);
  }

  function handleChangeCoinSearch(text: string) {
    if (!text.trim()) {
      setCoins(coinsBackup);
    }

    setCoinSearch(text);

    if (coinSearch.trim()) {
      const term = coinSearch.toLowerCase();
      const coinsFiltered = coinsBackup.filter(coin => coin.name.toLowerCase().indexOf(term) > -1);
      setCoins(coinsFiltered);
    }
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
    setCoinsBackup(coinsFormatted);

    setIsLoading(false);
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
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size="large" />
        </LoadContainer>
      ) :
        <>
          <Input placeholder="Nome da Moeda" value={coinSearch} onChangeText={handleChangeCoinSearch} />
          <FlatList
            data={coins}
            style={{ flex: 1, width: '100%' }}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <Separator />}
            renderItem={({ item }) => (
              <Coin
                onPress={() => handleCoinSelect(item)}
                isActive={coin.id === item.id}
              >
                <Name>{item.name}</Name>
              </Coin>
            )}
          />

          <Footer>
            <Button title="Selecionar" onPress={closeSelectCoin} />
          </Footer>
        </>
      }
    </Container>
  );
};
