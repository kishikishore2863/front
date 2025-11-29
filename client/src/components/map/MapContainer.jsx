import React, { useEffect, useRef } from 'react';
import { useMapContext } from '@/context/MapContext';
import { useAppContext } from '@/context/AppContext';
import { initializeMap } from '@/services/maplibre';
import maplibregl from 'maplibre-gl';

export default function MapContainer({ children }) {
  const mapContainer = useRef(null);
  const { map, setMap, setIsLoaded } = useMapContext();
  const { setSelectedLocation, setCompareLocationA, setCompareLocationB, mode } = useAppContext();

  useEffect(() => {
    if (map) return; // Initialize only once

    const mapInstance = initializeMap(mapContainer.current);

    mapInstance.on('load', () => {
      setMap(mapInstance);
      setIsLoaded(true);
    });

    mapInstance.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      const location = { lng, lat };

      if (mode === 'compare') {
        // Logic for compare mode clicks
        // For now, simple toggle: if A empty, set A, else set B
        // We can't easily know which one user "means" to set without more UI state
        // But for mock:
        setCompareLocationA((prev) => {
          if (!prev) return location;
          setCompareLocationB(location);
          return prev;
        });
      } else {
        setSelectedLocation(location);
      }

      // POST to backend to request an API key for this location.
      // The backend will read process.env.API_KEY and return it as { key }.
      (async () => {
        try {
          const resp = await fetch('/api/coffee-shops', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(location),
          });

          if (!resp.ok) {
            console.error('Failed to fetch API key, status:', resp.status);
            return;
          }

          const data = await resp.json();
          // For now we log the key. If you want it stored in context, we can add that.
          console.log('API key from backend:', data.key);
        } catch (err) {
          console.error('Error fetching API key:', err);
        }
      })();
    });

    return () => {
      mapInstance.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Resize map when sidebar toggles or window resizes
  useEffect(() => {
    if (!map) return;
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainer.current);
    return () => resizeObserver.disconnect();
  }, [map]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      {children}
    </div>
  );
}
