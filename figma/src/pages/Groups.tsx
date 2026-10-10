import { useState } from 'react';
import { useNavigate } from 'react-router';

const groups = [
  { id: 1, name: 'Engineering', desc: 'Backend, frontend, and DevOps engineers', members: 12, projects: 5, color: '#6366F1', avatars: ['NK','LT','HN','PQ'] },
  { id: 2, name: 'Design', desc: 'UI/UX designers and product designers', members: 6, projects: 3, color: '#A78BFA', avatars: ['MT','DL','VA'] },
  { id: 3, name: 'Product', desc: 'Product managers and business analysts', members: 4, projects: 4, color: '#34D399', avatars: ['TH','BN'] },
  { id: 4, name: 'QA & Testing', desc: 'Quality assurance and test engineers', members: 5, projects: 2, color: '#FBBF24', avatars: ['HG','QA','TT'] },
  { id: 5, name: 'Data & Analytics', desc: 'Data scientists and ML engineers', members: 3, projects: 2, color: '#F87171', avatars: ['DA','ML'] },
  { id: 6, name: 'DevOps', desc: 'Infrastructure, CI/CD, and cloud ops', members: 4, projects: 3, color: '#38BDF8', avatars: ['DO','IV'] },
];

export default function Groups() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 24, color: '#F0F2FF', letterSpacing: '-0.3px', margin: '0 0 4px' }}>Groups</h1>
          <p style={{ color: '#8B92B3', fontSize: 14, margin: 0 }}>{groups.length} teams in your workspace</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#13162A', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '9px 14px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B92B3" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search groups…" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#F0F2FF', fontSize: 13, fontFamily: 'Inter', width: 160 }} />
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ padding: '9px 18px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, boxShadow: '0 4px 14px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Group
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {filtered.map(g => (
          <div key={g.id}
            onClick={() => navigate(`/groups/${g.id}`)}
            style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '24px', cursor: 'pointer', transition: 'all 200ms', position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${g.color}40`; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3)`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.06)'; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
          >
            {/* Color accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: g.color }} />
            {/* Glow */}
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle,${g.color}18 0%,transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${g.color}20`, border: `1px solid ${g.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={g.color} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B92B3" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </div>

            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 16, color: '#F0F2FF', margin: '0 0 6px' }}>{g.name}</h3>
            <p style={{ fontSize: 12, color: '#8B92B3', margin: '0 0 18px', lineHeight: 1.5 }}>{g.desc}</p>

            {/* Avatars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ display: 'flex' }}>
                {g.avatars.slice(0, 4).map((av, i) => (
                  <div key={av} style={{ width: 26, height: 26, borderRadius: '50%', background: `${g.color}30`, border: `2px solid #13162A`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: g.color, marginLeft: i > 0 ? -8 : 0 }}>{av}</div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: '#8B92B3' }}>{g.members} members</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 12, color: '#8B92B3' }}><span style={{ color: g.color, fontWeight: 600 }}>{g.projects}</span> projects</span>
              <span style={{ fontSize: 12, color: '#6366F1', fontWeight: 500 }}>View →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: '#1C2040', borderRadius: 16, border: '1px solid rgba(99,102,241,0.2)', padding: 28, width: 420, boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 18, color: '#F0F2FF', marginBottom: 20 }}>Create Group</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Group name', 'e.g. Engineering'], ['Description', 'What does this team work on?']].map(([label, ph]) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>{label}</label>
                  <input placeholder={ph} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#13162A', border: '1px solid rgba(99,102,241,0.25)', color: '#F0F2FF', fontSize: 13, fontFamily: 'Inter', outline: 'none' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#8B92B3', cursor: 'pointer', fontSize: 14, fontFamily: 'Inter' }}>Cancel</button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>Create Group</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
