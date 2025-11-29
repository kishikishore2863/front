import React, { useEffect } from 'react';
import { useMapContext } from '@/context/MapContext';

export default function TileHeatmapLayer({ data, idPrefix = 'main' }) {
  const { map, isLoaded } = useMapContext();

  useEffect(() => {
    if (!map || !isLoaded || !data) return;

    const sourceId = `${idPrefix}-heatmap-source`;
    const layerId = `${idPrefix}-heatmap-layer`;
    const outlineId = `${idPrefix}-heatmap-outline`;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: data,
      });

      map.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'score'],
            0, '#ef4444',   // Red (low)
            50, '#eab308',  // Yellow (mid)
            100, '#22c55e'  // Green (high)
          ],
          'fill-opacity': 0.6,
        },
      });
      
      map.addLayer({
        id: outlineId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': 'rgba(255,255,255,0.3)',
          'line-width': 1,
        },
      });

    } else {
      map.getSource(sourceId).setData(data);
    }
    
    return () => {
       if (map.getLayer(layerId)) map.removeLayer(layerId);
       if (map.getLayer(outlineId)) map.removeLayer(outlineId);
       if (map.getSource(sourceId)) map.removeSource(sourceId);
    };

  }, [map, isLoaded, data, idPrefix]);

  return null;
}
