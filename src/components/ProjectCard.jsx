import React from 'react';

export default function ProjectCard({ project, onLike, onOpenComments, onOpenDetail, onOpenCollaborate }) {
  const author = project.author || {
    name: "Student Builder",
    role: "Developer",
    college: "Campus",
    initials: "SB",
    avatarColor: "purple"
  };

  return (
    <article className="project-card card" data-category={project.category}>
      <div className="project-header">
        <div className="user">
          <div className={`project-avatar ${author.avatarColor || 'purple'}`}>
            {author.initials || author.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4>{author.name}</h4>
            <p>{author.college || author.role}</p>
          </div>
        </div>
        <span className="completed badge">
          {project.badge || 'Active'}
        </span>
      </div>

      <div className="project-content">
        <small>{(project.category || 'tech').toUpperCase()}</small>
        <h2>{project.title}</h2>
        <p>{project.description}</p>

        {project.mediaUrl && (
          <div style={{ marginTop: '12px' }}>
            <img
              src={project.mediaUrl}
              alt={project.title}
              style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '12px' }}
            />
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="tags">
            {project.tags.map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="project-bottom">
        <div className="actions">
          <button
            type="button"
            className={project.liked ? 'liked' : ''}
            onClick={() => onLike(project.id)}
            title="Like project"
          >
            <i className={project.liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>{' '}
            {project.likes || 0}
          </button>

          <button
            type="button"
            onClick={() => onOpenComments(project)}
            title="View comments"
          >
            <i className="fa-regular fa-comment"></i>{' '}
            {project.comments ? project.comments.length : 0}
          </button>

          <button
            type="button"
            onClick={() => onOpenCollaborate(project)}
            title="Join team"
          >
            <i className="fa-solid fa-user-plus"></i> Join
          </button>
        </div>

        <button
          type="button"
          className="view-project"
          onClick={() => onOpenDetail(project)}
        >
          View details →
        </button>
      </div>
    </article>
  );
}
