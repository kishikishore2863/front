import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [mode, setMode] = useState('scoring'); // 'scoring' | 'compare'
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [compareLocationA, setCompareLocationA] = useState(null);
  const [compareLocationB, setCompareLocationB] = useState(null);
  
  const [priorities, setPriorities] = useState({
    competition: 50,
    footfall: 50,
    amenities: 50,
  });

  const [filters, setFilters] = useState({
    transport: 'driving', // 'walking' | 'driving'
    timeBudget: 10,
    category: 'coffee',
  });

  // selectedCategories is an array of strings like ['amenity=cafe','shop=bakery']
  // default to bakery selected per request
  const [selectedCategories, setSelectedCategories] = useState(['shop=bakery']);
  // simple tick to request nearby refetches when categories change
  const [nearbyRefreshTick, setNearbyRefreshTick] = useState(0);

  return (
    <AppContext.Provider value={{
      mode, setMode,
      selectedLocation, setSelectedLocation,
      compareLocationA, setCompareLocationA,
      compareLocationB, setCompareLocationB,
      priorities, setPriorities,
      filters, setFilters,
      selectedCategories, setSelectedCategories,
      nearbyRefreshTick, setNearbyRefreshTick
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
