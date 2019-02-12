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
    mode: 'modal',
    headerMode: 'none'
  }
);

export default createAppContainer(RootStack);
