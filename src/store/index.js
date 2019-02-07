import { createStore, applyMiddleware } from 'redux';
import reducer from './reducer';
import loggingMiddleware from 'redux-logger';

const middlewares = applyMiddleware(loggingMiddleware);

const store = createStore(reducer, middlewares);

export default store;
export * from './reducer';
