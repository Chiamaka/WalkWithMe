import React, { Component } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Location } from 'expo';
import { withContext } from '../context/LocationStore';

class Button extends Component {
  state = {
    borderRadiusAnimation: new Animated.Value(100),
    hasWalkStarted: false
  };

  getLocationAsync = async () => {
    try {
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      return { latitude, longitude };
    } catch (err) {
      console.error('err', err);
    }
  };

  addDestination = async () => {
    try {
      const { dispatch } = this.props.context;
      const destination = await this.getLocationAsync();
      dispatch({ type: 'ADD_DESTINATION', payload: destination });
    } catch (err) {
      console.error('err', err);
    }
  };

  addOrigin = async () => {
    try {
      const { dispatch } = this.props.context;
      const origin = await this.getLocationAsync();
      dispatch({ type: 'ADD_ORIGIN', payload: origin });
      this.props.navigation.navigate('Modal');
    } catch (err) {
      console.error('err', err);
    }
  };

  _changeShape = () => {
    if (this.state.hasWalkStarted) {
      this.addOrigin();
      return;
    }

    Animated.timing(this.state.borderRadiusAnimation, {
      toValue: 20,
      duration: 200
    }).start(() => this.setState({ hasWalkStarted: true }, this.addDestination));
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

export default withContext(Button);
