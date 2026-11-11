import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

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

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    skills: '',
    requiredMembers: 3,
    githubLink: '',
    demoLink: '',
    mediaUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const compressed = await compressImage(file);
      setFormData(prev => ({ ...prev, mediaUrl: compressed }));
    } catch (err) {
      console.error('Error reading image:', err);
      const reader = new FileReader();
      reader.onload = () => setFormData(prev => ({ ...prev, mediaUrl: reader.result }));
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide a project name and description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const skillsArray = typeof formData.skills === 'string'
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : formData.skills;

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        skills: skillsArray.length > 0 ? skillsArray : ['React', 'JavaScript'],
        requiredMembers: parseInt(formData.requiredMembers, 10) || 2,
        githubLink: formData.githubLink.trim(),
        demoLink: formData.demoLink.trim(),
        mediaUrl: formData.mediaUrl || '',
        badge: formData.category,
        author: {
          name: user?.name || 'Shridhara Panda',
          role: user?.role || 'Computer Science Engineering',
          college: user?.college || 'VSSUT, Burla',
          initials: (user?.name || 'SP').slice(0, 2).toUpperCase(),
          avatarColor: 'purple',
          avatarImage: user?.avatarImage || user?.profilePicture || null
        }
      };

      const result = await api.createProject(payload);
      if (onProjectCreated) {
        onProjectCreated(result.project || result);
      }
      onClose();
    } catch (err) {
      console.error('Project creation failed:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop show active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="createProjectTitle"
      style={{ display: 'flex' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form className="modal" onSubmit={handleSubmit} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          type="button"
          className="close-modal"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="eyebrow">
          Bring your idea to life
        </div>

        <h2 id="createProjectTitle">
          Create a project
        </h2>

        <p>
          Give your idea a clear name and tell future teammates what you're building.
        </p>

        {error && (
          <p role="alert" style={{ color: '#ef4444', fontSize: '13px', margin: '8px 0' }}>
            {error}
          </p>
        )}

        <label htmlFor="projectName">
          Project name *
        </label>
        <input
          id="projectName"
          name="title"
          type="text"
          required
          maxLength="70"
          placeholder="e.g. AI Attendance System using Facial Recognition"
          value={formData.title}
          onChange={handleChange}
        />

        <label htmlFor="projectCategory">
          Category *
        </label>
        <select
          id="projectCategory"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="Web Development">Web Development</option>
          <option value="AI / ML">AI / ML</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="IoT & Hardware">IoT & Hardware</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Data Science">Data Science</option>
          <option value="Social Impact">Social Impact</option>
          <option value="Open Source">Open Source</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="projectDescription">
          What are you building? *
        </label>
        <textarea
          id="projectDescription"
          name="description"
          required
          rows="3"
          maxLength="500"
          placeholder="Describe the problem, your solution, and what kind of collaborators you need..."
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        {/* Project Screenshot / Media Upload */}
        <div style={{ marginTop: '12px', marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '6px' }}>
            Project Screenshot / Media (optional)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {formData.mediaUrl ? (
            <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', maxHeight: '180px', marginBottom: '10px' }}>
              <img
                src={formData.mediaUrl}
                alt="Project screenshot"
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, mediaUrl: '' }))}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Remove image"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="outline-btn"
              onClick={() => fileInputRef.current?.click()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 14px' }}
            >
              <i className="fa-solid fa-camera"></i> {uploadingImage ? 'Processing...' : 'Upload Screenshot / Cover'}
            </button>
          )}
        </div>

        <label htmlFor="projectSkills">
          Required skills (comma separated)
        </label>
        <input
          id="projectSkills"
          name="skills"
          type="text"
          placeholder="e.g. React, Node.js, Python, MongoDB"
          value={formData.skills}
          onChange={handleChange}
        />

        <label htmlFor="requiredMembers">
          Team size needed
        </label>
        <input
          id="requiredMembers"
          name="requiredMembers"
          type="number"
          min="1"
          max="20"
          value={formData.requiredMembers}
          onChange={handleChange}
          required
        />

        <label htmlFor="githubLink">
          GitHub repository (optional)
        </label>
        <input
          id="githubLink"
          name="githubLink"
          type="url"
          placeholder="https://github.com/username/project"
          value={formData.githubLink}
          onChange={handleChange}
        />

        <label htmlFor="demoLink">
          Live Demo link (optional)
        </label>
        <input
          id="demoLink"
          name="demoLink"
          type="url"
          placeholder="https://myproject.dev"
          value={formData.demoLink}
          onChange={handleChange}
        />

        <button className="primary-btn" type="submit" disabled={loading} style={{ marginTop: '20px', width: '100%' }}>
          {loading ? 'Creating...' : '＋ Create Project'}
        </button>
      </form>
    </div>
  );
}
