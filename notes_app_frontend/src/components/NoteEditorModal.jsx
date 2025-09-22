import React, { useEffect, useState } from 'react';
import { useNotes } from '../context/NotesContext';

// PUBLIC_INTERFACE
export default function NoteEditorModal({ open, initialNote, onClose }) {
  /** Modal dialog for creating and editing notes. */
  const isEdit = !!initialNote;
  const { addNote, editNote } = useNotes();

  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(initialNote?.title || '');
    setContent(initialNote?.content || '');
  }, [initialNote]);

  if (!open) return null;

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await editNote(initialNote.id, { title, content });
      } else {
        await addNote({ title, content });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit note' : 'Create note'}>
      <div className="modal">
        <div className="modal-header">
          <strong>{isEdit ? 'Edit Note' : 'New Note'}</strong>
          <button className="btn" onClick={onClose} aria-label="Close editor">✕</button>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <input
              className="input"
              placeholder="Title"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="textarea"
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
