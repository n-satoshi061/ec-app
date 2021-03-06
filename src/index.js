import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import createStore from './reducks/store/store';
import App from './App.jsx';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {theme} from "./assets/theme";
import * as serviceWorker from './serviceWorker';
import {ConnectedRouter} from 'connected-react-router';
import * as History from "history";

const history = History.createBrowserHistory();
export const store = createStore(history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
    {/* <MuiThemeProvider>で<App />を丸ごとラッピングして、設定。 */}
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
