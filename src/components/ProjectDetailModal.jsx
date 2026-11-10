import React from 'react';

export default function ProjectDetailModal({ project, isOpen, onClose, onCollaborate }) {
  if (!isOpen || !project) return null;

  return (
    <div
      className="modal-backdrop active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detailTitle"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          type="button"
          className="close-modal"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="eyebrow">
          {project.category || 'Project snapshot'}
        </div>

        <h2 id="detailTitle" style={{ marginTop: '4px' }}>
          {project.title}
        </h2>

        <p style={{ marginTop: '12px', lineHeight: '1.6' }}>
          {project.description}
        </p>

        {(project.author || project.creator) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
            <div className="project-avatar" style={{ width: '36px', height: '36px', fontSize: '13px', overflow: 'hidden' }}>
              {(project.author?.avatarImage || project.creator?.avatarImage) ? (
                <img
                  src={project.author?.avatarImage || project.creator?.avatarImage}
                  alt={project.author?.name || project.creator?.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                project.author?.initials || project.creator?.avatar || (project.author?.name || project.creator?.name || 'PH').slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <strong style={{ fontSize: '14px', display: 'block' }}>{project.author?.name || project.creator?.name}</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{project.author?.college || project.creator?.college || 'Builder'}</span>
            </div>
          </div>
        )}

        {project.skills && project.skills.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Helpful skills
            </label>
            <div className="tags" style={{ marginTop: '8px' }}>
              {project.skills.map((skill, idx) => (
                <span key={idx} className="tag">{skill}</span>
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
          I'm interested in joining
        </button>
      </div>
    </div>
  );
}
