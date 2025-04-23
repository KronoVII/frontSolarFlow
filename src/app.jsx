import React from 'react';
import SolarTracker from './SolarTracker';
import MetricsSolarTracker from './MetricsSolarTraker';

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'flex-start', // alinea contenido a la derecha
      alignItems: 'center',
      background: '#111', // opcional: fondo oscuro
    }}>
      <div style={{
        width: '50vw',
        height: '100vh',
        borderLeft: '2px solid #444',
        overflow: 'hidden',
      }}>
        <SolarTracker onlyCanvas />
      </div>
      <div style={{ width: '50vw', overflowY: 'auto' }}>
        <MetricsSolarTracker />
      </div>
    </div>
  );
}

export default App;
