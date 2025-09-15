import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

function NoteCard({ note, onEdit, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete(note._id);
      setShowDeleteConfirm(false);
    } catch (error) {
      // Error handling done in parent
    }
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h4 className="note-title">{note.title}</h4>
        <div className="note-actions">
          <button
            onClick={() => onEdit(note)}
            className="edit-button"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="note-content">
        {note.content.length > 150
          ? note.content.substring(0, 150) + '...'
          : note.content
        }
      </div>

      <div className="note-footer">
        <span className="note-date">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
        <span className="note-author">
          by {note.userId.email}
        </span>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete this note?</p>
          <div className="confirm-actions">
            <button onClick={handleDelete} className="confirm-delete">
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="cancel-delete"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteCard;
