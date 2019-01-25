import React, { Component } from 'react';
import Battery from './components/Battery';
import Build from './screens/Build';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer';

const store = createStore(reducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Build />
      </Provider>
    );
  }
}

export default App;
