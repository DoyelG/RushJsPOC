import React, { Suspense, useState } from 'react';
import logo from './logo.svg';
import './App.css';
// import FlorApp  from 'flor-app';

const OtherComponent = React.lazy(() => import('flor-app'));

function App() {
  const [count, setCount] = useState(0)
  // const ExternalApp = FlorApp;

  return (
    <div className="App">
      <header className="App-header">
        HEADER
      </header>
      <main className='App-main'>
        {/* <ExternalApp /> */}
        <Suspense fallback={<div>Loading...</div>}>
          <OtherComponent />
        </Suspense>
      </main>
      <footer className="App-footer">
        FOOTER
      </footer>
    </div>
  )
};

export default App;
