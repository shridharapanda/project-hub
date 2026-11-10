import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CreatePostCard({ onCreatePost }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [postType, setPostType] = useState('project');
  const [mediaUrl, setMediaUrl] = useState('');

  const initials = (user?.name || 'SP')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onCreatePost({
      title: text.length > 60 ? text.substring(0, 60) + '...' : text,
      description: text,
      badge: postType === 'project' ? 'Student Project' : postType === 'collab' ? 'Looking for Team' : 'Idea & Pitch',
      category: 'web',
      tags: ['Innovation', 'Student', 'Build'],
      mediaUrl
    });

    setText('');
    setMediaUrl('');
  };

  return (
    <div className="create-post card">
      <form onSubmit={handleSubmit}>
        <div className="post-top">
          <div className="avatar small-avatar">{initials}</div>
          <textarea
            id="postText"
            placeholder="Share a project update, find teammates, or post an idea..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows="3"
            required
          />
        </div>

        {mediaUrl && (
          <div className="media-preview" style={{ display: 'block' }}>
            <img src={mediaUrl} alt="Post preview" />
          </div>
        )}

        <div className="post-bottom">
          <div className="post-options">
            <button
              type="button"
              className={`post-option ${postType === 'project' ? 'active' : ''}`}
              onClick={() => setPostType('project')}
            >
              <span className="option-icon">💡</span> Project
            </button>
            <button
              type="button"
              className={`post-option ${postType === 'collab' ? 'active' : ''}`}
              onClick={() => setPostType('collab')}
            >
              <span className="option-icon">🤝</span> Looking for Team
            </button>
            <button
              type="button"
              className="post-option"
              onClick={() => {
                const url = prompt("Enter an image URL for your project showcase:");
                if (url) setMediaUrl(url);
              }}
            >
              <span className="option-icon">📷</span> Media
            </button>
          </div>

          <button type="submit" className="primary-btn post-btn">
            Post Update
          </button>
        </div>
      </form>
    </div>
  );
}
