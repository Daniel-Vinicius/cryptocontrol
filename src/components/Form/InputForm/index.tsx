import React from 'react';
import { TextInputProps } from 'react-native';
import { Control, Controller } from 'react-hook-form';

import { Input } from '../Input';
import { Container, Error } from './styles';

interface InputFormProps extends TextInputProps {
  control: Control;
  name: string;
  error?: string;
}

export function InputForm({ control, name, error, ...rest }: InputFormProps) {
  return (
    <Container>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value }}) => (
          <Input onChangeText={onChange} value={value} {...rest} />
        )}
      />
      {error && <Error>{error}</Error>}
    </Container>
  );
};
