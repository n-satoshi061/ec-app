import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware
} from "redux";
import {connectRouter, routerMiddleware} from "connected-react-router";
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'
import {usersReducer} from "../users/reducers";
import {productsReducer} from "../products/reducers";

export default function createStore(history) {

  // Define individual settings of redux-logger
  let middleWares = [routerMiddleware(history), thunk];
  if (process.env.NODE_ENV === 'development') {
      const logger = createLogger({
          collapsed: true,
          diff: true
      });
      middleWares.push(logger)
  }

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