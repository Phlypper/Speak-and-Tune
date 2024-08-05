import React from 'react';
import UsbConnection from './UsbConnection';
import TunerComponent from './Tuner';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Speak and Tune</h1>
      </header>
      <main>
        <UsbConnection />
        <TunerComponent />
      </main>
    </div>
  );
}

export default App;
