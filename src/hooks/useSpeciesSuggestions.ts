import { useState, useEffect } from 'react';

export interface BirdTaxon {
  sciName: string;
  comName: string;
  photoUrl?: string;
}

interface INatTaxon {
  name: string;
  preferred_common_name?: string;
  default_photo?: { medium_url: string };
}

interface INatResponse {
  results: INatTaxon[];
}

export function useSpeciesSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<BirdTaxon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(query)}&rank=species&iconic_taxa=Aves&per_page=8`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`iNaturalist API error: ${res.status}`);
        const data: INatResponse = await res.json();
        setSuggestions(
          data.results.map((r) => ({
            sciName: r.name,
            comName: r.preferred_common_name ?? r.name,
            photoUrl: r.default_photo?.medium_url,
          })),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return { suggestions, loading, error };
}
