import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  Alert,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-native-uuid';

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
} from './styles';

interface FormData {
  name: string;
  quantity: string;
}

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
}

type NavigationProps = {
  navigate: (screen: string) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  quantity: Yup.number()
    .typeError('Informe um valor numérico')
    .positive('O valor deve ser positivo')
    .required('Valor é obrigatório')
});

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [coinModalOpen, setCoinModalOpen] = useState(false);
  
  const [coin, setCoin] = useState<Coin>({
    id: 'coin',
    symbol: 'coin',
    name: 'Moeda',
    image: '',
    current_price: 0,
  });
  
  const navigation = useNavigation<NavigationProps>();
  const { user } = useAuth();

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
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

    if (coin.id === "coin") {
      return Alert.alert('Selecione a moeda.');
    }

    const collectionKeyTransactions = `@gofinances:transactions_user:${user.id}`;

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      quantity: form.quantity,
      type: transactionType,
      category: coin.id,
      date: new Date(),
    };

    try {
      const allOldTransactionsStringified = await AsyncStorage.getItem(collectionKeyTransactions);
      const allOldTransactions = allOldTransactionsStringified ? JSON.parse(allOldTransactionsStringified) : [];

      const allTransactions = [...allOldTransactions, newTransaction];

      await AsyncStorage.setItem(collectionKeyTransactions, JSON.stringify(allTransactions));

      reset();
      setTransactionType('');
      setCoin({ id: 'coin', symbol: 'coin', name: 'Moeda', image: '', current_price: 0 });

      navigation.navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar");
    }
  }

  useEffect(() => {
    console.log(coin)
  }, [coin])

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
                title="Income"
                type="positive"
                onPress={() => handleTransactionTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />

              <TransactionTypeButton
                title="Outcome"
                type="negative"
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionTypes>

            <CoinSelectButton title={coin.name} onPress={handleOpenSelectCoinModal} />
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
};
