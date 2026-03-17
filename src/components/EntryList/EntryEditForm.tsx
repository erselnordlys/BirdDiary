import { useState, useRef } from 'react';
import type { BirdEntry } from '../../types/BirdEntry';
import { Autocomplete } from '../Autocomplete/Autocomplete';
import { useSpeciesSuggestions, type BirdTaxon } from '../../hooks/useSpeciesSuggestions';
import { useLocationSuggestions, type LocationSuggestion } from '../../hooks/useLocationSuggestions';
import { compressImage } from '../../utils/compressImage';
import acStyles from '../Autocomplete/Autocomplete.module.scss';
import styles from './EntryList.module.scss';
import formStyles from '../EntryForm/EntryForm.module.scss';

interface EntryEditFormProps {
  entry: BirdEntry;
  onSave: (data: Omit<BirdEntry, 'id'>) => void;
  onCancel: () => void;
}

export function EntryEditForm({ entry, onSave, onCancel }: EntryEditFormProps) {
  const [speciesQuery, setSpeciesQuery] = useState(entry.species);
  const [species, setSpecies] = useState(entry.species);
  const [locationQuery, setLocationQuery] = useState(entry.location);
  const [location, setLocation] = useState(entry.location);
  const [dateTime, setDateTime] = useState(entry.dateTime);
  const [photoUrl, setPhotoUrl] = useState(entry.photoUrl ?? '');
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
    onSave({ species: species.trim(), location: location.trim(), dateTime, photoUrl: photoUrl || undefined });
  }

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      <Autocomplete<BirdTaxon>
        id={`edit-species-${entry.id}`}
        label="Bird Name / Species"
        placeholder="e.g. American Robin"
        value={speciesQuery}
        onChange={(val) => { setSpeciesQuery(val); setSpecies(val); }}
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
        id={`edit-location-${entry.id}`}
        label="Location"
        placeholder="Place name or UK postcode"
        value={locationQuery}
        onChange={(val) => { setLocationQuery(val); setLocation(val); }}
        onSelect={(result) => { setLocationQuery(result.value); setLocation(result.value); }}
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

      <div className={styles.editDateField}>
        <label htmlFor={`edit-datetime-${entry.id}`}>Date & Time</label>
        <input
          id={`edit-datetime-${entry.id}`}
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />
      </div>

      <div className={formStyles.photoField}>
        <span className={formStyles.photoLabel}>Photo</span>
        <div className={formStyles.photoRow}>
          {photoUrl && (
            <img src={photoUrl} alt="Sighting preview" className={formStyles.photoPreview} />
          )}
          <div className={formStyles.uploadArea}>
            <label htmlFor={`edit-photo-${entry.id}`} className={formStyles.uploadBtn}>
              {photoUrl ? 'Replace photo' : 'Upload photo'}
            </label>
            <input
              id={`edit-photo-${entry.id}`}
              type="file"
              accept="image/*"
              className={formStyles.fileInput}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {photoUrl && (
              <button
                type="button"
                className={formStyles.removePhotoBtn}
                onClick={() => { setPhotoUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.editActions}>
        <button type="submit" className={styles.saveBtn}>Save</button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
