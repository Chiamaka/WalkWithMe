import React, { Component } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Location } from 'expo';

class Button extends Component {
  state = {
    borderRadiusAnimation: new Animated.Value(100),
    hasWalkStarted: false,
    coords: {
      origin: null,
      destination: null
    }
  };

  _getLocationAsync = async () => {
    const location = await Location.getCurrentPositionAsync();
    const { latitude, longitude } = location.coords;

    return { latitude, longitude };
  };

  _changeShape = () => {
    if (this.state.hasWalkStarted) {
      this._getLocationAsync()
        .then(origin => {
          this.setState({ coords: { ...this.state.coords, origin } }, () => {
            this.props.navigation.navigate('Modal', { coords: this.state.coords });
          });
        })
        .catch(err => console.log('err', err));
    }

    Animated.timing(this.state.borderRadiusAnimation, {
      toValue: 20,
      duration: 200
    }).start(() => {
      this.setState({ hasWalkStarted: true }, async () => {
        const destination = await this._getLocationAsync();
        this.setState({ coords: { ...this.state.coords, destination } });
      });
    });
  };

  render() {
    const { borderRadiusAnimation, hasWalkStarted } = this.state;

    return (
      <TouchableOpacity onPress={this._changeShape}>
        <Animated.View style={[styles.button, { borderRadius: borderRadiusAnimation }]}>
          <Text style={[styles.label, hasWalkStarted && { fontWeight: '500' }]}>
            {hasWalkStarted ? 'Stop Walk' : 'Start Walk'}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
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

export default Button;
