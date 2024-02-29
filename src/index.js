// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import moment from 'moment-timezone';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import store from './redux/store/index';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
//
import App from './App';
import './i18n';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import './web.config';
import './index.scss';

// ----------------------------------------------------------------------
moment.tz.setDefault('Asia/Kuala_Lumpur');
ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>
      </SettingsProvider>
    </HelmetProvider>
  </StrictMode>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
