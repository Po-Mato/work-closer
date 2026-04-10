import { CommuteTimeSelector } from './components/Input/CommuteTimeSelector';
import { TravelModeSelector } from './components/Input/TravelModeSelector';
import { TrafficToggle } from './components/Input/TrafficToggle';
import { DestinationSearch } from './components/Input/DestinationSearch';
import { NaverMapComponent } from './components/Map/NaverMapComponent';
import './index.css';

function App() {
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
        </aside>

        <main className="map-container">
          <NaverMapComponent />
        </main>
      </div>
    </div>
  );
}

export default App;
