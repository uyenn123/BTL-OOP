import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';

const groupData: Record<string, { name: string; color: string; desc: string; members: { id: number; name: string; role: string; initials: string; tasks: number; status: string }[]; projects: { name: string; tasks: number; done: number; color: string }[] }> = {
  '1': {
    name: 'Engineering',
    color: '#6366F1',
    desc: 'Backend, frontend, and DevOps engineers building the core product.',
    members: [
      { id: 1, name: 'Nguyen Minh Khoa', role: 'Team Lead', initials: 'NK', tasks: 12, status: 'online' },
      { id: 2, name: 'Linh Tran', role: 'Backend Dev', initials: 'LT', tasks: 8, status: 'online' },
      { id: 3, name: 'Hung Nguyen', role: 'Frontend Dev', initials: 'HN', tasks: 6, status: 'offline' },
      { id: 4, name: 'Phuong Quynh', role: 'DevOps', initials: 'PQ', tasks: 5, status: 'away' },
    ],
    projects: [
      { name: 'Backend API v2', tasks: 31, done: 20, color: '#6366F1' },
      { name: 'Q4 Product Launch', tasks: 24, done: 18, color: '#A78BFA' },
      { name: 'Microservices Refactor', tasks: 15, done: 6, color: '#34D399' },
    ],
  },
};

const statusDot: Record<string, string> = { online: '#34D399', away: '#FBBF24', offline: '#8B92B3' };

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'members' | 'projects'>('members');
  const g = groupData[id ?? '1'] ?? groupData['1'];

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span onClick={() => navigate('/groups')} style={{ fontSize: 13, color: '#8B92B3', cursor: 'pointer' }}>Groups</span>
        <span style={{ color: '#8B92B3' }}>/</span>
        <span style={{ fontSize: 13, color: '#F0F2FF', fontWeight: 500 }}>{g.name}</span>
      </div>

      {/* Header */}
      <div style={{ background: '#13162A', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', padding: '28px 32px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: g.color }} />
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle,${g.color}10 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: `${g.color}20`, border: `1px solid ${g.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={g.color} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div>
            <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 22, color: '#F0F2FF', margin: '0 0 4px' }}>{g.name}</h1>
            <p style={{ color: '#8B92B3', fontSize: 13, margin: 0 }}>{g.desc}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Members', g.members.length], ['Projects', g.projects.length], ['Active Tasks', g.members.reduce((s, m) => s + m.tasks, 0)]].map(([l, v]) => (
            <div key={l as string}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 20, color: '#F0F2FF' }}>{v}</div>
              <div style={{ fontSize: 12, color: '#8B92B3' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#13162A', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid rgba(255,255,255,0.05)' }}>
        {(['members', 'projects'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500, fontSize: 13, textTransform: 'capitalize', transition: 'all 150ms',
              background: tab === t ? '#6366F1' : 'transparent', color: tab === t ? '#fff' : '#8B92B3' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'members' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {g.members.map(m => (
            <div key={m.id} style={{ background: '#13162A', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${g.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: g.color }}>
                  {m.initials}
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: '50%', background: statusDot[m.status], border: '2px solid #13162A' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#F0F2FF', fontFamily: 'Plus Jakarta Sans', marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: '#8B92B3' }}>{m.role}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: g.color, fontFamily: 'Plus Jakarta Sans' }}>{m.tasks}</div>
                <div style={{ fontSize: 11, color: '#8B92B3' }}>tasks</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {g.projects.map(p => (
            <div key={p.name}
              onClick={() => navigate('/projects')}
              style={{ background: '#13162A', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#F0F2FF', fontFamily: 'Plus Jakarta Sans', marginBottom: 8 }}>{p.name}</div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${Math.round(p.done/p.tasks*100)}%`, background: p.color, borderRadius: 99 }} />
                </div>
              </div>
              <span style={{ fontSize: 12, color: '#8B92B3', fontFamily: 'JetBrains Mono', flexShrink: 0 }}>{p.done}/{p.tasks}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
