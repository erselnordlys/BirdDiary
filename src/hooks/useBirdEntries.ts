import { useState, useEffect } from 'react';
import type { BirdEntry } from '../types/BirdEntry';

export function useBirdEntries() {
  const [entries, setEntries] = useState<BirdEntry[]>(() => {
    const stored = localStorage.getItem('birdEntries');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('birdEntries', JSON.stringify(entries));
  }, [entries]);

  function addEntry(entry: Omit<BirdEntry, 'id'>) {
    const newEntry: BirdEntry = { ...entry, id: crypto.randomUUID() };
    setEntries((prev) => [newEntry, ...prev]);
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function updateEntry(id: string, data: Omit<BirdEntry, 'id'>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
  );

  return { entries: sorted, addEntry, removeEntry, updateEntry };
}
