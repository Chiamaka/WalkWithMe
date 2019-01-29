import React from 'react';
import HomeScreen from './src/components/HomeScreen';

console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return <HomeScreen />;
  }
}
