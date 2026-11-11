import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProjectCard({
  project,
  onLike,
  onOpenComments,
  onCommentClick,
  onOpenDetail,
  onViewProject,
  onOpenCollaborate,
  onCollaborateClick
}) {
  const { user } = useAuth();
  const userEmail = user?.email?.toLowerCase().trim();

  const author = project.author || {
    name: "Student Builder",
    role: "Developer",
    college: "Campus",
    initials: "SB",
    avatarColor: "purple"
  };

  const myEmail = (user?.email || '').toLowerCase().trim();
  const myName = (user?.name || '').toLowerCase().trim();
  const authorEmail = (author.email || '').toLowerCase().trim();
  const authorName = (author.name || '').toLowerCase().trim();

  // Check if current user is the author of this post/project
  const isMyProject = Boolean(
    user && (
      (myEmail && authorEmail && myEmail === authorEmail) ||
      (myName && authorName && myName === authorName) ||
      (project.userId && user.id && project.userId === user.id) ||
      (author.id && user.id && author.id === user.id)
    )
  );

  // Multi-user like check: checks if current account email is in project's likedBy list
  const isLikedByMe = Boolean(
    userEmail && Array.isArray(project.likedBy)
      ? project.likedBy.includes(userEmail)
      : project.liked
  );

  // Dynamically resolve author avatar from author object or persistent users database
  let authorAvatar = author.avatarImage || author.profilePicture || null;
  if (!authorAvatar) {
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

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (onLike) {
      onLike(project.id || project._id);
    }
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    const handler = onOpenComments || onCommentClick;
    if (handler) {
      handler(project);
    }
  };

  const handleCollaborateClick = (e) => {
    e.stopPropagation();
    if (isMyProject) return;
    const handler = onOpenCollaborate || onCollaborateClick;
    if (handler) {
      handler(project);
    }
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    const handler = onOpenDetail || onViewProject;
    if (handler) {
      handler(project);
    }
  };

  return (
    <article
      className="project-card card"
      data-category={project.category}
      style={{ cursor: 'pointer' }}
      onClick={handleDetailClick}
    >
      <div className="project-header">
        <div className="user">
          <div className={`project-avatar ${author.avatarColor || 'purple'}`} style={{ overflow: 'hidden' }}>
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={author.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              author.initials || (author.name ? author.name.slice(0, 2).toUpperCase() : 'SB')
            )}
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
          <div style={{ marginTop: '14px', overflow: 'hidden', borderRadius: '12px' }}>
            <img
              src={project.mediaUrl}
              alt={project.title}
              style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="tags" style={{ marginTop: '12px' }}>
            {project.tags.map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="project-bottom">
        <div className="actions">
          {/* Like Button */}
          <button
            type="button"
            className={isLikedByMe ? 'liked' : ''}
            onClick={handleLikeClick}
            title={isLikedByMe ? 'Unlike project' : 'Like project'}
            style={{
              transition: 'all 0.15s ease',
              transform: isLikedByMe ? 'scale(1.05)' : 'none'
            }}
          >
            <i
              className={isLikedByMe ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}
              style={{ color: isLikedByMe ? 'var(--red, #e11d48)' : 'inherit' }}
            ></i>{' '}
            {project.likes || 0}
          </button>

          {/* Comment Button */}
          <button
            type="button"
            onClick={handleCommentClick}
            title="View & add comments"
          >
            <i className="fa-regular fa-comment"></i>{' '}
            {project.comments ? project.comments.length : 0}
          </button>

          {/* Join / Collaborate Button (Hidden for owner) */}
          {!isMyProject ? (
            <button
              type="button"
              onClick={handleCollaborateClick}
              title="Request to join team"
            >
              <i className="fa-solid fa-user-plus"></i> Join
            </button>
          ) : (
            <span
              style={{
                fontSize: '11px',
                color: 'var(--primary, #6366f1)',
                background: 'rgba(99, 102, 241, 0.08)',
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="You created this post"
            >
              👑 Your Post
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button
          type="button"
          className="view-project"
          onClick={handleDetailClick}
        >
          View details →
        </button>
      </div>
    </article>
  );
}
