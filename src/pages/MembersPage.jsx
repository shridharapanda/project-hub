import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';

export default function MembersPage() {
  const { user } = useAuth();
  const { addNotification, allNotifications } = useNotifications();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [, setRefreshKey] = useState(0);
  const [connectedMap, setConnectedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('ph_connected_members');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [toastMessage, setToastMessage] = useState('');

  // Create Profile modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Frontend Developer',
    skills: '',
    college: 'VSSUT'
  });

  useEffect(() => {
    loadMembers();
    const handleSync = () => {
      loadMembers();
      setRefreshKey(prev => prev + 1);
    };
    window.addEventListener('ph_profile_updated', handleSync);
    window.addEventListener('ph_connections_updated', handleSync);
    window.addEventListener('ph_notification_event', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('ph_profile_updated', handleSync);
      window.removeEventListener('ph_connections_updated', handleSync);
      window.removeEventListener('ph_notification_event', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await api.getMembers();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const resolveMemberAvatar = (member) => {
    if (member.avatarImage || member.profilePicture) {
      return member.avatarImage || member.profilePicture;
    }
    try {
      const db = JSON.parse(localStorage.getItem('ph_users_db') || '{}');
      const mEmail = (member.email || '').toLowerCase().trim();
      const mName = (member.name || '').toLowerCase().trim();
      const matched = (mEmail && db[mEmail]) || (mName && db[mName]);
      if (matched && (matched.avatarImage || matched.profilePicture)) {
        return matched.avatarImage || matched.profilePicture;
      }
    } catch (e) {}
    return null;
  };

  const checkConnectionStatus = (member) => {
    const isSelf = user && (
      (user.email && member.email && user.email.toLowerCase().trim() === member.email.toLowerCase().trim()) ||
      (user.name && member.name && user.name.toLowerCase().trim() === member.name.toLowerCase().trim())
    );
    if (isSelf) return 'self';

    // 1. Check ph_connections for bidirectional connection
    try {
      const connMap = JSON.parse(localStorage.getItem('ph_connections') || '{}');
      const myKeys = [
        (user?.email || '').toLowerCase().trim(),
        (user?.name || '').toLowerCase().trim()
      ].filter(Boolean);

      const theirKeys = [
        (member.email || '').toLowerCase().trim(),
        (member.name || '').toLowerCase().trim(),
        String(member.id || '').toLowerCase().trim()
      ].filter(Boolean);

      for (const myKey of myKeys) {
        const list = connMap[myKey] || [];
        for (const theirKey of theirKeys) {
          if (list.includes(theirKey)) return 'connected';
        }
      }
    } catch (e) {}

    // Fallback check
    if (connectedMap[member.id] || member.connected) {
      return 'connected';
    }

    // 2. Check pending outgoing request
    const myEmail = (user?.email || '').toLowerCase().trim();
    const myName = (user?.name || '').toLowerCase().trim();
    const theirEmail = (member.email || '').toLowerCase().trim();
    const theirName = (member.name || '').toLowerCase().trim();

    const notifList = allNotifications || [];
    const isPending = notifList.some(n => {
      if (n.action !== 'connect' || n.status === 'accepted') return false;
      const fEmail = (n.fromEmail || '').toLowerCase().trim();
      const fName = (n.fromName || '').toLowerCase().trim();
      const tEmail = (n.toEmail || '').toLowerCase().trim();
      const tName = (n.toName || '').toLowerCase().trim();

      const sentByMe = (myEmail && fEmail === myEmail) || (myName && fName === myName);
      const toThem = (theirEmail && tEmail === theirEmail) || (theirName && tName === theirName);
      return sentByMe && toThem;
    });

    if (isPending) return 'pending';

    return 'none';
  };

  const handleConnect = (member) => {
    if (!user) {
      showToast('Please log in to connect with members.');
      return;
    }

    const status = checkConnectionStatus(member);
    if (status === 'self') {
      showToast('This is your own profile! Click your avatar in the navbar to customize.');
      return;
    }

    if (status === 'connected') {
      // Disconnect
      try {
        const connMap = JSON.parse(localStorage.getItem('ph_connections') || '{}');
        const myKey = (user.email || user.name || '').toLowerCase().trim();
        const theirKey = (member.email || member.name || '').toLowerCase().trim();
        if (myKey && connMap[myKey]) {
          connMap[myKey] = connMap[myKey].filter(k => k !== theirKey);
        }
        if (theirKey && connMap[theirKey]) {
          connMap[theirKey] = connMap[theirKey].filter(k => k !== myKey);
        }
        localStorage.setItem('ph_connections', JSON.stringify(connMap));
      } catch (e) {}

      setConnectedMap(prev => {
        const updated = { ...prev, [member.id]: false };
        try { localStorage.setItem('ph_connected_members', JSON.stringify(updated)); } catch (e) {}
        return updated;
      });

      showToast(`Disconnected from ${member.name}.`);
      window.dispatchEvent(new Event('ph_connections_updated'));
      return;
    }

    if (status === 'pending') {
      showToast(`Connection request already sent to ${member.name}. Waiting for approval! ⏳`);
      return;
    }

    // Send targeted connection request
    const targetEmail = member.email || (member.name === 'Shridhara Panda' ? 'shridhara.panda@gmail.com' : (member.name.toLowerCase().replace(/\s+/g, '.') + '@vssut.ac.in'));

    addNotification({
      icon: 'fa-user-plus',
      title: 'New Connection Request',
      description: `${user.name || 'A student'} wants to connect with you.`,
      action: 'connect',
      status: 'pending',
      fromName: user.name || 'Student Builder',
      fromEmail: user.email || '',
      toName: member.name,
      toEmail: targetEmail
    });

    showToast(`Connection request sent to ${member.name}! ⏳`);
    window.dispatchEvent(new Event('ph_connections_updated'));
  };

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    const created = {
      id: 'm-' + Date.now(),
      name: newMember.name.trim(),
      role: newMember.role,
      college: newMember.college || 'VSSUT · Computer Science',
      avatar: newMember.name.slice(0, 2).toUpperCase(),
      category: newMember.role.includes('Frontend') ? 'Frontend' : newMember.role.includes('Backend') ? 'Backend' : 'AI / ML',
      skills: newMember.skills.split(',').map(s => s.trim()).filter(Boolean),
      projectsCount: 1,
      skillsCount: newMember.skills.split(',').length,
      available: true,
      mentor: false
    };

    setMembers(prev => [created, ...prev]);
    setIsModalOpen(false);
    setNewMember({ name: '', role: 'Frontend Developer', skills: '', college: 'VSSUT' });
    showToast(`Profile preview for ${created.name} created!`);
  };

  // Roles list
  const roles = ['All', 'Frontend', 'Backend', 'AI / ML', 'UI/UX', 'Cybersecurity'];

  // Filtering
  const filteredMembers = members.filter(m => {
    const roleMatches =
      selectedRole === 'All' ||
      (m.category && m.category.toLowerCase().includes(selectedRole.toLowerCase())) ||
      (m.role && m.role.toLowerCase().includes(selectedRole.toLowerCase()));

    const availMatches =
      availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && m.available) ||
      (availabilityFilter === 'mentor' && m.mentor);

    const query = search.toLowerCase().trim();
    const searchMatches =
      !query ||
      m.name.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query) ||
      m.college.toLowerCase().includes(query) ||
      (m.skills && m.skills.some(s => s.toLowerCase().includes(query)));

    return roleMatches && availMatches && searchMatches;
  });

  return (
    <main className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast active" style={{ display: 'block', position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, background: 'var(--primary, #4f46e5)', color: '#fff', padding: '12px 20px', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          {toastMessage}
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Your people are out there</div>
          <h1>
            Meet your next <span>teammate.</span>
          </h1>
          <p>
            Find curious developers, designers, researchers, and makers.
            Connect around skills and interests—not just your branch or college.
          </p>

          <div className="hero-actions">
            <button
              className="primary-btn"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              ＋ Create your profile
            </button>
            <Link className="secondary-btn" to="/projects">
              Explore projects ↗
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <strong>640+</strong>
            <span>Members</span>
          </div>
          <div className="hero-stat">
            <strong>24</strong>
            <span>Universities</span>
          </div>
          <div className="hero-stat">
            <strong>18</strong>
            <span>Skill areas</span>
          </div>
        </div>
      </section>

      {/* TOOLBAR */}
      <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0 20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Discover members</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Search by name, role, university, or skill.
          </p>
        </div>

        <div className="controls" style={{ display: 'flex', gap: '10px' }}>
          <input
            id="searchInput"
            className="search-box"
            type="search"
            placeholder="Search people or skills…"
            aria-label="Search members"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            id="sortSelect"
            className="select-box"
            aria-label="Filter members"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="all">All availability</option>
            <option value="available">Open to collaborate</option>
            <option value="mentor">Mentors</option>
          </select>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filters">
        {roles.map(r => (
          <button
            key={r}
            className={`filter ${selectedRole === r ? 'active' : ''}`}
            onClick={() => setSelectedRole(r)}
          >
            {r === 'All' ? 'Everyone' : r}
          </button>
        ))}
      </div>

      {/* MEMBERS GRID */}
      <section className="member-grid" id="memberGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '25px' }}>
        {loading ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Loading members...
          </p>
        ) : filteredMembers.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px 20px' }}>
            <strong>No members found</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Try another skill or availability filter.
            </p>
          </div>
        ) : (
          filteredMembers.map(member => {
            const status = checkConnectionStatus(member);
            const avatarImg = resolveMemberAvatar(member);

            return (
              <article key={member.id} className="card member-card">
                <div
                  className="member-avatar"
                  style={{
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: member.mentor
                      ? 'linear-gradient(135deg, #fb923c, #f43f5e)'
                      : member.category === 'UI/UX'
                      ? 'linear-gradient(135deg, #f472b6, #8b5cf6)'
                      : member.category === 'AI / ML'
                      ? 'linear-gradient(135deg, #34d399, #0891b2)'
                      : 'linear-gradient(135deg, #6366f1, #3b82f6)'
                  }}
                >
                  {avatarImg ? (
                    <img
                      src={avatarImg}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    member.avatar || member.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <h3>{member.name}</h3>
                <div className="member-role">{member.role}</div>
                <div className="member-college">{member.college}</div>

                <div className="member-skills">
                  {(member.skills || []).map((sk, idx) => (
                    <span key={idx} className="tag">{sk}</span>
                  ))}
                </div>

                <div className="member-stats">
                  <div>
                    <strong>{member.projectsCount || 4}</strong>
                    <span>Projects</span>
                  </div>
                  <div>
                    <strong>{member.skills?.length || 6}</strong>
                    <span>Skills</span>
                  </div>
                  <div>
                    <strong>{member.mentor ? 'Mentor' : member.available ? 'Open' : 'Busy'}</strong>
                    <span>{member.mentor ? 'Status' : 'Availability'}</span>
                  </div>
                </div>

                <button
                  className={`secondary-btn full-btn connect-btn ${status === 'connected' ? 'active' : ''}`}
                  style={
                    status === 'self'
                      ? { opacity: 0.7, cursor: 'default' }
                      : status === 'connected'
                      ? { background: '#10b981', color: '#fff', borderColor: '#10b981' }
                      : status === 'pending'
                      ? { background: '#f59e0b', color: '#fff', borderColor: '#f59e0b' }
                      : {}
                  }
                  onClick={() => handleConnect(member)}
                >
                  {status === 'self'
                    ? 'You (Profile)'
                    : status === 'connected'
                    ? `Connected with ${member.name.split(' ')[0]} ✓`
                    : status === 'pending'
                    ? 'Request Pending ⏳'
                    : `Connect with ${member.name.split(' ')[0]}`}
                </button>
              </article>
            );
          })
        )}
      </section>

      {/* SIDE NOTE */}
      <section className="side-note" style={{ margin: '40px 0', padding: '30px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3>Good teams are built from different strengths.</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Show your skills, interests, and availability so collaborators know where you fit.
          </p>
        </div>
        <button
          className="primary-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Build your profile
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
        Made for curious builders · <span>ProjectHub</span> · Student collaboration platform
      </footer>

      {/* CREATE PROFILE MODAL */}
      {isModalOpen && (
        <div
          className="modal-backdrop show active"
          role="dialog"
          aria-modal="true"
          style={{ display: 'flex' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <form className="modal" onSubmit={handleCreateProfile}>
            <button
              type="button"
              className="close-modal"
              aria-label="Close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            <div className="eyebrow">Make your skills discoverable</div>
            <h2>Create your member profile</h2>
            <p>
              Set up your profile to let teammates find you based on your strengths.
            </p>

            <label htmlFor="memberName">Your name</label>
            <input
              id="memberName"
              required
              placeholder="Full name"
              value={newMember.name}
              onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
            />

            <label htmlFor="memberRole">Your role</label>
            <select
              id="memberRole"
              value={newMember.role}
              onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
            >
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full-Stack Developer</option>
              <option>AI / ML Learner</option>
              <option>UI/UX Designer</option>
              <option>Cybersecurity Enthusiast</option>
            </select>

            <label htmlFor="memberSkills">Top skills (comma separated)</label>
            <input
              id="memberSkills"
              required
              placeholder="React, C++, UI design"
              value={newMember.skills}
              onChange={(e) => setNewMember(prev => ({ ...prev, skills: e.target.value }))}
            />

            <button className="primary-btn" type="submit" style={{ marginTop: '20px' }}>
              Save Profile
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
