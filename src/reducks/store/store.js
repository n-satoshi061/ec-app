import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware
} from "redux";
import {connectRouter, routerMiddleware} from "connected-react-router";
import thunk from 'redux-thunk';

import {usersReducer} from "../users/reducers";
import {productsReducer} from "../products/reducers";

export default function createStore(history) {
  return reduxCreateStore(
    combineReducers({
      products: productsReducer,
      router: connectRouter(history),
      users: usersReducer
    }),
    applyMiddleware(
      routerMiddleware(history),
      thunk
    )
  );
}