import React, { useEffect } from 'react';
import { featuredColleges } from '../data/collegesData';

export default function VSSUTCampusModal({ isOpen, onClose, onExploreProjects, college }) {
  const activeCollege = college || featuredColleges[0];
  const { modalData, stats } = activeCollege;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop show active"
      role="dialog"
      aria-modal="true"
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
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          width: 'min(680px, 100%)',
          padding: '28px'
        }}
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

        {/* Header */}
        <div className="eyebrow" style={{ color: 'var(--primary, #6366f1)', fontWeight: 700, fontSize: '11px', letterSpacing: '1px' }}>
          {modalData?.eyebrow || 'CAMPUS SPOTLIGHT'}
        </div>
        <h2 style={{ margin: '4px 0 6px', fontSize: '22px', fontWeight: 800 }}>
          {activeCollege.fullName} ({activeCollege.name})
        </h2>
        <p style={{ color: 'var(--muted, #64748b)', fontSize: '13px', margin: '0 0 16px' }}>
          {activeCollege.location} · {activeCollege.estd}
        </p>

        {/* Campus Hero Image Banner */}
        <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', maxHeight: '240px', marginBottom: '20px' }}>
          <img
            src={activeCollege.campusImage}
            alt={`${activeCollege.name} Main Campus`}
            onError={(e) => {
              e.currentTarget.src = activeCollege.fallbackImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80";
            }}
            style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.25) 60%, transparent 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '16px 20px'
            }}
          >
            <div>
              <span style={{ background: '#10b981', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '5px', textTransform: 'uppercase' }}>
                Flagship Campus
              </span>
              <h3 style={{ color: '#fff', fontSize: '17px', margin: '6px 0 2px', fontWeight: 700 }}>
                {activeCollege.fullName}
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0 }}>
                {modalData?.heroSubtitle || `${activeCollege.name} premier technical ecosystem.`}
              </p>
            </div>
          </div>
        </div>

        {/* Key Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          <div style={{ background: 'var(--surface-subtle, rgba(99, 102, 241, 0.05))', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <strong style={{ fontSize: '18px', color: 'var(--primary, #6366f1)', display: 'block' }}>
              {stats?.stat3?.value || 'Estd'}
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {stats?.stat3?.label || 'Legacy'}
            </span>
          </div>
          <div style={{ background: 'var(--surface-subtle, rgba(99, 102, 241, 0.05))', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <strong style={{ fontSize: '18px', color: '#10b981', display: 'block' }}>
              {stats?.stat1?.value || '1st'}
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {stats?.stat1?.label || 'Top Achievement'}
            </span>
          </div>
          <div style={{ background: 'var(--surface-subtle, rgba(99, 102, 241, 0.05))', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <strong style={{ fontSize: '18px', color: '#f59e0b', display: 'block' }}>
              {stats?.stat2?.value || '🏆 Awards'}
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {stats?.stat2?.label || 'National Honors'}
            </span>
          </div>
          <div style={{ background: 'var(--surface-subtle, rgba(99, 102, 241, 0.05))', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <strong style={{ fontSize: '18px', color: '#ec4899', display: 'block' }}>
              {stats?.stat4?.value || 'Patents'}
            </strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {stats?.stat4?.label || 'Innovations'}
            </span>
          </div>
        </div>

        {/* Major Achievements Showcase */}
        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🏆</span> Major Campus Achievements & Innovation Milestones
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
          {(modalData?.achievements || []).map((ach, idx) => (
            <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--surface-subtle, #f8fafc)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '4px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{ach.title}</strong>
                <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary, #6366f1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  {ach.badge}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                {ach.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Student Clubs Row */}
        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>⚡</span> Active Student Innovation Chapters
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {(modalData?.clubs || []).map((club, idx) => (
            <span key={idx} style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600 }}>
              {club}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="primary-btn"
            style={{ flex: 1, padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={() => {
              onClose();
              if (onExploreProjects) onExploreProjects(activeCollege.filterQuery);
            }}
          >
            <span>🎓</span> Explore {activeCollege.name} Projects
          </button>
          <button
            type="button"
            className="secondary-btn"
            style={{ padding: '11px 20px' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
