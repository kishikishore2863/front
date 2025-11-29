import React, { useEffect } from 'react';
import { useMapContext } from '@/context/MapContext';

export default function POILayer({ data, idPrefix = 'main' }) {
  const { map, isLoaded } = useMapContext();

  useEffect(() => {
    if (!map || !isLoaded || !data) return;

    const sourceId = `${idPrefix}-poi-source`;
    const layerId = `${idPrefix}-poi-layer`;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'geojson',
        data: data,
      });

      map.addLayer({
        id: layerId,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': 6,
          'circle-color': [
            'match',
            ['get', 'type'],
            'competitor', '#ef4444',
            'amenity', '#3b82f6',
            'transit', '#eab308',
            '#888888'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });
    } else {
      map.getSource(sourceId).setData(data);
    }

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, isLoaded, data, idPrefix]);

  return null;
}
