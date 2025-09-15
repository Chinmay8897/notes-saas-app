import React, { useState } from 'react';

function NoteForm({ note, onSubmit, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-form">
      <h3>{isEditing ? 'Edit Note' : 'Create New Note'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter note title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Enter note content"
            rows={6}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="save-button">
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NoteForm;
