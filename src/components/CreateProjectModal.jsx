import React, { useState } from 'react';
import { api } from '../services/api';

export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    skills: '',
    requiredMembers: 3,
    githubLink: '',
    demoLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide a title and description.');
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
        skills: skillsArray,
        requiredMembers: parseInt(formData.requiredMembers, 10) || 1,
        githubLink: formData.githubLink.trim(),
        demoLink: formData.demoLink.trim()
      };

      const result = await api.createProject(payload);
      if (onProjectCreated) {
        onProjectCreated(result.project || result);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="createProjectTitle"
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
          Project name
        </label>
        <input
          id="projectName"
          name="title"
          type="text"
          required
          maxLength="60"
          placeholder="e.g. Campus Copilot"
          value={formData.title}
          onChange={handleChange}
        />

        <label htmlFor="projectCategory">
          Category
        </label>
        <select
          id="projectCategory"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="Web Development">Web Development</option>
          <option value="AI/ML">AI / ML</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Data Science">Data Science</option>
          <option value="Social Impact">Social Impact</option>
          <option value="Open Source">Open Source</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="projectDescription">
          What are you building?
        </label>
        <textarea
          id="projectDescription"
          name="description"
          required
          maxLength="400"
          placeholder="Describe the problem, your idea, and who it helps..."
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="projectSkills">
          Required skills (comma separated)
        </label>
        <input
          id="projectSkills"
          name="skills"
          type="text"
          placeholder="e.g. React, Node.js, MongoDB"
          value={formData.skills}
          onChange={handleChange}
        />

        <label htmlFor="requiredMembers">
          Team size
        </label>
        <input
          id="requiredMembers"
          name="requiredMembers"
          type="number"
          min="1"
          max="100"
          value={formData.requiredMembers}
          onChange={handleChange}
          required
        />

        <label htmlFor="githubLink">
          GitHub link (optional)
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
          Demo link (optional)
        </label>
        <input
          id="demoLink"
          name="demoLink"
          type="url"
          placeholder="https://example.com"
          value={formData.demoLink}
          onChange={handleChange}
        />

        <button className="primary-btn" type="submit" disabled={loading} style={{ marginTop: '16px' }}>
          {loading ? 'Creating...' : 'Create project'}
        </button>
      </form>
    </div>
  );
}
