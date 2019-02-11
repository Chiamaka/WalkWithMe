import React, { Component } from 'react';
import { MapView } from 'expo';
import { isObjectNull } from '../helpers/utils';

class MapScreen extends Component {
  state = {
    region: {
      latitude: null,
      longitude: null,
      latitudeDelta: null,
      longtitudeDelta: null
    }
  };

  handleRegionChange = coords => {
    this.setState({ region: coords });
  };

  render() {
    const { destination } = this.props;
    const { region } = this.state;

    return (
      <MapView
        style={{ flex: 1 }}
        region={isObjectNull(region) ? destination : region}
        mapType={'mutedStandard'}
        showsUserLocation={true}
        followsUserLocation={true}
        // loadingEnabled={true}
        onRegionChange={this.handleRegionChange}
        // onUserLocationChange={this.handleLocationChange}
      >
        {/* <MapView.Marker
          coordinate={{
            longitude,
            latitude
          }}
          title="My Marker"
          description="Some description"
        /> */}
      </MapView>
    );
  }
}

export default MapScreen;
