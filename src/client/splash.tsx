import './index.css';
import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <div className="container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <h1 style={{ fontSize: '3rem', margin: 0 }}>KARMA<br/><span style={{ color: '#FF4500' }}>CLASH</span></h1>
      <p style={{ color: '#888', marginTop: '10px' }}>Daily Higher/Lower</p>
      
      <button 
        className="btn-primary" 
        style={{ marginTop: '30px' }}
        onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
      >
        PLAY DAILY CHALLENGE
      </button>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);