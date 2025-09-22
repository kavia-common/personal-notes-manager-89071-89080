import React from 'react';

// PUBLIC_INTERFACE
export default function Header({ query, onQueryChange }) {
  /** App header with brand and search. */
  return (
    <header className="header" role="banner">
      <div className="header-inner">
        <div className="brand" aria-label="Notes brand">
          <div className="brand-mark" />
          <div className="brand-title">Personal Notes</div>
        </div>

        <div className="header-actions">
          <div className="search" role="search">
            <span aria-hidden="true" style={{ color: 'var(--muted)' }}>🔎</span>
            <input
              aria-label="Search notes"
              placeholder="Search notes..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
