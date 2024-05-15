import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux";
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      {/* // we can create our store like this */}
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);


