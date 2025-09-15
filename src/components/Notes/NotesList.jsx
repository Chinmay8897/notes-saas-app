import React from 'react';
import NoteCard from './NoteCard';

function NotesList({ notes, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="loading-message">Loading notes...</div>;
  }

  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <h3>No notes yet</h3>
        <p>Create your first note to get started!</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map(note => (
        <NoteCard
          key={note._id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default NotesList;
