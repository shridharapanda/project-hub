import React, { useEffect } from 'react';

export default function VSSUTCampusModal({ isOpen, onClose, onExploreProjects }) {
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
          CAMPUS SPOTLIGHT · ESTD. 1956
        </div>
        <h2 style={{ margin: '4px 0 6px', fontSize: '22px', fontWeight: 800 }}>
          Veer Surendra Sai University of Technology (VSSUT)
        </h2>
        <p style={{ color: 'var(--muted, #64748b)', fontSize: '13px', margin: '0 0 16px' }}>
          Burla, Sambalpur, Odisha · Formerly UCE Burla · Premier Innovation Hub
        </p>

        {/* Campus Hero Image Banner */}
        <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', maxHeight: '240px', marginBottom: '20px' }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/VSSUT_Burla_Main_Building.jpg/800px-VSSUT_Burla_Main_Building.jpg"
            alt="VSSUT Burla Main Building"
            onError={(e) => {
              // Fallback to high-res architecture if external CDN blocked
              e.currentTarget.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80";
            }}
            style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)',
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
                Iconic Main Heritage Building & Innovation Labs
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '12px', margin: 0 }}>
                Nestled at the foothills of Hirakud, inspiring 65+ years of engineering breakthroughs.
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
            <strong style={{ fontSize: '20px', color: 'var(--primary, #6366f1)', display: 'block' }}>1956</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Oldest Tech Univ in Odisha</span>
          </div>
          <div style={{ background: 'var(--surface-subtle, rgba(99, 102, 241, 0.05))', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <strong style={{ fontSize: '20px', color: '#10b981', display: 'block' }}>1st in India</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Student Sounding Rocket (VSLV)</span>
          </div>
          <div style={{ background: 'var(--surface-subtle, rgba(99, 102, 241, 0.05))', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <strong style={{ fontSize: '20px', color: '#f59e0b', display: 'block' }}>45+</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Registered Student Patents</span>
          </div>
          <div style={{ background: 'var(--surface-subtle, rgba(99, 102, 241, 0.05))', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
            <strong style={{ fontSize: '20px', color: '#ec4899', display: 'block' }}>35,000+</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Global Alumni Leaders</span>
          </div>
        </div>

        {/* Major Achievements Showcase */}
        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🏆</span> Major Campus Achievements & Innovation Milestones
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--surface-subtle, #f8fafc)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>🚀 VSLV (VSSUT Student Satellite Launch Vehicle)</strong>
              <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                ISRO Recognized · Limca Record
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              India's pioneer student rocketry mission. Designed and launched multiple indigenous solid-motor suborbital rockets carrying CanSat atmospheric and telemetry payloads.
            </p>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--surface-subtle, #f8fafc)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>🥇 Smart India Hackathon National Champions</strong>
              <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                1st Prize Winners
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              Multiple student teams won top honors in AI-driven crop disease diagnostics, drone surveillance, and smart hostel energy management systems.
            </p>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--surface-subtle, #f8fafc)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>💡 Idea & Innovation Cell (IIC VSSUT)</strong>
              <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                University Incubator
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              Dedicated state-of-the-art incubation hub providing prototyping hardware, 3D printing labs, and alumni seed grants to turn student concepts into registered intellectual property.
            </p>
          </div>
        </div>

        {/* Student Clubs Row */}
        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '16px 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>⚡</span> Active Student Innovation Clubs
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600 }}>
            🚀 VSLV Rocketry Club
          </span>
          <span style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600 }}>
            🤖 Robotics Society (Team Vibhav)
          </span>
          <span style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600 }}>
            💻 Enigma Coding & Web
          </span>
          <span style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600 }}>
            🏎️ SAE Collegiate Club (Formula Baja)
          </span>
          <span style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 600 }}>
            🎨 Pixel UI/UX Design Club
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="primary-btn"
            style={{ flex: 1, padding: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={() => {
              onClose();
              if (onExploreProjects) onExploreProjects();
            }}
          >
            <span>🎓</span> Explore VSSUT Student Projects
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
