import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import { Constants } from 'expo';
import { openGoogleMaps } from '../helpers/MapUtils';
const { GOOGLE_MAP_KEY } = Constants.manifest.extra;

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

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
    polylineCoords: null,
    coords: null,
    markers: []
  };

  async componentDidMount() {
    try {
      const { coords } = this.props.navigation.state.params;
      const { destination, origin } = coords;

      const API = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${'walking'}&key=${GOOGLE_MAP_KEY}`;
      const res = await fetch(API);
      const resJson = await res.json();
      const points = Polyline.decode(resJson.routes[0].overview_polyline.points);
      const markers = this.generateMarkers(origin, destination);
      const polylineCoords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        };
      });
      this.setState({ polylineCoords, coords, markers });
    } catch (error) {
      console.error('err', error);
    }
  }

  generateMarkers(origin, destination) {
    return [
      {
        title: 'Start location',
        coordinates: origin,
        pinColor: '#e67e22'
      },
      {
        title: 'Destination',
        coordinates: destination,
        pinColor: '#2c3e50'
      }
    ];
  }

  handleNavigate = () => {
    const { origin, destination } = this.state.coords;
    const formattedOrigin = `${origin.latitude},${origin.longitude}`;
    const formattedDestination = `${destination.latitude},${destination.longitude}`;
    openGoogleMaps(formattedOrigin, formattedDestination);
  };

  render() {
    const {
      coords: { origin }
    } = this.props.navigation.state.params;

    return (
      <Fragment>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={{ ...origin, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }}
          mapType={Platform.OS === 'android' ? 'mutedStandard' : 'standard'}
        >
          <MapView.Polyline coordinates={this.state.polylineCoords} strokeWidth={2} strokeColor={'#285dbf'} />

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
