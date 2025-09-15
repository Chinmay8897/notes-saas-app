import { useState, useEffect, useCallback } from 'react';
import { notesService } from '../services/notes';
import { useAuth } from './useAuth';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noteStats, setNoteStats] = useState({
    total: 0,
    canCreate: false
  });

  const { user } = useAuth();

  const calculateStats = useCallback((notesList) => {
    const total = notesList.length;
    const canCreate = user?.tenant?.plan === 'pro' || total < (user?.tenant?.noteLimit || 3);

    setNoteStats({ total, canCreate });
  }, [user]);

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notesService.getNotes();
      setNotes(data);
      calculateStats(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const createNote = useCallback(async (noteData) => {
    try {
      const newNote = await notesService.createNote(noteData);
      setNotes(prev => {
        const updated = [newNote, ...prev];
        calculateStats(updated);
        return updated;
      });
      return newNote;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create note';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [calculateStats]);

  const updateNote = useCallback(async (id, noteData) => {
    try {
      const updatedNote = await notesService.updateNote(id, noteData);
      setNotes(prev => {
        const updated = prev.map(note =>
          note._id === id ? updatedNote : note
        );
        calculateStats(updated);
        return updated;
      });
      return updatedNote;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update note';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [calculateStats]);

  const deleteNote = useCallback(async (id) => {
    try {
      await notesService.deleteNote(id);
      setNotes(prev => {
        const updated = prev.filter(note => note._id !== id);
        calculateStats(updated);
        return updated;
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete note';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [calculateStats]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user, loadNotes]);

  return {
    notes,
    loading,
    error,
    noteStats,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    clearError
  };
}
