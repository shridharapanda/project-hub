import React, { useState } from 'react';

export default function CollaborateModal({ project, isOpen, onClose, onSubmitRequest }) {
  const [role, setRole] = useState('Frontend Developer');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitRequest(project.id, { role, message });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-bg show" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <small>JOIN TEAM</small>
        <h2>Join {project.title}</h2>
        <p>Send a collaboration request to contribute to this student project.</p>

        {submitted ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--green)' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '36px', marginBottom: '10px' }}></i>
            <h3>Request Sent Successfully!</h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>The project lead has been notified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-field">
              <label htmlFor="collabRole">Your Preferred Role *</label>
              <select
                id="collabRole"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="AI / ML Engineer">AI / Machine Learning Engineer</option>
                <option value="UI/UX Designer">UI / UX Designer</option>
                <option value="IoT / Hardware Developer">IoT / Hardware Developer</option>
                <option value="Mobile App Developer">Mobile App Developer</option>
              </select>
            </div>

            <div className="modal-field">
              <label htmlFor="collabMessage">Why are you interested in this project? *</label>
              <textarea
                id="collabMessage"
                rows="3"
                placeholder="Mention your relevant tech stack, availability, or GitHub..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="modal-buttons">
              <button type="submit" className="primary-btn">
                Send Request 🤝
              </button>
              <button type="button" className="secondary-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
