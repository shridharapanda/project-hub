import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CommentModal({ project, isOpen, onClose, onAddComment }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (onAddComment) {
      onAddComment(project.id || project._id, {
        id: 'comment-' + Date.now(),
        author: user?.name || "Student Builder",
        text: commentText.trim(),
        time: "Just now"
      });
    }

    setCommentText('');
  };

  return (
    <div className="modal-bg show" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <small>COMMENTS</small>
        <h2>{project.title}</h2>

        <div className="comments">
          {!project.comments || project.comments.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '16px 0' }}>
              No comments yet. Start the conversation!
            </p>
          ) : (
            project.comments.map(c => (
              <div key={c.id} className="comment-item">
                <div className="comment-avatar">
                  {c.author.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong>{c.author}</strong>
                  <p>{c.text}</p>
                  <small style={{ color: 'var(--muted)', fontSize: '10px' }}>{c.time}</small>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="comment-input">
          <input
            type="text"
            placeholder="Write a constructive comment or question..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            required
          />
          <button type="submit" className="primary-btn-sm">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
