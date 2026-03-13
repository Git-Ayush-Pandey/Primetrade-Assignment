import React, { useState, useEffect } from 'react';
import { notesAPI } from '../api/notes';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  authorId?: { _id: string; email: string };
  createdAt: string;
}

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchNotes = async () => {
    try {
      const data = await notesAPI.getAll();
      setNotes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      if (editingId) {
        await notesAPI.update(editingId, { title, content });
        setEditingId(null);
      } else {
        await notesAPI.create({ title, content });
      }
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save note');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await notesAPI.delete(id);
      fetchNotes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete note');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Note' : 'Create New Note'}</h2>
        {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
            >
              {editingId ? <><Check className="w-4 h-4 mr-2" /> Update Note</> : <><Plus className="w-4 h-4 mr-2" /> Add Note</>}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {user.role === 'admin' ? 'All System Notes (Admin)' : 'Your Notes'}
      </h2>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200 text-gray-500">
          No notes found. Create your first note above!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition group position-relative">
              {user.role === 'admin' && note.authorId && (
                <div className="text-xs text-indigo-600 font-medium mb-2 bg-indigo-50 inline-block px-2 py-1 rounded">
                  Author: {note.authorId.email || 'Unknown'}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{note.title}</h3>
              <p className="text-gray-600 mb-4 whitespace-pre-wrap line-clamp-3">{note.content}</p>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                    title="Edit Note"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
