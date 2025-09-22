import React, { useEffect, useMemo, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import NoteCard from './NoteCard';

// PUBLIC_INTERFACE
export default function NotesView({ view = 'grid', filters = {}, onEdit }) {
  /** Display notes in grid or list with basic filtering. */
  const { notes, loading, refresh, removeNote } = useNotes();
  const [q, setQ] = useState(filters.query || '');

  useEffect(() => { setQ(filters.query || ''); }, [filters.query]);

  useEffect(() => {
    const id = setTimeout(() => refresh(q), 150);
    return () => clearTimeout(id);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = useMemo(() => notes, [notes]);

  if (loading) return <div className="card">Loading notes…</div>;
  if (!list.length) return <div className="empty">No notes yet. Create your first note!</div>;

  if (view === 'list') {
    return (
      <div className="notes-list" role="list">
        {list.map((n) => (
          <div className="card" key={n.id} role="listitem">
            <h3 className="note-title">{n.title || 'Untitled'}</h3>
            <div className="note-meta">Last updated: {new Date(n.updated_at).toLocaleString()}</div>
            <p style={{ marginTop: 8, marginBottom: 8, whiteSpace: 'pre-wrap' }}>
              {n.content?.slice(0, 320)}
              {n.content && n.content.length > 320 ? '…' : ''}
            </p>
            <div className="note-actions">
              <button className="btn btn-primary" onClick={() => onEdit(n)}>Edit</button>
              <button className="btn" onClick={() => removeNote(n.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="notes-grid" role="list">
      {list.map((n) => (
        <NoteCard key={n.id} note={n} onEdit={() => onEdit(n)} onDelete={() => removeNote(n.id)} />
      ))}
    </div>
  );
}
