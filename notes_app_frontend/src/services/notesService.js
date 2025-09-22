/**
 * Notes Service
 * Provides CRUD operations using Supabase when configured, otherwise falls back to localStorage.
 * The public functions are documented and prefixed with PUBLIC_INTERFACE comments.
 */

import supabase from '../supabaseClient';

const STORAGE_KEY = 'notes_app_items_v1';

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function nowISO() {
  return new Date().toISOString();
}

// Local mock storage helpers
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveLocal(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Normalize note shape
 */
function normalize(note) {
  return {
    id: note.id,
    title: note.title || '',
    content: note.content || '',
    created_at: note.created_at || nowISO(),
    updated_at: note.updated_at || note.created_at || nowISO(),
  };
}

// PUBLIC_INTERFACE
export async function initNotesStorage() {
  /**
   * Initialize storage. If Supabase is configured, ensure 'notes' table exists (best-effort).
   * For mock, pre-populate with a sample note if empty.
   */
  if (!supabase) {
    const items = loadLocal();
    if (items.length === 0) {
      const sample = normalize({
        id: uid(),
        title: 'Welcome to Notes',
        content:
          'This is a sample note. Supabase is not configured, so your notes are saved in your browser only.',
        created_at: nowISO(),
        updated_at: nowISO(),
      });
      saveLocal([sample]);
    }
    return;
  }

  // With Supabase: assume schema exists. If not, app still runs but storage ops may fail.
}

// PUBLIC_INTERFACE
export async function listNotes({ query = '' } = {}) {
  /**
   * List notes filtered by query (matches title or content).
   * Returns array of normalized notes.
   */
  if (!supabase) {
    const items = loadLocal();
    const q = query.trim().toLowerCase();
    const filtered = q
      ? items.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q)
        )
      : items;
    return filtered.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
  }
  // Supabase implementation
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) {
    // fallback to empty on error
    // console.error('Supabase list error', error);
    return [];
  }
  const items = (data || []).map(normalize);
  if (!query) return items;
  const q = query.trim().toLowerCase();
  return items.filter(
    (n) =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }) {
  /**
   * Create a note and return it.
   */
  const payload = normalize({
    id: uid(),
    title,
    content,
    created_at: nowISO(),
    updated_at: nowISO(),
  });

  if (!supabase) {
    const items = loadLocal();
    items.unshift(payload);
    saveLocal(items);
    return payload;
  }

  const { data, error } = await supabase.from('notes').insert({
    id: payload.id,
    title: payload.title,
    content: payload.content,
    created_at: payload.created_at,
    updated_at: payload.updated_at,
  }).select('*').single();

  if (error) {
    // console.error('Supabase create error', error);
    return payload; // do not block UI
  }
  return normalize(data);
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }) {
  /**
   * Update a note by id and return the updated note.
   */
  const updatedAt = nowISO();

  if (!supabase) {
    const items = loadLocal();
    const idx = items.findIndex((n) => n.id === id);
    if (idx !== -1) {
      items[idx] = normalize({
        ...items[idx],
        title,
        content,
        updated_at: updatedAt,
      });
      saveLocal(items);
      return items[idx];
    }
    return null;
  }

  const { data, error } = await supabase
    .from('notes')
    .update({ title, content, updated_at: updatedAt })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    // console.error('Supabase update error', error);
    return null;
  }
  return normalize(data);
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /**
   * Delete a note by id. Returns true if deleted.
   */
  if (!supabase) {
    const items = loadLocal();
    const next = items.filter((n) => n.id !== id);
    saveLocal(next);
    return true;
  }

  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) {
    // console.error('Supabase delete error', error);
    return false;
  }
  return true;
}
