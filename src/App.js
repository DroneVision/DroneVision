import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware  } from 'redux';
import reducer from './store/store';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';

import loggingMiddleware from 'redux-logger';

const middlewares = applyMiddleware(loggingMiddleware);

const store = createStore(reducer, middlewares);


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
