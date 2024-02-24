// src/App.tsx
import './App.css';
import Dialer from './Dialer'; // Make sure to import Dialer

const App = () => {
  return (
    <div className="App">
      <div className="vertical-section">Section 1</div>
      <div className="divider"></div>
      <div className="vertical-section">Section 2</div>
      <div className="divider"></div>
      <div className="vertical-section">
        <Dialer /> {/* Dialer is placed in the third section */}
      </div>
    </div>
  );
};

export default App;