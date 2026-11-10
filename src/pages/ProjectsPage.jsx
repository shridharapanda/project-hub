import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectDetailModal from '../components/ProjectDetailModal';
import CollaborateModal from '../components/CollaborateModal';
import CommentModal from '../components/CommentModal';

export default function ProjectsPage({ initialSearch = '' }) {
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
            <a className="secondary-btn" href="/members">
              Find collaborators ↗
            </a>
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
              onCommentClick={(p) => setCommentProject(p)}
              onCollaborateClick={(p) => setCollaborateProject(p)}
              onViewProject={(p) => setDetailProject(p)}
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
      />

      <CommentModal
        project={commentProject}
        isOpen={Boolean(commentProject)}
        onClose={() => setCommentProject(null)}
      />
    </main>
  );
}
