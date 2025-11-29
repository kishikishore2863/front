import { useQuery } from '@tanstack/react-query';

// Strict fetch function as requested
export async function fetchNearby(lat, lng, categories) {
  const res = await fetch("/api/places-nearby", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      latitude: lat,
      longitude: lng,
      categories: categories,
    }),
  });

  return await res.json();
}

export function useNearbyPlaces(lat, lng, categories, options = {}) {
  const enabled = typeof lat === 'number' && typeof lng === 'number' && Array.isArray(categories);

  return useQuery({
    queryKey: ['nearby', lat, lng, ...(categories || [])],
    queryFn: () => fetchNearby(lat, lng, categories),
    enabled,
    staleTime: 1000 * 30,
    ...options,
  });
}
