import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectDetailModal from '../components/ProjectDetailModal';
import CollaborateModal from '../components/CollaborateModal';
import CommentModal from '../components/CommentModal';

export default function ProjectsPage({ initialSearch = '' }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailProject, setDetailProject] = useState(null);
  const [collaborateProject, setCollaborateProject] = useState(null);
  const [commentProject, setCommentProject] = useState(null);

  useEffect(() => {
    loadProjects();
    const handleSync = () => loadProjects();
    window.addEventListener('ph_profile_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('ph_profile_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const handleLike = (projectId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const { updatedProjects, action, project } = api.likeProject(projectId, user.email);
    setProjects(updatedProjects);

    if (action === 'liked' && project) {
      const authorEmail = project.author?.email || (project.author?.name === 'Shridhara Panda' ? 'shridhara.panda@gmail.com' : (project.author?.name || ''));
      const authorName = project.author?.name || 'Project Lead';

      const myEmail = (user.email || '').toLowerCase().trim();
      const myName = (user.name || '').toLowerCase().trim();
      const isMyOwnProject = (myEmail && authorEmail.toLowerCase().trim() === myEmail) || (myName && authorName.toLowerCase().trim() === myName);

      if (!isMyOwnProject) {
        addNotification({
          icon: 'fa-heart',
          title: 'Project Liked ❤️',
          description: `${user.name || 'A builder'} liked your project "${project.title}".`,
          fromName: user.name || 'Student Builder',
          fromEmail: user.email || '',
          toName: authorName,
          toEmail: authorEmail
        });
      }
    }
  };

  const handleAddComment = (projectId, comment) => {
    let targetProject = commentProject;
    setProjects(prevProjects => {
      const updated = prevProjects.map(p => {
        const id = p.id || p._id;
        if (id === projectId) {
          targetProject = p;
          const comments = p.comments || [];
          return {
            ...p,
            comments: [...comments, comment]
          };
        }
        return p;
      });
      api.saveProjects(updated);
      return updated;
    });

    setCommentProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        comments: [...(prev.comments || []), comment]
      };
    });

    if (targetProject) {
      const authorEmail = targetProject.author?.email || (targetProject.author?.name === 'Shridhara Panda' ? 'shridhara.panda@gmail.com' : (targetProject.author?.name || ''));
      const authorName = targetProject.author?.name || 'Project Lead';

      const myEmail = (user?.email || '').toLowerCase().trim();
      const myName = (user?.name || '').toLowerCase().trim();
      const isMyOwnProject = (myEmail && authorEmail.toLowerCase().trim() === myEmail) || (myName && authorName.toLowerCase().trim() === myName);

      if (!isMyOwnProject) {
        addNotification({
          icon: 'fa-comment',
          title: 'New Comment on Your Project 💬',
          description: `${user?.name || 'A builder'} commented on "${targetProject.title}": "${(comment.text || '').slice(0, 45)}..."`,
          fromName: user?.name || 'Student Builder',
          fromEmail: user?.email || '',
          toName: authorName,
          toEmail: authorEmail
        });
      }
    }
  };

  const handleCollaborateSubmit = (projectId, collabData) => {
    api.submitCollaboration(projectId, collabData);
    const authorEmail = collaborateProject?.author?.email || (collaborateProject?.author?.name === 'Shridhara Panda' ? 'shridhara.panda@gmail.com' : (collaborateProject?.author?.name || ''));
    const authorName = collaborateProject?.author?.name || 'Project Lead';

    addNotification({
      icon: 'fa-user-plus',
      title: 'New Collaboration Request 🤝',
      description: `${user?.name || 'A student'} wants to join "${collaborateProject?.title || 'project'}" as ${collabData.role}.`,
      action: 'collab',
      status: 'pending',
      role: collabData.role,
      projectTitle: collaborateProject?.title || 'Project',
      projectId: projectId,
      fromName: user?.name || 'Student Builder',
      fromEmail: user?.email || '',
      toName: authorName,
      toEmail: authorEmail
    });
  };

  const categories = [
    'All',
    'AI/ML',
    'Web Development',
    'Mobile Development',
    'Cybersecurity',
    'Data Science',
    'Open Source',
    'Social Impact',
    'Other'
  ];

  // Filtering & sorting logic
  const filteredProjects = projects
    .filter(p => {
      const matchCat =
        selectedCategory === 'All' ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      const query = search.toLowerCase().trim();
      const matchSearch =
        !query ||
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.skills && p.skills.some(s => s.toLowerCase().includes(query)));

      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'team') {
        return (b.requiredMembers || 0) - (a.requiredMembers || 0);
      }
      // 'featured'
      return (b.likes || 0) - (a.likes || 0);
    });

  return (
    <main className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Build together · Ship faster</div>
          <h1>
            Ideas become <span>real projects.</span>
          </h1>
          <p>
            Discover student-built products, find teammates who complement
            your skills, and turn your next big idea into something people can use.
          </p>

          <div className="hero-actions">
            <button
              className="primary-btn"
              type="button"
              onClick={() => setIsCreateOpen(true)}
            >
              ＋ Launch a project
            </button>
            <Link className="secondary-btn" to="/members">
              Find collaborators ↗
            </Link>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="hero-stats">
          <div className="hero-stat">
            <strong id="projectCount">{projects.length || 12}</strong>
            <span>Projects shared</span>
          </div>
          <div className="hero-stat">
            <strong>640+</strong>
            <span>Student builders</span>
          </div>
          <div className="hero-stat">
            <strong>24</strong>
            <span>Campuses</span>
          </div>
        </div>
      </section>

      {/* PROJECT TOOLBAR */}
      <section className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0 20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Explore projects</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Find a project that matches your curiosity and skills.
          </p>
        </div>

        <div className="controls" style={{ display: 'flex', gap: '10px' }}>
          <input
            id="searchInput"
            className="search-box"
            type="search"
            placeholder="Search projects or tech…"
            aria-label="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            id="sortSelect"
            className="select-box"
            aria-label="Sort projects"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured first</option>
            <option value="newest">Recently added</option>
            <option value="team">Most teammates needed</option>
          </select>
        </div>
      </section>

      {/* CATEGORY FILTERS */}
      <div className="filters" id="filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter ${selectedCategory === cat ? 'active' : ''}`}
            type="button"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PROJECT LIST */}
      <section className="project-grid" id="projectGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '25px' }}>
        {loading ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Loading projects...
          </p>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px 20px' }}>
            <strong style={{ fontSize: '18px', display: 'block', marginBottom: '8px' }}>No matching projects yet</strong>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Try a different keyword or category, or create a new project.
            </p>
            <button
              className="primary-btn"
              type="button"
              onClick={() => setIsCreateOpen(true)}
            >
              Create a project
            </button>
          </div>
        ) : (
          filteredProjects.map(project => (
            <ProjectCard
              key={project._id || project.id}
              project={project}
              onLike={handleLike}
              onCommentClick={(p) => setCommentProject(p)}
              onOpenComments={(p) => setCommentProject(p)}
              onCollaborateClick={(p) => setCollaborateProject(p)}
              onOpenCollaborate={(p) => setCollaborateProject(p)}
              onViewProject={(p) => setDetailProject(p)}
              onOpenDetail={(p) => setDetailProject(p)}
            />
          ))
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="side-note" style={{ margin: '40px 0', padding: '30px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3>Your next great project starts with one teammate.</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Share your idea, make your required skills clear, and let the right collaborators find you.
          </p>
        </div>
        <button
          className="primary-btn"
          type="button"
          onClick={() => setIsCreateOpen(true)}
        >
          Create a project
        </button>
      </section>

      <footer className="footer" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
        Made for curious builders · <span>ProjectHub</span> · Student collaboration platform
      </footer>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <ProjectDetailModal
        project={detailProject}
        isOpen={Boolean(detailProject)}
        onClose={() => setDetailProject(null)}
        onCollaborate={(p) => setCollaborateProject(p)}
      />

      <CollaborateModal
        project={collaborateProject}
        isOpen={Boolean(collaborateProject)}
        onClose={() => setCollaborateProject(null)}
        onSubmitRequest={handleCollaborateSubmit}
      />

      <CommentModal
        project={commentProject}
        isOpen={Boolean(commentProject)}
        onClose={() => setCommentProject(null)}
        onAddComment={handleAddComment}
      />
    </main>
  );
}
