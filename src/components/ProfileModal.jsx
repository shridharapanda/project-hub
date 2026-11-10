import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || 'VSSUT, Burla');
  const [role, setRole] = useState(user?.role || 'Computer Science Engineering');
  const [skills, setSkills] = useState(user?.skills ? user.skills.join(', ') : 'JavaScript, React, Node.js');
  const [bio, setBio] = useState('Passionate student developer exploring web applications and AI systems.');
  const [savedMsg, setSavedMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      college,
      role,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onClose();
    }, 1000);
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

        <div className="editor-cover">
          <div className="cover-upload-btn">
            <i className="fa-solid fa-camera"></i> Change Cover
          </div>
        </div>

        <div className="editor-avatar-section">
          <div className="editor-avatar-wrap">
            <div id="profileInitials">{initials}</div>
            <button className="avatar-upload-btn" title="Change Avatar">
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
            <div className="profile-save-message">
              ✓ Profile saved successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
