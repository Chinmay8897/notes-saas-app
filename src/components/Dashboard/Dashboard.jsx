import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import NotesList from '../Notes/NotesList';
import NoteForm from '../Notes/NoteForm';
import UpgradePrompt from '../Notes/UpgradePrompt';
import InvitationsList from '../Admin/InvitationsList';
import { notesService } from '../../services/notes';

function Dashboard() {
  const { user, logout, updateTenant } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await notesService.getNotes();
      setNotes(data);
    } catch (error) {
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const newNote = await notesService.createNote(noteData);
      setNotes(prev => [newNote, ...prev]);
      setShowForm(false);
    } catch (error) {
      if (error.response?.data?.code === 'NOTE_LIMIT_REACHED') {
        setError(error.response.data.error);
      } else {
        setError('Failed to create note');
      }
      throw error;
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const updatedNote = await notesService.updateNote(id, noteData);
      setNotes(prev => prev.map(note =>
        note._id === id ? updatedNote : note
      ));
      setEditingNote(null);
    } catch (error) {
      setError('Failed to update note');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await notesService.deleteNote(id);
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (error) {
      setError('Failed to delete note');
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await notesService.upgradeTenant(user.tenant.slug);
      updateTenant(response.tenant);
      setError(null);
    } catch (error) {
      setError('Failed to upgrade plan');
    }
  };

  const canCreateNote = user.tenant.plan === 'pro' || notes.length < user.tenant.noteLimit;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Notes Dashboard</h1>
            <p>Welcome, {user.email}</p>
          </div>
          <div className="header-actions">
            <div className="tenant-info">
              <span className="tenant-name">{user.tenant.name}</span>
              <span className={`plan-badge ${user.tenant.plan}`}>
                {user.tenant.plan.toUpperCase()}
              </span>
            </div>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}

        {user.tenant.plan === 'free' && notes.length >= user.tenant.noteLimit && (
          <UpgradePrompt
            onUpgrade={handleUpgrade}
            canUpgrade={user.role === 'admin'}
          />
        )}

        {user.role === 'admin' && (
          <InvitationsList />
        )}

        <div className="notes-section">
          <div className="notes-header">
            <h2>Your Notes ({notes.length})</h2>
            {canCreateNote && (
              <button
                onClick={() => setShowForm(true)}
                className="create-button"
              >
                Create Note
              </button>
            )}
          </div>

          {showForm && (
            <NoteForm
              onSubmit={handleCreateNote}
              onCancel={() => setShowForm(false)}
            />
          )}

          {editingNote && (
            <NoteForm
              note={editingNote}
              onSubmit={(data) => handleUpdateNote(editingNote._id, data)}
              onCancel={() => setEditingNote(null)}
              isEditing
            />
          )}

          <NotesList
            notes={notes}
            loading={loading}
            onEdit={setEditingNote}
            onDelete={handleDeleteNote}
          />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
