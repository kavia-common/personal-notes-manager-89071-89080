import React, { useMemo, useState } from 'react';
import './App.css';
import { NotesProvider } from './context/NotesContext';
import Header from './components/Header';
import NotesView from './components/NotesView';
import NoteEditorModal from './components/NoteEditorModal';
import FloatingActionButton from './components/FloatingActionButton';

// PUBLIC_INTERFACE
function App() {
  /** Root shell composing header, content, and modal editor. */
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [editorState, setEditorState] = useState({ open: false, note: null });

  const handleCreate = () => setEditorState({ open: true, note: null });
  const handleEdit = (note) => setEditorState({ open: true, note });
  const handleClose = () => setEditorState({ open: false, note: null });

  const filters = useMemo(() => ({ query }), [query]);

  return (
    <NotesProvider>
      <div className="app-shell">
        <Header query={query} onQueryChange={setQuery} />
        <main className="content">
          <div className="toolbar">
            <div className="view-toggle" role="group" aria-label="Toggle view">
              <button
                className={`btn ${view === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
              >
                Grid
              </button>
              <button
                className={`btn ${view === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
              >
                List
              </button>
            </div>
            <div className="muted" style={{ color: 'var(--muted)' }}>
              Ocean Professional · Blue & Amber accents
            </div>
          </div>

          <NotesView view={view} filters={filters} onEdit={handleEdit} />
        </main>

        <FloatingActionButton onClick={handleCreate} />

        <NoteEditorModal
          open={editorState.open}
          initialNote={editorState.note}
          onClose={handleClose}
        />
      </div>
    </NotesProvider>
  );
}

export default App;
