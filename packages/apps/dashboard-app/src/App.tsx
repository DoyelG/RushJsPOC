import React, { Suspense, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0)
  // const ExternalApp = FlorApp;

  return (
    <div className="App">
      <header className="App-header">
        HEADER
        <ul>
          <li>Drones</li>
          <li>Mapas</li>
          <li>Paises</li>
        </ul>
      </header>
      <main className='App-main'>
        MAIN
      </main>
      <footer className="App-footer">
        FOOTER
      </footer>
    </div>
  )
};

export default App;
