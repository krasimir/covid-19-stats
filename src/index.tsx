import ReactDOM from 'react-dom';
import React from 'react';

import App from './components/App';

ReactDOM.render(
  <App name="World" />,
  document.querySelector('[data-id="container"]')
);
