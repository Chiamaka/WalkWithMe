import React, { Component } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

class Button extends Component {
  state = {
    borderRadiusAnimation: new Animated.Value(100),
    hasWalkStarted: false
  };

  changeShape = () => {
    console.log('pressed');
    Animated.timing(this.state.borderRadiusAnimation, {
      toValue: 20,
      duration: 200
    }).start(() => this.setState({ hasWalkStarted: true }));
  };

  render() {
    const { borderRadiusAnimation, hasWalkStarted } = this.state;

    return (
      <TouchableOpacity onPress={this.changeShape}>
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
