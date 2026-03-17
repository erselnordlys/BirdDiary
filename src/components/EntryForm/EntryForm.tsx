import { useState, useRef } from 'react';
import type { BirdEntry } from '../../types/BirdEntry';
import { Autocomplete } from '../Autocomplete/Autocomplete';
import { useSpeciesSuggestions, type BirdTaxon } from '../../hooks/useSpeciesSuggestions';
import { useLocationSuggestions, type LocationSuggestion } from '../../hooks/useLocationSuggestions';
import { compressImage } from '../../utils/compressImage';
import styles from './EntryForm.module.scss';
import acStyles from '../Autocomplete/Autocomplete.module.scss';

interface EntryFormProps {
  onAdd: (entry: Omit<BirdEntry, 'id'>) => void;
}

function nowLocal() {
  const d = new Date();
  d.setSeconds(0, 0);
  return d.toISOString().slice(0, 16);
}

export function EntryForm({ onAdd }: EntryFormProps) {
  const [speciesQuery, setSpeciesQuery] = useState('');
  const [species, setSpecies] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState(nowLocal);
  const [photoUrl, setPhotoUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { suggestions: speciesSuggestions, loading: speciesLoading } =
    useSpeciesSuggestions(speciesQuery);
  const { suggestions: locationSuggestions, loading: locationLoading } =
    useLocationSuggestions(locationQuery);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setPhotoUrl(compressed);
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!species.trim() || !location.trim() || !dateTime) return;
    onAdd({ species: species.trim(), location: location.trim(), dateTime, photoUrl: photoUrl || undefined });
    setSpeciesQuery('');
    setSpecies('');
    setLocationQuery('');
    setLocation('');
    setDateTime(nowLocal());
    setPhotoUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Log a Sighting</h2>

      <Autocomplete<BirdTaxon>
        id="species"
        label="Bird Name / Species"
        placeholder="e.g. American Robin"
        value={speciesQuery}
        onChange={(val) => {
          setSpeciesQuery(val);
          setSpecies(val);
        }}
        onSelect={(taxon) => {
          const display = `${taxon.comName} (${taxon.sciName})`;
          setSpeciesQuery(display);
          setSpecies(display);
          if (taxon.photoUrl && !photoUrl) setPhotoUrl(taxon.photoUrl);
        }}
        suggestions={speciesSuggestions}
        loading={speciesLoading}
        getSuggestionValue={(t) => `${t.comName} (${t.sciName})`}
        renderSuggestion={(t) => (
          <>
            <span className={acStyles.optionMain}>{t.comName}</span>
            <span className={acStyles.optionSub}>{t.sciName}</span>
          </>
        )}
        required
      />

      <Autocomplete<LocationSuggestion>
        id="location"
        label="Location"
        placeholder="Place name or UK postcode, e.g. Hyde Park or SW1A"
        value={locationQuery}
        onChange={(val) => {
          setLocationQuery(val);
          setLocation(val);
        }}
        onSelect={(result) => {
          setLocationQuery(result.value);
          setLocation(result.value);
        }}
        suggestions={locationSuggestions}
        loading={locationLoading}
        getSuggestionValue={(r) => r.value}
        renderSuggestion={(r) => {
          const parts = r.displayName.split(', ');
          return (
            <>
              <span className={acStyles.optionMain}>{parts[0]}</span>
              <span className={acStyles.optionSub}>{parts.slice(1).join(', ')}</span>
            </>
          );
        }}
        required
      />

      <div className={styles.field}>
        <label htmlFor="dateTime">Date & Time</label>
        <input
          id="dateTime"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />
      </div>

      <div className={styles.photoField}>
        <span className={styles.photoLabel}>Photo</span>
        <div className={styles.photoRow}>
          {photoUrl && (
            <img src={photoUrl} alt="Sighting preview" className={styles.photoPreview} />
          )}
          <div className={styles.uploadArea}>
            <label htmlFor="photo" className={styles.uploadBtn}>
              {photoUrl ? 'Replace photo' : 'Upload photo'}
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              className={styles.fileInput}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {photoUrl && (
              <button
                type="button"
                className={styles.removePhotoBtn}
                onClick={() => { setPhotoUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              >
                Remove
              </button>
            )}
            {!photoUrl && (
              <p className={styles.photoHint}>Or select a species above to auto-fill</p>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className={styles.submit}>
        Add Sighting
      </button>
    </form>
  );
}
