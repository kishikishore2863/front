import { useQuery } from '@tanstack/react-query';
import { useScoreLocation } from './useScoreLocation';

export const useCompareLocations = (locA, locB, filters, priorities) => {
  // In a real app, this would be a single batch API call
  // Here we just use the mock scoring logic twice
  
  const { data: dataA, isLoading: isLoadingA } = useScoreLocation(locA, filters, priorities);
  const { data: dataB, isLoading: isLoadingB } = useScoreLocation(locB, filters, priorities);

  const isLoading = isLoadingA || isLoadingB;

  const comparison = {
    scoreDelta: (dataA?.score || 0) - (dataB?.score || 0),
    winner: (dataA?.score || 0) > (dataB?.score || 0) ? 'A' : 'B',
    competitionDelta: Math.floor(Math.random() * 20) - 10,
    amenityDelta: Math.floor(Math.random() * 20) - 10,
    transitDelta: Math.floor(Math.random() * 20) - 10,
  };

  return {
    locationA: dataA,
    locationB: dataB,
    comparison,
    isLoading,
  };
};
