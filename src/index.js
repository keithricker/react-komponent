import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { RootComponent } from './components/componentFunction'

ReactDOM.render(
  <RootComponent><App /></RootComponent>,
  document.getElementById('root')
);

serviceWorker.unregister();