import React, { Component, Fragment } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import { Constants } from 'expo';
import { openGoogleMaps } from '../helpers/MapUtils';
import { withContext } from '../context/LocationStore';

const { GOOGLE_MAP_KEY } = Constants.manifest.extra;
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class MapScreen extends Component {
  state = {
    polylineCoords: null,
    markers: []
  };

  async componentDidMount() {
    try {
      const { destination, origin } = this.props.context;
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
      this.setState({ polylineCoords, markers });
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
    const { origin, destination } = this.props.context;
    const formattedOrigin = `${origin.latitude},${origin.longitude}`;
    const formattedDestination = `${destination.latitude},${destination.longitude}`;
    openGoogleMaps(formattedOrigin, formattedDestination);
  };

  render() {
    const { destination } = this.props.context;
    return (
      <Fragment>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={{ ...destination, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }}
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

export default withContext(MapScreen);
