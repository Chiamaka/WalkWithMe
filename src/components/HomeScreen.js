import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Location, Permissions, Constants } from 'expo';

class HomeScreen extends PureComponent {
  state = {
    location: null,
    errorMessage: null,
    destination: null
  };

  componentDidMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({ errorMessage: 'This wont work in an Android emulator' });
    }
    this._requestLocationPermission();
  }

  _requestLocationPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({ errorMessage: "Sorry, without location turned on, we can't help you" });
    }
  };

  _getLocationAsync = async () => {
    const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    this.setState({ location, destination: { long: location.coords.longitude, lat: location.coords.latitude } });
  };

  render() {
    const { location, errorMessage, destination } = this.state;

    console.log('location', location);
    if (errorMessage)
      return (
        <View style={styles.container}>
          <Text>{errorMessage}</Text>
        </View>
      );
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this._getLocationAsync}>
          <Text style={styles.label}>Start Walk</Text>
        </TouchableOpacity>

        <Text>{destination && `${destination.long}, ${destination.lat}`}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },

  label: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '200'
  }
});

export default HomeScreen;
