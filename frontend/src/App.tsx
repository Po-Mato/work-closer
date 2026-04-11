import { useState } from 'react';
import { CommuteTimeSelector } from './components/Input/CommuteTimeSelector';
import { TravelModeSelector } from './components/Input/TravelModeSelector';
import { TrafficToggle } from './components/Input/TrafficToggle';
import { DestinationSearch } from './components/Input/DestinationSearch';
import { NaverMapComponent } from './components/Map/NaverMapComponent';
import { BusinessModelCanvas } from './components/BusinessModelCanvas';
import './index.css';

function App() {
  const [showCanvas, setShowCanvas] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <h1>직주근접 (Work Closer)</h1>
        <p>나의 직장까지 N분, 어디까지 살 수 있을까?</p>
      </header>

      <div className="main-layout">
        <aside className="sidebar">
          <DestinationSearch />
          <CommuteTimeSelector />
          <TravelModeSelector />
          <TrafficToggle />
          <button
            type="button"
            className={`bmc-toggle ${showCanvas ? 'active' : ''}`}
            onClick={() => setShowCanvas(!showCanvas)}
          >
            {showCanvas ? '지도로 돌아가기' : 'Business Model Canvas'}
          </button>
        </aside>

        <main className="map-container">
          {showCanvas ? <BusinessModelCanvas /> : <NaverMapComponent />}
        </main>
      </div>
    </div>
  );
}

export default App;
