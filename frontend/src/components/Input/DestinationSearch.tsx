import { useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { Coordinates } from '../../types';

interface SearchResult {
  title: string;
  address: string;
  coordinates: Coordinates;
}

export function DestinationSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const setDestination = useAppStore((state) => state.setDestination);
  const setMapCenter = useAppStore((state) => state.setMapCenter);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    const naver = (window as unknown as { naver?: { maps: { Service: new() => unknown; ServiceStatus: { OK: number } } } }).naver;
    if (!naver?.maps) {
      console.error('Naver Maps API not loaded');
      return;
    }

    const service = new naver.maps.Service() as unknown as {
      searchAddr(opts: { query: string }, cb: (status: number, result: unknown) => void): void;
    };

    try {
      const response = await new Promise<{ result: { items: { title: string; address: string; mapx: string; mapy: string }[] } }>((resolve, reject) => {
        service.searchAddr({ query }, (status: number, result: unknown) => {
          if (status === naver.maps.ServiceStatus.OK) {
            resolve(result as { result: { items: { title: string; address: string; mapx: string; mapy: string }[] } });
          } else {
            reject(new Error('Search failed'));
          }
        });
      });

      const items = response.result.items;
      const mapped: SearchResult[] = items.slice(0, 5).map((item) => ({
        title: item.title.replace(/<[^>]*>/g, ''),
        address: item.address || '',
        coordinates: {
          longitude: parseFloat(item.mapx) / 1e7,
          latitude: parseFloat(item.mapy) / 1e7,
        },
      }));

      setResults(mapped);
    } catch {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setDestination(result.coordinates);
    setMapCenter(result.coordinates);
    setResults([]);
    setQuery(result.title);
  };

  return (
    <div className="input-group destination-search">
      <label htmlFor="destination-input">도착지 (직장)</label>
      <div className="search-box">
        <input
          id="destination-input"
          type="text"
          placeholder="직장 위치 검색 (예: 강남역)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button type="button" onClick={handleSearch}>
          검색
        </button>
      </div>
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((result, index) => (
            <li key={index}>
              <button type="button" onClick={() => handleSelect(result)}>
                <strong>{result.title}</strong>
                <span>{result.address}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
