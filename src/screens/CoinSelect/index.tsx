import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, FlatList } from 'react-native';
import { useTheme } from 'styled-components';

import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { getCoinDataNow } from '../../utils/getCoinDataNow';
import { Coin as ICoin } from '../../services/types';

import {
  Container,
  Header,
  Title,
  Coin,
  Name,
  Separator,
  Footer,
  LoadContainer,
  CoinIcon
} from './styles';

interface Props {
  coin: ICoin;
  setCoin: (coin: ICoin) => void;
  closeSelectCoin: () => void;
}

export function CoinSelect({ coin, setCoin, closeSelectCoin }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [coinSearch, setCoinSearch] = useState('');
  const [coinsBackup, setCoinsBackup] = useState<ICoin[]>([]);
  const [coins, setCoins] = useState<ICoin[]>([]);

  const theme = useTheme();

  function handleCoinSelect(item: ICoin) {
    setCoin(item);
  }

  async function handleSearchCoinInAPI() {
    if (coinSearch.trim()) {
      const coinNotListed = await getCoinDataNow(coinSearch.substring(1));

      if (!coinNotListed) {
        setCoins(coinsBackup);
        return Alert.alert('Moeda não encontrada', 'Verifique se API id da moeda no coingecko está correto.')
      }

      setCoin(coinNotListed);
      closeSelectCoin();
    }
  }

  async function handleChangeCoinSearch(text: string) {
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
    const currency = 'usd';
    const apiCoingeckoCoinsURL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

    const response = await fetch(apiCoingeckoCoinsURL);
    const coinsInfo = await response.json();

    const coinsFormatted: ICoin[] = coinsInfo.map((item: any) => {
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

  const isSearchingNotListedCoin = coinSearch.charAt(0) === "#";

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
                <CoinIcon source={{ uri: item.image }} />
                <Name>{item.name}</Name>
              </Coin>
            )}
          />

          <Footer>
            <Button title={isSearchingNotListedCoin ? "Buscar moeda" : "Selecionar"} onPress={isSearchingNotListedCoin ? handleSearchCoinInAPI : closeSelectCoin} />
          </Footer>
        </>
      }
    </Container>
  );
};
