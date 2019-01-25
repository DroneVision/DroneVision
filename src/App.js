import React, { Component } from 'react';
import Battery from './components/Battery';
import Build from './screens/Build';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer';
import { BrowserRouter } from 'react-router-dom'
import Router from 'react-router-dom'
import Routes from './routes'

const store = createStore(reducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <BrowserRouter history="history">
        <Routes/>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
