import { useBirdEntries } from "./hooks/useBirdEntries";
import { EntryForm } from "./components/EntryForm/EntryForm";
import { EntryList } from "./components/EntryList/EntryList";
import styles from "./App.module.scss";

export default function App() {
  const { entries, addEntry, removeEntry, updateEntry } = useBirdEntries();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>🐦 My BirdDiary</h1>
        <p className={styles.tagline}>Track every feathered encounter</p>
      </header>

      <main className={styles.main}>
        <EntryForm onAdd={addEntry} />

        {entries.length > 0 && (
          <section className={styles.log}>
            <h2 className={styles.logTitle}>
              Sighting Log
              <span className={styles.count}>{entries.length}</span>
            </h2>
            <EntryList
              entries={entries}
              onRemove={removeEntry}
              onUpdate={updateEntry}
            />
          </section>
        )}

        {entries.length === 0 && (
          <section className={styles.log}>
            <EntryList
              entries={entries}
              onRemove={removeEntry}
              onUpdate={updateEntry}
            />
          </section>
        )}
      </main>
    </div>
  );
}
