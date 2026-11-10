import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function HackathonsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [formatFilter, setFormatFilter] = useState('all');
  const [savedEvents, setSavedEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_saved_hackathons');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });
  const [toastMessage, setToastMessage] = useState('');

  // Add Event Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'AI / ML',
    format: 'online',
    date: '2026-11-20',
    description: '',
    teamSize: '2–4 people',
    prizePool: '₹50,000'
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getHackathons();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching hackathons:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleToggleSave = (eventId, eventTitle) => {
    const isSaved = Boolean(savedEvents[eventId]);
    const updated = {
      ...savedEvents,
      [eventId]: !isSaved
    };
    setSavedEvents(updated);
    try {
      localStorage.setItem('ph_saved_hackathons', JSON.stringify(updated));
    } catch (e) {}

    if (!isSaved) {
      showToast(`Saved "${eventTitle}" to your events!`);
    } else {
      showToast(`Removed "${eventTitle}" from saved.`);
    }
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const dateObj = new Date(newEvent.date || Date.now());
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = dateObj.toLocaleString('default', { month: 'short' });

    const created = {
      id: 'h-' + Date.now(),
      title: newEvent.title.trim(),
      category: newEvent.category,
      format: newEvent.format,
      day,
      month,
      description: newEvent.description || 'Join students and developers in building impactful projects.',
      deadline: 'Nov 18',
      teamSize: newEvent.teamSize,
      prizePool: newEvent.prizePool,
      tags: [newEvent.category, newEvent.format === 'online' ? 'Online' : 'In person']
    };

    setEvents(prev => [created, ...prev]);
    setIsModalOpen(false);
    setNewEvent({
      title: '',
      category: 'AI / ML',
      format: 'online',
      date: '2026-11-20',
      description: '',
      teamSize: '2–4 people',
      prizePool: '₹50,000'
    });
    showToast(`Hackathon "${created.title}" added!`);
  };

  const categories = ['All', 'AI / ML', 'Web / App', 'Social Impact', 'Open Innovation'];

  const filteredEvents = events.filter(e => {
    const categoryMatches =
      selectedCategory === 'All' ||
      (e.category && e.category.toLowerCase().includes(selectedCategory.toLowerCase()));

    const formatMatches =
      formatFilter === 'all' ||
      (e.format && e.format.toLowerCase() === formatFilter.toLowerCase());

    const query = search.toLowerCase().trim();
    const searchMatches =
      !query ||
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(query)));

    return categoryMatches && formatMatches && searchMatches;
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
          <div className="eyebrow">Build under pressure · Learn by doing</div>
          <h1>
            Find your next <span>big challenge.</span>
          </h1>
          <p>
            Explore hackathons, innovation challenges, and build sprints.
            Save events, check key dates, and find teammates before registration closes.
          </p>

          <div className="hero-actions">
            <button
              className="primary-btn"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              ＋ Add an event
            </button>
            <Link className="secondary-btn" to="/members">
              Find a team ↗
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <strong>32</strong>
            <span>Events listed</span>
          </div>
          <div className="hero-stat">
            <strong>11</strong>
            <span>Online options</span>
          </div>
          <div className="hero-stat">
            <strong>₹18L+</strong>
            <span>Prize pool listed</span>
          </div>
        </div>
      </section>

      {/* TOOLBAR */}
      <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 0 20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2>Upcoming opportunities</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Browse hackathons and developer competitions.
          </p>
        </div>

        <div className="controls" style={{ display: 'flex', gap: '10px' }}>
          <input
            id="searchInput"
            className="search-box"
            type="search"
            placeholder="Search events or themes…"
            aria-label="Search events"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            id="sortSelect"
            className="select-box"
            aria-label="Filter events"
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
          >
            <option value="all">All formats</option>
            <option value="online">Online</option>
            <option value="offline">In person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filters">
        {categories.map(c => (
          <button
            key={c}
            className={`filter ${selectedCategory === c ? 'active' : ''}`}
            onClick={() => setSelectedCategory(c)}
          >
            {c === 'All' ? 'All events' : c}
          </button>
        ))}
      </div>

      {/* EVENTS GRID */}
      <section className="event-grid" id="eventGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '25px' }}>
        {loading ? (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            Loading events...
          </p>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px 20px' }}>
            <strong>No matching events</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
              Try a different keyword, theme, or format.
            </p>
          </div>
        ) : (
          filteredEvents.map(evt => {
            const isSaved = savedEvents[evt.id];
            return (
              <article key={evt.id} className="card event-card">
                <div className="event-head">
                  <div>
                    <div className="event-type">{evt.category} · {evt.format}</div>
                    <h3>{evt.title}</h3>
                  </div>
                  <div className="event-date">
                    <strong>{evt.day}</strong>
                    <span>{evt.month}</span>
                  </div>
                </div>

                <p className="description" style={{ margin: '12px 0', fontSize: '13px', lineHeight: '1.5' }}>
                  {evt.description}
                </p>

                <div className="event-meta" style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span>◷ Registration closes · {evt.deadline}</span>
                  <span>⌘ Team size · {evt.teamSize}</span>
                  <span>✦ Prize pool · {evt.prizePool}</span>
                </div>

                <div className="tags" style={{ marginTop: '12px' }}>
                  {(evt.tags || []).map((t, idx) => (
                    <span key={idx} className="tag">{t}</span>
                  ))}
                </div>

                <div className="event-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                  <span className="tiny-meta" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Registration open
                  </span>
                  <button
                    className={`primary-btn save-event ${isSaved ? 'active' : ''}`}
                    style={isSaved ? { background: '#10b981', color: '#fff' } : {}}
                    onClick={() => handleToggleSave(evt.id, evt.title)}
                  >
                    {isSaved ? '★ Saved' : '☆ Save event'}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      {/* FOOTER CTA */}
      <section className="side-note" style={{ margin: '40px 0', padding: '30px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h3>Don't have a team yet?</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Browse members, share your skills, and find people who want to build the same kind of thing.
          </p>
        </div>
        <Link className="primary-btn" to="/members">
          Find teammates ↗
        </Link>
      </section>

      <footer className="footer" style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
        Made for curious builders · <span>ProjectHub</span> · Student collaboration platform
      </footer>

      {/* ADD EVENT MODAL */}
      {isModalOpen && (
        <div
          className="modal-backdrop active"
          role="dialog"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <form className="modal" onSubmit={handleAddEvent}>
            <button
              type="button"
              className="close-modal"
              aria-label="Close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            <div className="eyebrow">Share an opportunity</div>
            <h2>Add a hackathon</h2>
            <p>
              Add an event to the listings for students and makers to discover.
            </p>

            <label htmlFor="eventName">Event name</label>
            <input
              id="eventName"
              required
              placeholder="e.g. Google Solution Challenge"
              value={newEvent.title}
              onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
            />

            <label htmlFor="eventTheme">Theme</label>
            <select
              id="eventTheme"
              value={newEvent.category}
              onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
            >
              <option>AI / ML</option>
              <option>Web / App</option>
              <option>Social Impact</option>
              <option>Open Innovation</option>
            </select>

            <label htmlFor="eventFormat">Format</label>
            <select
              id="eventFormat"
              value={newEvent.format}
              onChange={(e) => setNewEvent(prev => ({ ...prev, format: e.target.value }))}
            >
              <option value="online">Online</option>
              <option value="offline">In person</option>
              <option value="hybrid">Hybrid</option>
            </select>

            <label htmlFor="eventDate">Event date</label>
            <input
              id="eventDate"
              type="date"
              required
              value={newEvent.date}
              onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
            />

            <label htmlFor="eventDesc">Description</label>
            <textarea
              id="eventDesc"
              placeholder="Brief description of the challenge..."
              value={newEvent.description}
              onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>

            <button className="primary-btn" type="submit" style={{ marginTop: '20px' }}>
              Add event preview
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
