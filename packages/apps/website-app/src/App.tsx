import React, { Suspense, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Map } from '@airmap/map-lib';
import { createRulesPluginContainer } from '@airmap/rules-plugin';
import { Navigation } from './components';

export enum ADDON_TYPE {
  VIEW = 'VIEW'
}

export interface Addon {
  type: ADDON_TYPE
  component: React.FC
  navTitle: string
}

export interface AppProps {
  addons?: Addon[]
}

function App({ addons }: AppProps) {
  const [count, setCount] = useState(0);
  console.log('---------- addons', addons);
  
  return (
    <div className="App">
      <header className="App-header">
        HEADER
        <Navigation />
      </header>
      <main className='App-main'>
        MAIN
        <Map />
      </main>
      <footer className="App-footer">
        FOOTER
      </footer>
    </div>
  )
};

export default App;
