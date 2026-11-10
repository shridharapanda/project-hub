import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Helper to resize & compress uploaded images for snappy client performance and localStorage safety
const compressImage = (file, maxWidth, maxHeight, quality = 0.82) => {
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

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || 'VSSUT, Burla');
  const [role, setRole] = useState(user?.role || 'Computer Science Engineering');
  const [skills, setSkills] = useState(user?.skills ? user.skills.join(', ') : 'JavaScript, React, Node.js');
  const [bio, setBio] = useState(user?.bio || 'Passionate student developer exploring web applications and AI systems.');
  const [coverImage, setCoverImage] = useState(user?.coverImage || '');
  const [avatarImage, setAvatarImage] = useState(user?.avatarImage || user?.profilePicture || '');
  const [savedMsg, setSavedMsg] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // Sync state whenever modal opens or user context changes
  useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setCollege(user?.college || 'VSSUT, Burla');
      setRole(user?.role || 'Computer Science Engineering');
      setSkills(user?.skills ? user.skills.join(', ') : 'JavaScript, React, Node.js');
      setBio(user?.bio || 'Passionate student developer exploring web applications and AI systems.');
      setCoverImage(user?.coverImage || '');
      setAvatarImage(user?.avatarImage || user?.profilePicture || '');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressImage(file, 1200, 500, 0.82);
      setCoverImage(compressedDataUrl);
    } catch (err) {
      console.error('Failed to process cover image:', err);
      const reader = new FileReader();
      reader.onload = () => setCoverImage(reader.result);
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      e.target.value = ''; // Reset input to allow re-uploading the same file if needed
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressImage(file, 300, 300, 0.85);
      setAvatarImage(compressedDataUrl);
    } catch (err) {
      console.error('Failed to process avatar image:', err);
      const reader = new FileReader();
      reader.onload = () => setAvatarImage(reader.result);
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      college,
      role,
      bio,
      coverImage,
      avatarImage,
      profilePicture: avatarImage,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onClose();
    }, 900);
  };

  const initials = (name || 'SP')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-editor-overlay open" onClick={onClose}>
      <div className="profile-editor" onClick={e => e.stopPropagation()}>
        <div className="profile-editor-header">
          <div>
            <span className="profile-eyebrow">YOUR PROFILE</span>
            <h2>Profile Settings</h2>
            <p>Customize how you appear to collaborators & project leaders</p>
          </div>
          <button className="profile-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Cover Preview & Upload Area */}
        <div
          className="editor-cover"
          style={{
            position: 'relative',
            backgroundImage: coverImage ? `url(${coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden'
          }}
        >
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover preview"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}

          {/* Hidden file input for cover */}
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="cover-upload-btn"
            onClick={() => coverInputRef.current?.click()}
            title="Upload a new cover photo"
            style={{ cursor: 'pointer', zIndex: 3 }}
          >
            <i className="fa-solid fa-camera"></i> {isProcessing ? 'Processing...' : 'Change Cover'}
          </button>

          {coverImage && (
            <button
              type="button"
              className="cover-upload-btn"
              onClick={() => setCoverImage('')}
              title="Remove custom cover photo"
              style={{
                cursor: 'pointer',
                zIndex: 3,
                right: '155px',
                background: 'rgba(239, 68, 68, 0.92)',
                color: '#ffffff'
              }}
            >
              <i className="fa-solid fa-trash-can"></i> Remove
            </button>
          )}
        </div>

        {/* Avatar Preview & Upload Area */}
        <div className="editor-avatar-section">
          <div className="editor-avatar-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
            {avatarImage ? (
              <img
                src={avatarImage}
                alt="Profile Preview"
                id="profileImagePreview"
                style={{
                  display: 'block',
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div id="profileInitials">{initials}</div>
            )}

            {/* Hidden file input for avatar */}
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <button
              type="button"
              className="avatar-upload-btn"
              title="Change Profile Photo"
              onClick={() => avatarInputRef.current?.click()}
              style={{ cursor: 'pointer', zIndex: 4 }}
            >
              <i className="fa-solid fa-pen"></i>
            </button>
          </div>
          <div>
            <h3>{name || 'Student Builder'}</h3>
            <p>{college} · {role}</p>
          </div>
        </div>

        <form id="profileForm" onSubmit={handleSubmit}>
          <div className="profile-form-grid">
            <div className="profile-field">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="profile-field">
              <label>College / University</label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                required
              />
            </div>

            <div className="profile-field">
              <label>Major / Role</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
              />
            </div>

            <div className="profile-field">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="React, C++, Python, UI/UX"
              />
            </div>

            <div className="profile-field full-width">
              <label>Short Bio</label>
              <textarea
                rows="3"
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="profile-editor-actions">
            <button type="button" className="profile-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="profile-save-btn">
              <i className="fa-solid fa-check"></i> Save Changes
            </button>
          </div>

          {savedMsg && (
            <div className="profile-save-message" style={{ display: 'block', marginTop: '12px' }}>
              ✓ Profile updated & saved successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
