import React, { useState, useEffect } from 'react';

import { Keyboard, Alert, Modal, TouchableWithoutFeedback } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';
import { useTransaction } from '../../hooks/transaction';
import { useAuth } from '../../hooks/auth';

import { formatToUSD } from '../../utils/formatToUSD';
import { Coin, Transaction } from '../../services/types';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CoinSelectButton } from '../../components/Form/CoinSelectButton';

import { CoinSelect } from '../CoinSelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
  TotalValueContainer,
  TotalValue,
} from './styles';

interface FormData {
  name: string;
  quantity: string;
}

type NavigationProps = {
  navigate: (screen: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  quantity: Yup.number()
    .typeError('Informe um valor numérico')
    .positive('A quantidade deve ser positiva')
    .required('Quantidade é obrigatória'),
});

export function Register() {
  const [transactionType, setTransactionType] = useState<
    'positive' | 'negative' | ''
  >('');
  const [coinModalOpen, setCoinModalOpen] = useState(false);
  const [totalValue, setTotalValue] = useState(0);

  const [coin, setCoin] = useState<Coin>({
    id: 'coin',
    symbol: 'coin',
    name: 'Moeda',
    image: '',
    current_price: 0,
  });

  const navigation = useNavigation<NavigationProps>();
  const { user } = useAuth();
  const { transactions, setTransactions } = useTransaction();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleOpenSelectCoinModal() {
    setCoinModalOpen(true);
  }

  function handleCloseSelectCoinModal() {
    setCoinModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação.');
    }

    if (coin.id === 'coin') {
      return Alert.alert('Selecione a moeda.');
    }

    const collectionKeyTransactions = `@cryptocontrol:transactions_user:${user.id}`;

    const amountFormatted = formatToUSD(totalValue);

    const date = new Date();
    const dateFormatted = Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);

    const newTransaction: Transaction = {
      id: String(uuid.v4()),
      name: form.name,
      type: transactionType,
      date,
      amount: totalValue,
      amountFormatted,
      dateFormatted,
      coin: {
        quantity: Number(form.quantity),
        price: coin.current_price,
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
      },
    };

    try {
      const allTransactions = [...transactions, newTransaction];
      await AsyncStorage.setItem(
        collectionKeyTransactions,
        JSON.stringify(allTransactions),
      );

      reset();
      setTransactionType('');
      setCoin({
        id: 'coin',
        symbol: 'coin',
        name: 'Moeda',
        image: '',
        current_price: 0,
      });
      setTransactions(allTransactions);

      navigation.navigate('Listagem');
    } catch (error) {
      Alert.alert('Não foi possível salvar');
    }
  }

  const quantityWatch = watch('quantity');

  useEffect(() => {
    const quantity = String(quantityWatch).replace(',', '.');
    const totalValueCalc = Number(quantity) * coin.current_price;
    setTotalValue(totalValueCalc);
  }, [quantityWatch, coin.current_price]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              control={control}
              name="name"
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              control={control}
              name="quantity"
              placeholder="Quantidade"
              keyboardType="numeric"
              error={errors.quantity && errors.quantity.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                title="Compra"
                type="positive"
                onPress={() => handleTransactionTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />

              <TransactionTypeButton
                title="Venda"
                type="negative"
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionTypes>

            <CoinSelectButton
              title={coin.name}
              onPress={handleOpenSelectCoinModal}
            />
            {!Number.isNaN(totalValue) && (
              <TotalValueContainer>
                Valor total de{' '}
                <TotalValue>{formatToUSD(totalValue)}</TotalValue>
              </TotalValueContainer>
            )}
          </Fields>

          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal visible={coinModalOpen}>
          <CoinSelect
            coin={coin}
            setCoin={setCoin}
            closeSelectCoin={handleCloseSelectCoinModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
