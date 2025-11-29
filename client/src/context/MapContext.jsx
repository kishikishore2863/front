import React, { createContext, useContext, useState } from 'react';

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <MapContext.Provider value={{ map, setMap, isLoaded, setIsLoaded }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
