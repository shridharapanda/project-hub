import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

// Helper to compress uploaded post images for quick rendering and localStorage storage
const compressImage = (file, maxWidth = 1200, maxHeight = 700, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function CreatePostCard({ onPostCreated, onCreatePost }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [postType, setPostType] = useState('project');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const initials = (user?.name || 'SP')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleMediaFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const compressedDataUrl = await compressImage(file);
      setMediaUrl(compressedDataUrl);
    } catch (err) {
      console.error('Failed to compress media image:', err);
      const reader = new FileReader();
      reader.onload = () => setMediaUrl(reader.result);
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      e.target.value = ''; // allow selecting same file again
    }
  };

  const handleMediaButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const postCallback = onPostCreated || onCreatePost;

    const newPostData = {
      id: 'post-' + Date.now(),
      title: text.length > 60 ? text.substring(0, 60) + '...' : text,
      description: text.trim(),
      badge: postType === 'project' ? 'Student Project' : postType === 'collab' ? 'Looking for Team' : 'Idea & Pitch',
      category: postType === 'project' ? 'web' : postType === 'collab' ? 'collab' : 'ai',
      tags: ['Innovation', 'Student', postType === 'collab' ? 'Teamup' : 'Build'],
      mediaUrl: mediaUrl || '',
      likes: 0,
      liked: false,
      comments: [],
      author: {
        name: user?.name || 'Shridhara Panda',
        role: user?.role || 'Computer Science Student',
        college: user?.college || 'VSSUT, Burla',
        initials: (user?.name || 'SP').slice(0, 2).toUpperCase(),
        avatarColor: 'purple',
        avatarImage: user?.avatarImage || user?.profilePicture || null
      },
      createdAt: new Date().toISOString()
    };

    // Save to storage
    try {
      await api.createProject(newPostData);
    } catch (err) {
      console.warn('Could not persist to api storage:', err);
    }

    if (postCallback) {
      postCallback(newPostData);
    }

    setText('');
    setMediaUrl('');
  };

  return (
    <div className="create-post card">
      <form onSubmit={handleSubmit}>
        <div className="post-top">
          <div className="avatar small-avatar" style={{ overflow: 'hidden' }}>
            {user?.avatarImage || user?.profilePicture ? (
              <img
                src={user.avatarImage || user.profilePicture}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              initials
            )}
          </div>
          <textarea
            id="postText"
            placeholder="Share a project update, find teammates, or post an idea..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows="3"
            required
          />
        </div>

        {/* Media Preview Box */}
        {mediaUrl && (
          <div className="media-preview" style={{ display: 'block', position: 'relative', marginTop: '12px' }}>
            <img
              src={mediaUrl}
              alt="Post preview"
              style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '10px' }}
            />
            <button
              type="button"
              onClick={() => setMediaUrl('')}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              title="Remove media"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hidden File Input for Media Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleMediaFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

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
              className={`post-option ${mediaUrl ? 'active' : ''}`}
              onClick={handleMediaButtonClick}
              title="Upload image / screenshot"
            >
              <span className="option-icon">📷</span> {uploading ? 'Processing...' : mediaUrl ? 'Change Media' : 'Media'}
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
