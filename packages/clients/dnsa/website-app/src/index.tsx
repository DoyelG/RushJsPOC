import React from 'react';
import ReactDOM from 'react-dom';

import { App } from '@airmap/website';

const FlightsView = () => {
  return (
    <div>
      <h2>Im a Flight View</h2>
    </div>
  );
};

const addons = [
  {
    type: ADDON_TYPE.VIEW
    navTitle: 'Flights',
    component: FlightsView
  }
]

ReactDOM.render(
  <React.StrictMode>
    <App addons={addons}/>
  </React.StrictMode>,
  document.getElementById('root')
);
