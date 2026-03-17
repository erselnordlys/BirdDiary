import { useState } from 'react';
import type { BirdEntry } from '../../types/BirdEntry';
import { EntryEditForm } from './EntryEditForm';
import styles from './EntryList.module.scss';

interface EntryListProps {
  entries: BirdEntry[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Omit<BirdEntry, 'id'>) => void;
}

export function EntryList({ entries, onRemove, onUpdate }: EntryListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <p className={styles.empty}>
        No sightings yet — log your first bird above!
      </p>
    );
  }

  function handleDeleteClick(id: string) {
    if (confirmDeleteId === id) {
      onRemove(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  }

  return (
    <ul className={styles.list}>
      {entries.map((entry) => (
        <li
          key={entry.id}
          className={styles.card}
          onMouseLeave={() => setConfirmDeleteId(null)}
        >
          {editingId === entry.id ? (
            <EntryEditForm
              entry={entry}
              onSave={(data) => {
                onUpdate(entry.id, data);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className={styles.cardContent}>
              {entry.photoUrl && (
                <img
                  src={entry.photoUrl}
                  alt={entry.species}
                  className={styles.cardPhoto}
                />
              )}
              <div className={styles.cardText}>
                <div className={styles.cardHeader}>
                  <span className={styles.species}>{entry.species}</span>
                  <span className={styles.date}>
                    {new Date(entry.dateTime).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.location}>
                    <span className={styles.pin}>📍</span>
                    {entry.location}
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => { setEditingId(entry.id); setConfirmDeleteId(null); }}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.actionBtn} ${confirmDeleteId === entry.id ? styles.deleteBtnConfirm : styles.deleteBtn}`}
                      onClick={() => handleDeleteClick(entry.id)}
                    >
                      {confirmDeleteId === entry.id ? 'Confirm?' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
