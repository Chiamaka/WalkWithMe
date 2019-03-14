import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import { Constants } from 'expo';
import { openGoogleMaps } from '../helpers/MapUtils';

const startLocation = '5.635664,-0.148345';
const destination = '5.651329,-0.160118';
const { GOOGLE_MAP_KEY } = Constants.manifest.extra;
const API = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation}&destination=${destination}&mode=${'walking'}&key=${GOOGLE_MAP_KEY}`;

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const newStartLocationObj = {
  latitude: 5.651329,
  longitude: -0.160118
};

const newDestinationObj = {
  latitude: 5.635664,
  longitude: -0.148345
};

const initialRegion = {
  latitude: 5.635664,
  longitude: -0.148345,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
};

class MapScreen extends Component {
  state = {
    region: {
      latitude: null,
      longitude: null,
      latitudeDelta: null,
      longtitudeDelta: null
    },
    coords: null,
    markers: [
      {
        title: 'Start location',
        coordinates: newStartLocationObj,
        pinColor: '#e67e22'
      },
      {
        title: 'Destination',
        coordinates: newDestinationObj,
        pinColor: '#2c3e50'
      }
    ]
  };

  async componentDidMount() {
    try {
      const res = await fetch(API);
      const resJson = await res.json();
      const points = Polyline.decode(resJson.routes[0].overview_polyline.points);
      const coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        };
      });
      this.setState({ coords: coords });
      return coords;
    } catch (error) {
      return error;
    }
  }

  handleNavigate() {
    const origin = `${newStartLocationObj.latitude},${newStartLocationObj.longitude}`;
    const destination = `${newDestinationObj.latitude},${newDestinationObj.longitude}`;
    openGoogleMaps(origin, destination);
  }

  render() {
    return (
      <Fragment>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={initialRegion}
          mapType={Platform.OS === 'android' ? 'mutedStandard' : 'standard'}
        >
          <MapView.Polyline coordinates={this.state.coords} strokeWidth={2} strokeColor={'#285dbf'} />

          {this.state.markers.map((marker, index) => (
            <MapView.Marker
              key={index}
              coordinate={marker.coordinates}
              title={marker.title}
              pinColor={marker.pinColor}
            />
          ))}
        </MapView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={{ ...styles.buttonStyle }} onPress={this.handleNavigate}>
            <Text style={styles.textStyle}>Navigate</Text>
          </TouchableOpacity>
        </View>
      </Fragment>
    );
  }
}

const styles = {
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    height: 250,
    bottom: 0
  },
  buttonStyle: {
    flex: 1,
    height: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    color: '#fff',
    fontSize: 30
  }
};

export default MapScreen;
