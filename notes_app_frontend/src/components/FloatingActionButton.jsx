import React from 'react';

// PUBLIC_INTERFACE
export default function FloatingActionButton({ onClick }) {
  /** Floating action button for creating a new note. */
  return (
    <button className="fab" onClick={onClick} aria-label="Create new note">
      +
    </button>
  );
}
