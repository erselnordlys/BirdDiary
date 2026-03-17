import { useState } from "react";
import { useBirdEntries } from "./hooks/useBirdEntries";
import { EntryForm } from "./components/EntryForm/EntryForm";
import { EntryList } from "./components/EntryList/EntryList";
import { MapView } from "./components/MapView/MapView";
import styles from "./App.module.scss";

type Tab = "log" | "map";

export default function App() {
  const { entries, addEntry, removeEntry, updateEntry } = useBirdEntries();
  const [tab, setTab] = useState<Tab>("log");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.logo}>🐦 My BirdDiary</h1>
        <p className={styles.tagline}>Track every feathered encounter</p>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === "log" ? styles.tabActive : ""}`}
          onClick={() => setTab("log")}
        >
          Sighting Log
          {entries.length > 0 && (
            <span className={styles.tabCount}>{entries.length}</span>
          )}
        </button>
        <button
          className={`${styles.tab} ${tab === "map" ? styles.tabActive : ""}`}
          onClick={() => setTab("map")}
        >
          Map
        </button>
      </nav>

      {tab === "log" && (
        <main className={styles.main}>
          <EntryForm onAdd={addEntry} />

          {entries.length > 0 && (
            <section className={styles.log}>
              <h2 className={styles.logTitle}>Sighting Log</h2>
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
      )}

      {tab === "map" && (
        <div className={styles.mainWide}>
          <MapView entries={entries} />
        </div>
      )}
    </div>
  );
}
