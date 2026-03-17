import { useState, useRef, useEffect, useCallback } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import styles from './Autocomplete.module.scss';

interface AutocompleteProps<T> {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  suggestions: T[];
  loading: boolean;
  renderSuggestion: (item: T, highlighted: boolean) => ReactNode;
  getSuggestionValue: (item: T) => string;
  required?: boolean;
}

export function Autocomplete<T>({
  id,
  label,
  placeholder,
  value,
  onChange,
  onSelect,
  suggestions,
  loading,
  renderSuggestion,
  getSuggestionValue: _getSuggestionValue,
  required,
}: AutocompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = open && suggestions.length > 0;

  // Close on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Reset highlight when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  const selectItem = useCallback(
    (item: T) => {
      onSelect(item);
      setOpen(false);
      setHighlightedIndex(-1);
    },
    [onSelect],
  );

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      selectItem(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className={styles.field} ref={wrapperRef}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          required={required}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={isOpen ? `${id}-listbox` : undefined}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined
          }
        />
        {loading && <span className={styles.spinner} aria-hidden="true" />}
      </div>

      {isOpen && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className={styles.dropdown}
        >
          {suggestions.map((item, i) => (
            <li
              key={i}
              id={`${id}-option-${i}`}
              role="option"
              aria-selected={i === highlightedIndex}
              className={`${styles.option} ${i === highlightedIndex ? styles.optionHighlighted : ''}`}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent blur before click fires
                selectItem(item);
              }}
              onMouseEnter={() => setHighlightedIndex(i)}
            >
              {renderSuggestion(item, i === highlightedIndex)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
