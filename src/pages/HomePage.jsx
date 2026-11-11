import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import CreatePostCard from '../components/CreatePostCard';
import CommentModal from '../components/CommentModal';
import CollaborateModal from '../components/CollaborateModal';
import ProjectDetailModal from '../components/ProjectDetailModal';
import CreateProjectModal from '../components/CreateProjectModal';
import ProfileModal from '../components/ProfileModal';
import VSSUTCampusModal from '../components/VSSUTCampusModal';
import { featuredColleges } from '../data/collegesData';

export default function HomePage({ searchQuery = '' }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Spotlight and campus filter state
  const [sponsoredTab, setSponsoredTab] = useState('campus'); // 'campus' | 'sponsored'
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [campusFilter, setCampusFilter] = useState('');
  const [currentCollegeIndex, setCurrentCollegeIndex] = useState(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);

  // Modals state
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [commentProject, setCommentProject] = useState(null);
  const [collaborateProject, setCollaborateProject] = useState(null);
  const [detailProject, setDetailProject] = useState(null);

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

  // 10-second auto-rotation for college sponsorship & campus showcase
  useEffect(() => {
    if (isSpotlightPaused) return;
    const timer = setInterval(() => {
      setCurrentCollegeIndex(prev => (prev + 1) % featuredColleges.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [isSpotlightPaused]);

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

  const handlePostCreated = (newPost) => {
    // Add to project list as a new post/project
    setProjects(prev => [newPost, ...prev]);
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
    const authorEmail = (collaborateProject?.author?.email || (collaborateProject?.author?.name === 'Shridhara Panda' ? 'shridhara.panda@gmail.com' : (collaborateProject?.author?.name || ''))).toLowerCase().trim();
    const authorName = (collaborateProject?.author?.name || 'Project Lead').toLowerCase().trim();
    const myEmail = (user?.email || '').toLowerCase().trim();
    const myName = (user?.name || '').toLowerCase().trim();

    const isMyOwnProject = Boolean(
      user && (
        (myEmail && authorEmail && myEmail === authorEmail) ||
        (myName && authorName && myName === authorName) ||
        (collaborateProject?.userId && user.id && collaborateProject.userId === user.id) ||
        (collaborateProject?.author?.id && user.id && collaborateProject.author.id === user.id)
      )
    );

    if (isMyOwnProject) {
      return;
    }

    api.submitCollaboration(projectId, collabData);

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

  // Active college for the 10-second rotating sponsorship spotlight
  const currentCollege = featuredColleges[currentCollegeIndex] || featuredColleges[0];

  const handleNextCollege = (e) => {
    e?.stopPropagation?.();
    setCurrentCollegeIndex(prev => (prev + 1) % featuredColleges.length);
  };

  const handlePrevCollege = (e) => {
    e?.stopPropagation?.();
    setCurrentCollegeIndex(prev => (prev - 1 + featuredColleges.length) % featuredColleges.length);
  };

  const handleSelectCollege = (idx, e) => {
    e?.stopPropagation?.();
    setCurrentCollegeIndex(idx);
  };

  const handleFilterByCollege = (query) => {
    const q = query || currentCollege.filterQuery;
    setCampusFilter(q);
    setActiveCategory('all');
    const feedEl = document.getElementById('projects');
    if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearCampusFilter = () => {
    setCampusFilter('');
  };

  const handleOpenSponsoredProject = (spProject) => {
    const proj = projects.find(p => (p.id || p._id) === spProject.id) || {
      id: spProject.id,
      title: spProject.title,
      description: spProject.description,
      category: spProject.category || 'hardware',
      author: spProject.author || {
        name: `${currentCollege.name} Builders`,
        college: currentCollege.name
      },
      likes: 45,
      comments: [],
      skills: spProject.skills || ['Engineering', 'Design'],
      tags: spProject.tags || [currentCollege.filterQuery, 'Hardware']
    };
    setDetailProject(proj);
  };

  // Filter projects by category, search query, and campus filter
  const filteredProjects = projects.filter(p => {
    const matchesCategory =
      activeCategory === 'all' ||
      (p.category && p.category.toLowerCase().includes(activeCategory.toLowerCase()));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.skills && p.skills.some(s => s.toLowerCase().includes(query))) ||
      (p.author?.college && p.author.college.toLowerCase().includes(query)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));

    const matchesCampus = !campusFilter || (
      (p.author?.college && p.author.college.toLowerCase().includes(campusFilter.toLowerCase())) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(campusFilter.toLowerCase())))
    );

    return matchesCategory && matchesSearch && matchesCampus;
  });

  return (
    <main className="layout">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="left">
        {/* Profile Summary Card */}
        <div className="card profile reveal" style={{ opacity: 1, transform: 'none' }}>
          <div
            className="profile-cover"
            style={
              user?.coverImage
                ? {
                    backgroundImage: `url(${user.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }
                : {}
            }
          ></div>
          <div className="profile-avatar" style={{ overflow: 'hidden' }}>
            {user?.avatarImage || user?.profilePicture ? (
              <img
                src={user.avatarImage || user.profilePicture}
                alt={user?.name || 'Profile Avatar'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              user?.name ? user.name.slice(0, 2).toUpperCase() : 'SP'
            )}
          </div>

          <h2>{user?.name || 'Shridhara Panda'}</h2>
          <p className="college">{user?.college || 'VSSUT, Burla'}</p>
          <p className="course">{user?.course || 'Computer Science Engineering'}</p>

          <div className="stats">
            <div>
              <strong className="counter">{user?.projectsCount || 12}</strong>
              <span>Projects</span>
            </div>
            <div>
              <strong className="counter">{user?.connectionsCount || 86}</strong>
              <span>Connections</span>
            </div>
            <div>
              <strong className="counter">{user?.skills?.length || 5}</strong>
              <span>Skills</span>
            </div>
          </div>

          <div className="skills">
            {(user?.skills || ['JavaScript', 'HTML', 'CSS', 'C++', 'DSA']).map((skill, idx) => (
              <span key={idx}>{skill}</span>
            ))}
          </div>

          <button
            className="outline-btn"
            id="profileBtn"
            onClick={() => setIsProfileOpen(true)}
          >
            Edit Profile
          </button>
        </div>

        {/* Multi-College Spotlight & Grants (Auto-rotates every 10 seconds) */}
        <div
          className="card sponsored reveal vssut-spotlight-card"
          style={{ opacity: 1, transform: 'none', position: 'relative', overflow: 'hidden' }}
          onMouseEnter={() => setIsSpotlightPaused(true)}
          onMouseLeave={() => setIsSpotlightPaused(false)}
        >
          {/* 10-Second Auto-rotation Progress Bar */}
          <div
            key={currentCollege.id + (isSpotlightPaused ? '-paused' : '-active')}
            className={`spotlight-progress-bar ${isSpotlightPaused ? 'paused' : 'running'}`}
            title={isSpotlightPaused ? 'Rotation paused on hover' : 'Next college sponsorship in 10 seconds'}
          />

          {/* Card Header & Controls */}
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px' }}>🏛️</span>
              <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>Campus Grants</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button
                type="button"
                onClick={handlePrevCollege}
                className="carousel-nav-btn"
                aria-label="Previous College"
                title="Previous College"
              >
                ‹
              </button>
              <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary, #6366f1)', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                {currentCollege.badge}
              </span>
              <button
                type="button"
                onClick={handleNextCollege}
                className="carousel-nav-btn"
                aria-label="Next College"
                title="Next College (Auto-rotates every 10s)"
              >
                ›
              </button>
            </div>
          </div>

          {/* 4 College Dots Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            {featuredColleges.map((col, idx) => (
              <button
                key={col.id}
                type="button"
                onClick={(e) => handleSelectCollege(idx, e)}
                style={{
                  width: idx === currentCollegeIndex ? '18px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  background: idx === currentCollegeIndex ? 'var(--primary, #6366f1)' : 'var(--border, #cbd5e1)',
                  transition: 'all 0.25s ease'
                }}
                title={`Switch to ${col.name} (Auto-rotates in 10s)`}
              />
            ))}
          </div>

          {/* Tab Switcher: Campus vs Sponsored */}
          <div className="spotlight-tabs" style={{ display: 'flex', gap: '4px', background: 'var(--surface-subtle, rgba(0,0,0,0.04))', padding: '3px', borderRadius: '8px', marginBottom: '12px' }}>
            <button
              type="button"
              className={`spotlight-tab ${sponsoredTab === 'campus' ? 'active' : ''}`}
              onClick={() => setSponsoredTab('campus')}
              style={{
                flex: 1,
                padding: '6px 4px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: sponsoredTab === 'campus' ? 'var(--card-bg, #ffffff)' : 'transparent',
                color: sponsoredTab === 'campus' ? 'var(--primary, #6366f1)' : 'var(--muted, #64748b)',
                boxShadow: sponsoredTab === 'campus' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              🏛️ Campus Wins
            </button>
            <button
              type="button"
              className={`spotlight-tab ${sponsoredTab === 'sponsored' ? 'active' : ''}`}
              onClick={() => setSponsoredTab('sponsored')}
              style={{
                flex: 1,
                padding: '6px 4px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: sponsoredTab === 'sponsored' ? 'var(--card-bg, #ffffff)' : 'transparent',
                color: sponsoredTab === 'sponsored' ? 'var(--primary, #6366f1)' : 'var(--muted, #64748b)',
                boxShadow: sponsoredTab === 'sponsored' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              🚀 Sponsored Grants
            </button>
          </div>

          {/* Animated College Content */}
          <div key={currentCollege.id} className="spotlight-animated-content">
            {sponsoredTab === 'campus' ? (
              <div className="campus-tab-content">
                {/* Campus Real Image Container */}
                <div
                  className="campus-photo-container"
                  onClick={() => setIsCampusModalOpen(true)}
                  style={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    height: '115px',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    border: '1px solid var(--border)'
                  }}
                  title={`Click to explore ${currentCollege.name} Campus & History`}
                >
                  <img
                    src={currentCollege.campusImage}
                    alt={`${currentCollege.name} Campus`}
                    onError={(e) => {
                      e.currentTarget.src = currentCollege.fallbackImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80";
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.2) 65%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '8px 10px'
                    }}
                  >
                    <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {currentCollege.estd}
                    </span>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 700, lineHeight: 1.2 }}>
                      {currentCollege.name}
                    </span>
                  </div>
                </div>

                {/* Campus Achievements Mini Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                  <div style={{ background: 'var(--surface-subtle, #f8fafc)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 8px', overflow: 'hidden' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary, #6366f1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentCollege.stats.stat1.value}
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentCollege.stats.stat1.label}
                    </div>
                  </div>
                  <div style={{ background: 'var(--surface-subtle, #f8fafc)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 8px', overflow: 'hidden' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentCollege.stats.stat2.value}
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentCollege.stats.stat2.label}
                    </div>
                  </div>
                </div>

                {/* Innovation highlight */}
                <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed var(--primary, #6366f1)', borderRadius: '8px', padding: '8px 10px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <span>💡</span> {currentCollege.highlightTitle}
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: '10.5px', color: 'var(--muted)', lineHeight: 1.35 }}>
                    {currentCollege.highlightDesc}
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    type="button"
                    className="explore-sponsored-btn"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center', padding: '7px 10px', fontSize: '11.5px', borderRadius: '6px' }}
                    onClick={() => handleFilterByCollege(currentCollege.filterQuery)}
                  >
                    🎓 View {currentCollege.name} Projects ({projects.filter(p => (p.author?.college && p.author.college.toLowerCase().includes(currentCollege.filterQuery.toLowerCase())) || (p.tags && p.tags.some(t => t.toLowerCase().includes(currentCollege.filterQuery.toLowerCase())))).length}) →
                  </button>
                  <button
                    type="button"
                    className="outline-btn"
                    style={{ width: '100%', padding: '6px 10px', fontSize: '11px', textAlign: 'center', borderRadius: '6px' }}
                    onClick={() => setIsCampusModalOpen(true)}
                  >
                    🏛️ Campus Achievements Modal ↗
                  </button>
                </div>
              </div>
            ) : (
              <div className="sponsored-tab-content">
                {/* Both Sponsored Projects from this college */}
                {currentCollege.sponsoredProjects.map((spProj) => (
                  <div key={spProj.id} className="sponsored-project" style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <small style={{ color: 'var(--primary, #6366f1)', fontWeight: 700 }}>{spProj.grant}</small>
                      <span style={{ fontSize: '10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                        {spProj.sponsor}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '13px', margin: '3px 0' }}>{spProj.title}</h4>
                    <p style={{ fontSize: '11.5px', margin: '0 0 6px' }}>{spProj.description}</p>
                    <button
                      type="button"
                      className="explore-sponsored-btn"
                      onClick={() => handleOpenSponsoredProject(spProj)}
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                    >
                      View Project Details →
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="outline-btn"
                  style={{ width: '100%', padding: '6px', fontSize: '11px', textAlign: 'center', borderRadius: '6px' }}
                  onClick={() => setIsCreateProjectOpen(true)}
                >
                  {currentCollege.grantApplyLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ================= CENTER FEED ================= */}
      <section className="feed" id="projects">
        {/* Hero */}
        <div className="hero reveal" style={{ opacity: 1, transform: 'none' }}>
          <div>
            <span className="eyebrow">STUDENT INNOVATION NETWORK</span>
            <h1>
              Build. <span>Collaborate.</span> Grow.
            </h1>
            <p>
              Discover student projects, find talented teammates and turn ideas into reality.
            </p>
          </div>

          <button
            className="primary-btn"
            id="createProject"
            onClick={() => setIsCreateProjectOpen(true)}
          >
            <span>＋</span> Create Project
          </button>
        </div>

        {/* Create Post */}
        <CreatePostCard onPostCreated={handlePostCreated} />

        {/* Category Filters */}
        <div className="filters reveal" style={{ opacity: 1, transform: 'none' }}>
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'web', label: 'Web' },
            { id: 'ai', label: 'AI / ML' },
            { id: 'hardware', label: 'Hardware' },
            { id: 'social', label: 'Social Impact' }
          ].map(cat => (
            <button
              key={cat.id}
              className={`filter ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Campus Filter Active Banner */}
        {campusFilter && (
          <div
            className="campus-filter-banner"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid var(--primary, #6366f1)',
              borderRadius: '10px',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              <span>🎓</span>
              <span>
                Filtering by <strong>{campusFilter}, Burla</strong> ({filteredProjects.length} projects found)
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearCampusFilter}
              style={{
                background: 'var(--surface, #ffffff)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--primary, #6366f1)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                padding: '4px 10px'
              }}
            >
              Clear Filter ✕
            </button>
          </div>
        )}

        {/* Projects Feed */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
            Loading projects...
          </p>
        ) : filteredProjects.length === 0 ? (
          <div className="card empty-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <strong>No matching projects found</strong>
            <p style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
              Try another category or create the first project!
            </p>
            <button
              className="primary-btn"
              style={{ marginTop: '16px' }}
              onClick={() => setIsCreateProjectOpen(true)}
            >
              Create Project
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

      {/* ================= RIGHT SIDEBAR ================= */}
      <aside className="right">
        {/* Mentor Card */}
        <div className="card right-card reveal" style={{ opacity: 1, transform: 'none' }}>
          <div className="right-icon">◈</div>
          <small>GUIDANCE</small>
          <h3>Find a Mentor</h3>
          <p>Connect with seniors, researchers and industry professionals.</p>
          <button
            className="secondary-btn"
            id="mentorBtn"
            onClick={() => navigate('/members')}
          >
            Find Mentor →
          </button>
        </div>

        {/* Sponsor Card */}
        <div className="card sponsor-card reveal" style={{ opacity: 1, transform: 'none' }}>
          <div className="sponsor-icon">✦</div>
          <small>PROJECT FUNDING</small>
          <h3>Sponsor Your Project</h3>
          <p>Get your project discovered by companies and organizations.</p>
          <button
            className="primary-btn"
            id="sponsorBtn"
            onClick={() => setIsCreateProjectOpen(true)}
          >
            Get Sponsorship
          </button>
        </div>

        {/* Hackathons Events */}
        <div className="card hackathons reveal" style={{ opacity: 1, transform: 'none' }}>
          <div className="card-title">
            <div>
              <small>EVENTS</small>
              <h3>Recent Hackathons</h3>
            </div>
            <span>◇</span>
          </div>

          <div
            className="event event-clickable"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/hackathons')}
          >
            <div className="date">
              <strong>28</strong>
              <span>SEP</span>
            </div>
            <div>
              <h4>AWS Student Hackathon</h4>
              <p>Online · Team of 2</p>
            </div>
          </div>

          <div
            className="event event-clickable"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/hackathons')}
          >
            <div className="date">
              <strong>02</strong>
              <span>OCT</span>
            </div>
            <div>
              <h4>Innovation Challenge</h4>
              <p>IIT Kharagpur</p>
            </div>
          </div>

          <div
            className="event event-clickable"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/hackathons')}
          >
            <div className="date">
              <strong>10</strong>
              <span>OCT</span>
            </div>
            <div>
              <h4>National TechFest</h4>
              <p>BITS Pilani · Team of 4</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <CommentModal
        project={commentProject}
        isOpen={Boolean(commentProject)}
        onClose={() => setCommentProject(null)}
        onAddComment={handleAddComment}
      />

      <CollaborateModal
        project={collaborateProject}
        isOpen={Boolean(collaborateProject)}
        onClose={() => setCollaborateProject(null)}
        onSubmitRequest={handleCollaborateSubmit}
      />

      <ProjectDetailModal
        project={detailProject}
        isOpen={Boolean(detailProject)}
        onClose={() => setDetailProject(null)}
        onCollaborate={(p) => setCollaborateProject(p)}
      />

      <VSSUTCampusModal
        isOpen={isCampusModalOpen}
        onClose={() => setIsCampusModalOpen(false)}
        onExploreProjects={(query) => handleFilterByCollege(query || currentCollege.filterQuery)}
        college={currentCollege}
      />
    </main>
  );
}
