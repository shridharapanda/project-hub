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

export default function HomePage({ searchQuery = '' }) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

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

  // Filter projects by category and search query
  const filteredProjects = projects.filter(p => {
    const matchesCategory =
      activeCategory === 'all' ||
      (p.category && p.category.toLowerCase().includes(activeCategory.toLowerCase()));

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.skills && p.skills.some(s => s.toLowerCase().includes(query)));

    return matchesCategory && matchesSearch;
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

        {/* Sponsored Projects */}
        <div className="card sponsored reveal" style={{ opacity: 1, transform: 'none' }}>
          <div className="card-title">
            <h3>Sponsored Projects</h3>
            <span>✦</span>
          </div>

          <div className="sponsored-project">
            <small>SPONSORED</small>
            <h4>Smart Campus</h4>
            <p>Build the next generation campus experience.</p>
            <button
              className="explore-sponsored-btn"
              onClick={() => {
                setActiveCategory('web');
              }}
            >
              Explore →
            </button>
          </div>

          <div className="sponsored-project">
            <small>SPONSORED</small>
            <h4>AI Agriculture</h4>
            <p>Technology for modern farming.</p>
            <button
              className="explore-sponsored-btn"
              onClick={() => {
                setActiveCategory('ai');
              }}
            >
              Explore →
            </button>
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
    </main>
  );
}
