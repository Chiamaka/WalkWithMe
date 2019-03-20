import React, { Component, createContext } from 'react';

const INITIAL_STATE = {
  origin: null,
  destination: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ORIGIN':
      return { ...state, origin: action.payload };
    case 'ADD_DESTINATION':
      return { ...state, destination: action.payload };
    default:
      return state;
  }
}

export const { Provider, Consumer } = createContext(INITIAL_STATE);

export const withContext = Component => {
  return props => {
    return <Consumer>{context => <Component {...props} context={context} />}</Consumer>;
  };
};

class LocationStore extends Component {
  state = {
    ...INITIAL_STATE,
    dispatch: action => {
      this.setState(state => reducer(state, action));
    }
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export default LocationStore;
