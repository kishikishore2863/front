import { useQuery } from '@tanstack/react-query';
import * as turf from '@turf/turf';

// Mock API function
const fetchScore = async (location, filters, priorities) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!location) return null;

  // Generate mock isochrone (circle for simplicity in mock)
  const center = [location.lng, location.lat];
  const radius = filters.transport === 'walking' ? 0.5 : 2; // km
  const isochrone = turf.circle(center, radius, { steps: 64, units: 'kilometers' });

  // Generate mock heatmap tiles
  const tiles = [];
  const bbox = turf.bbox(isochrone);
  const cellSide = 0.1; // km
  const grid = turf.pointGrid(bbox, cellSide, { units: 'kilometers' });

  turf.featureEach(grid, (currentFeature, featureIndex) => {
    if (turf.booleanPointInPolygon(currentFeature, isochrone)) {
      const score = Math.random() * 100;
      tiles.push({
        ...currentFeature,
        properties: {
          score: score,
          id: featureIndex,
        }
      });
    }
  });

  // Generate mock POIs
  const poiTypes = ['competitor', 'amenity', 'transit'];
  const pois = Array.from({ length: 10 }).map((_, i) => {
    const point = turf.randomPoint(1, { bbox });
    return {
      ...point.features[0],
      properties: {
        type: poiTypes[Math.floor(Math.random() * poiTypes.length)],
        name: `POI ${i + 1}`,
      }
    };
  });

  const totalScore = Math.floor(Math.random() * 40) + 60; // 60-100

  return {
    score: totalScore,
    isochrone,
    tiles: {
      type: 'FeatureCollection',
      features: tiles,
    },
    pois: {
      type: 'FeatureCollection',
      features: pois,
    },
    topTiles: tiles.sort((a, b) => b.properties.score - a.properties.score).slice(0, 3),
    reasons: [
      "High amenity density (+25%)",
      "Low competition in 500m radius",
      "Excellent transit connectivity"
    ]
  };
};

export const useScoreLocation = (location, filters, priorities) => {
  return useQuery({
    queryKey: ['score', location, filters, priorities],
    queryFn: () => fetchScore(location, filters, priorities),
    enabled: !!location,
    staleTime: 1000 * 60 * 5,
  });
};
