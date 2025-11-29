import maplibregl from 'maplibre-gl';

// Using a free vector tile style (OSM Bright)
const STYLE_URL = 'https://tiles.openfreemap.org/styles/bright';

export const initializeMap = (container) => {
  const map = new maplibregl.Map({
    container,
    style: STYLE_URL,
    center: [-74.006, 40.7128], // NYC default
    zoom: 12,
    pitch: 0,
    bearing: 0,
    antialias: true,
  });

  map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
  
  return map;
};
