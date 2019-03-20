import React from 'react';
import AppContainer from './src/Navigation';
import LocationStore from './src/context/LocationStore';

console.disableYellowBox = true;

export default class App extends React.Component {
  render() {
    return (
      <LocationStore>
        <AppContainer />
      </LocationStore>
    );
  }
}
