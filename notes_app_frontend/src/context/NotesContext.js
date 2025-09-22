import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initNotesStorage, listNotes, createNote, updateNote, deleteNote } from '../services/notesService';

const NotesContext = createContext(null);

// PUBLIC_INTERFACE
export function useNotes() {
  /** Access Notes context with notes list, loading state, and CRUD actions. */
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Provider that manages note items and exposes CRUD functions. */
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refresh(query = '') {
    setLoading(true);
    const items = await listNotes({ query });
    setNotes(items);
    setLoading(false);
  }

  useEffect(() => {
    initNotesStorage().then(() => refresh());
  }, []);

  const actions = useMemo(
    () => ({
      refresh,
      // PUBLIC_INTERFACE
      async addNote(payload) {
        /** Create note and refresh list. */
        const created = await createNote(payload);
        await refresh();
        return created;
      },
      // PUBLIC_INTERFACE
      async editNote(id, payload) {
        /** Update note and refresh list. */
        const updated = await updateNote(id, payload);
        await refresh();
        return updated;
      },
      // PUBLIC_INTERFACE
      async removeNote(id) {
        /** Delete note and refresh list. */
        const ok = await deleteNote(id);
        await refresh();
        return ok;
      },
    }),
    []
  );

  return (
    <NotesContext.Provider value={{ notes, loading, ...actions }}>
      {children}
    </NotesContext.Provider>
  );
}
