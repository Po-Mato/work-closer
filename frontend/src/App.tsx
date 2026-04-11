import { useState } from 'react';
import { CommuteTimeSelector } from './components/Input/CommuteTimeSelector';
import { TravelModeSelector } from './components/Input/TravelModeSelector';
import { TrafficToggle } from './components/Input/TrafficToggle';
import { DestinationSearch } from './components/Input/DestinationSearch';
import { NaverMapComponent } from './components/Map/NaverMapComponent';
import { BusinessModelCanvas } from './components/BusinessModelCanvas';
import { SWOTAnalysis } from './components/SWOTAnalysis';
import './index.css';

type ViewMode = 'map' | 'bmc' | 'swot';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');

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
            className={`bmc-toggle ${viewMode === 'bmc' ? 'active' : ''}`}
            onClick={() => setViewMode(viewMode === 'bmc' ? 'map' : 'bmc')}
          >
            {viewMode === 'bmc' ? '지도로 돌아가기' : 'Business Model Canvas'}
          </button>
          <button
            type="button"
            className={`bmc-toggle ${viewMode === 'swot' ? 'active' : ''}`}
            onClick={() => setViewMode(viewMode === 'swot' ? 'map' : 'swot')}
          >
            {viewMode === 'swot' ? '지도로 돌아가기' : 'SWOT Analysis'}
          </button>
        </aside>

        <main className="map-container">
          {viewMode === 'bmc' && <BusinessModelCanvas />}
          {viewMode === 'swot' && <SWOTAnalysis />}
          {viewMode === 'map' && <NaverMapComponent />}
        </main>
      </div>
    </div>
  );
}

export default App;
