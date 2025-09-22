import React from 'react';

// PUBLIC_INTERFACE
export default function NoteCard({ note, onEdit, onDelete }) {
  /** Compact note card for grid layout. */
  return (
    <article className="card" role="listitem" aria-label={`Note: ${note.title || 'Untitled'}`}>
      <h3 className="note-title">{note.title || 'Untitled'}</h3>
      <div className="note-meta">Updated {new Date(note.updated_at).toLocaleString()}</div>
      <p style={{ marginTop: 8, marginBottom: 8, whiteSpace: 'pre-wrap' }}>
        {note.content?.slice(0, 180)}
        {note.content && note.content.length > 180 ? '…' : ''}
      </p>
      <div className="note-actions">
        <button className="btn btn-primary" onClick={onEdit}>Edit</button>
        <button className="btn" onClick={onDelete}>Delete</button>
      </div>
    </article>
  );
}
