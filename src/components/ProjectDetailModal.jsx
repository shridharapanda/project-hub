import React, { useEffect } from 'react';

export default function ProjectDetailModal({ project, isOpen, onClose, onCollaborate }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const author = project.author || project.creator;
  let authorAvatar = author?.avatarImage || author?.profilePicture || null;
  if (!authorAvatar && author) {
    try {
      const db = JSON.parse(localStorage.getItem('ph_users_db') || '{}');
      const authorEmail = (author.email || '').toLowerCase().trim();
      const authorName = (author.name || '').toLowerCase().trim();
      const matched = (authorEmail && db[authorEmail]) || (authorName && db[authorName]);
      if (matched) {
        authorAvatar = matched.avatarImage || matched.profilePicture || null;
      }
    } catch (e) {}
  }

  return (
    <div
      className="modal-backdrop show active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detailTitle"
      style={{
        display: 'flex',
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        padding: '20px'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal"
        style={{ maxHeight: '90vh', overflowY: 'auto', width: 'min(620px, 100%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close-modal"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="eyebrow">
          {project.badge || (project.category ? project.category.toUpperCase() : 'PROJECT DETAILS')}
        </div>

        <h2 id="detailTitle" style={{ marginTop: '4px' }}>
          {project.title}
        </h2>

        {author && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', marginBottom: '16px' }}>
            <div className="project-avatar" style={{ width: '38px', height: '38px', fontSize: '13px', overflow: 'hidden' }}>
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={author.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                author.initials || author.avatar || (author.name || 'PH').slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <strong style={{ fontSize: '14px', display: 'block' }}>{author.name}</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{author.college || author.role || 'Student Builder'}</span>
            </div>
          </div>
        )}

        {project.mediaUrl && (
          <div style={{ marginTop: '12px', marginBottom: '16px', overflow: 'hidden', borderRadius: '12px', maxHeight: '340px' }}>
            <img
              src={project.mediaUrl}
              alt={project.title}
              style={{ width: '100%', maxHeight: '340px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        <p style={{ marginTop: '12px', lineHeight: '1.6', fontSize: '14px' }}>
          {project.description}
        </p>

        {project.neededRoles && project.neededRoles.length > 0 && (
          <div style={{ marginTop: '18px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Recruiting For Roles
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {project.neededRoles.map((role, idx) => (
                <span key={idx} style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary, #6366f1)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                  👥 {role}
                </span>
              ))}
            </div>
          </div>
        )}

        {(project.tags || project.skills) && (project.tags?.length > 0 || project.skills?.length > 0) && (
          <div style={{ marginTop: '18px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Technologies & Tags
            </label>
            <div className="tags" style={{ marginTop: '6px' }}>
              {(project.tags || project.skills).map((t, idx) => (
                <span key={idx} className="tag">{t}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <i className="fa-brands fa-github"></i> Repository
            </a>
          )}
          {project.demoLink && (
            <a
              href={project.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
            </a>
          )}
        </div>

        <button
          className="primary-btn"
          type="button"
          style={{ marginTop: '24px', width: '100%' }}
          onClick={() => {
            onClose();
            if (onCollaborate) onCollaborate(project);
          }}
        >
          🤝 I'm interested in joining this team
        </button>
      </div>
    </div>
  );
}
