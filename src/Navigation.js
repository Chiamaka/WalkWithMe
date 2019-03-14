import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './components/HomeScreen';
import MapScreen from './components/MapScreen';

const RootStack = createStackNavigator(
  {
    Main: {
      screen: HomeScreen
    },
    Modal: {
      screen: MapScreen
    }
  },
  {
    mode: 'card'
  }
);

export default createAppContainer(RootStack);
