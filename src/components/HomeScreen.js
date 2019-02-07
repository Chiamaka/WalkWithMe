import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Location, Permissions, Constants } from 'expo';
import MapScreen from './MapScreen';

class HomeScreen extends PureComponent {
  state = {
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
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude, accuracy } = location.coords;
    this.callDelta(latitude, longitude, accuracy);
  };

  callDelta = (lat, long, accuracy) => {
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;
    const latDelta = accuracy / oneDegreeOfLatitudeInMeters;
    const longDelta = accuracy / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));

    this.setState({
      destination: {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.04355103563440821,
        longitudeDelta: 0.028154464406668467
      }
    });
  };

  render() {
    const { errorMessage, destination } = this.state;
    if (errorMessage)
      return (
        <View style={styles.container}>
          <Text>{errorMessage}</Text>
        </View>
      );

    if (destination) {
      return <MapScreen destination={this.state.destination} />;
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this._getLocationAsync}>
          <Text style={styles.label}>Start Walk</Text>
        </TouchableOpacity>
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
