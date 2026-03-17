import { useState, useEffect } from 'react';

export interface LocationSuggestion {
  displayName: string;
  value: string;
  lat: number;
  lon: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function useLocationSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=gb`;
        const res = await fetch(url, {
          headers: { 'User-Agent': 'BirdDiary/1.0' },
        });
        if (!res.ok) throw new Error('Nominatim error');
        const data: NominatimResult[] = await res.json();
        setSuggestions(
          data.map((r) => {
            const parts = r.display_name.split(', ');
            const value = parts.slice(0, 2).join(', ');
            return {
              displayName: r.display_name,
              value,
              lat: parseFloat(r.lat),
              lon: parseFloat(r.lon),
            };
          }),
        );
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return { suggestions, loading };
}
