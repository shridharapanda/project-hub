import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function CollaborateModal({ project, isOpen, onClose, onSubmitRequest }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [role, setRole] = useState('Frontend Developer');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !project) return null;

  const myEmail = (user?.email || '').toLowerCase().trim();
  const myName = (user?.name || '').toLowerCase().trim();
  const authorEmail = (project.author?.email || '').toLowerCase().trim();
  const authorName = (project.author?.name || '').toLowerCase().trim();

  const isMyProject = Boolean(
    user && (
      (myEmail && authorEmail && myEmail === authorEmail) ||
      (myName && authorName && myName === authorName) ||
      (project.userId && user.id && project.userId === user.id) ||
      (project.author?.id && user.id && project.author.id === user.id)
    )
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isMyProject) {
      onClose();
      return;
    }
    if (onSubmitRequest) {
      onSubmitRequest(project.id || project._id, { role, message });
    } else if (addNotification) {
      const authorEmail = project.author?.email || (project.author?.name === 'Shridhara Panda' ? 'shridhara.panda@gmail.com' : (project.author?.name || ''));
      const authorName = project.author?.name || 'Project Lead';
      addNotification({
        icon: 'fa-user-plus',
        title: 'New Collaboration Request 🤝',
        description: `${user?.name || 'A student'} wants to join "${project.title}" as ${role}.`,
        action: 'collab',
        status: 'pending',
        role,
        projectTitle: project.title,
        projectId: project.id || project._id,
        fromName: user?.name || 'Student Builder',
        fromEmail: user?.email || '',
        toName: authorName,
        toEmail: authorEmail
      });
    }
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
