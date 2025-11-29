import React, { useEffect } from 'react';
import { useMapContext } from '@/context/MapContext';

export default function TopTilesLayer({ data, idPrefix = 'main' }) {
  const { map, isLoaded } = useMapContext();

  useEffect(() => {
    if (!map || !isLoaded || !data) return;

    const sourceId = `${idPrefix}-toptiles-source`;
    const layerId = `${idPrefix}-toptiles-layer`;

    // Create a FeatureCollection of just the top tiles
    const topTilesData = {
      type: 'FeatureCollection',
      features: data
    };

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: topTilesData,
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#ffffff',
          'line-width': 3,
          'line-dasharray': [1, 1], // Dotted/dashed line to make them pop
          'line-opacity': 0.9
        },
      });

    } else {
      map.getSource(sourceId).setData(topTilesData);
    }
    
    return () => {
       if (map.getLayer(layerId)) map.removeLayer(layerId);
       if (map.getSource(sourceId)) map.removeSource(sourceId);
    };

  }, [map, isLoaded, data, idPrefix]);

  return null;
}
