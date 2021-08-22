import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  const theme = useTheme();

  return (
    <Navigator screenOptions={{
      tabBarActiveTintColor: theme.colors.secondary,
      headerShown: false,
      tabBarInactiveTintColor: theme.colors.text,
      tabBarLabelPosition: 'beside-icon',
      tabBarStyle: {
        paddingVertical: Platform.OS === 'ios' ? 20 : 0,
        height: Platform.OS === 'ios' ? 85 : 65,
      }
    }}>
      <Screen
        name="Listagem"
        component={Dashboard}
        options={{ tabBarIcon: (({ size, color }) => <MaterialIcons name="format-list-bulleted" size={size} color={color} />) }} />

      <Screen
        name="Cadastrar"
        component={Register}
        options={{ tabBarIcon: (({ size, color }) => <MaterialIcons name="attach-money" size={size} color={color} />) }} />

      <Screen
        name="Resumo"
        component={Resume}
        options={{ tabBarIcon: (({ size, color }) => <MaterialIcons name="pie-chart" size={size} color={color} />) }} />
    </Navigator>
  );
}
