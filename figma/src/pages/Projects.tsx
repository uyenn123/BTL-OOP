import { useState } from 'react';
import { useNavigate } from 'react-router';

const projects = [
  { id: 1, name: 'Q4 Product Launch', group: 'Engineering', status: 'Active', tasks: 24, done: 18, members: ['NK','LT','HN'], priority: 'High', deadline: 'Oct 30', color: '#6366F1' },
  { id: 2, name: 'Backend API v2', group: 'Engineering', status: 'Active', tasks: 31, done: 20, members: ['LT','PQ','HN'], priority: 'Critical', deadline: 'Sep 25', color: '#A78BFA' },
  { id: 3, name: 'Design System 2.0', group: 'Design', status: 'Review', tasks: 15, done: 12, members: ['MT','DL'], priority: 'Medium', deadline: 'Oct 5', color: '#34D399' },
  { id: 4, name: 'DevOps Automation', group: 'DevOps', status: 'Active', tasks: 18, done: 9, members: ['PQ','DO'], priority: 'High', deadline: 'Oct 15', color: '#38BDF8' },
  { id: 5, name: 'User Research Q4', group: 'Product', status: 'Planning', tasks: 10, done: 2, members: ['TH','BN'], priority: 'Medium', deadline: 'Nov 1', color: '#FBBF24' },
  { id: 6, name: 'Mobile App MVP', group: 'Engineering', status: 'Paused', tasks: 40, done: 25, members: ['NK','MT','LT'], priority: 'High', deadline: 'Dec 1', color: '#F87171' },
];

const statusStyle: Record<string, { bg: string; text: string }> = {
  Active: { bg: 'rgba(52,211,153,0.12)', text: '#34D399' },
  Review: { bg: 'rgba(251,191,36,0.12)', text: '#FBBF24' },
  Planning: { bg: 'rgba(99,102,241,0.12)', text: '#818CF8' },
  Paused: { bg: 'rgba(255,255,255,0.06)', text: '#8B92B3' },
};

export default function Projects() {
  const navigate = useNavigate();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filters = ['All', 'Active', 'Review', 'Planning', 'Paused'];
  const filtered = projects.filter(p => (filter === 'All' || p.status === filter) && p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 24, color: '#F0F2FF', letterSpacing: '-0.3px', margin: '0 0 4px' }}>Projects</h1>
          <p style={{ color: '#8B92B3', fontSize: 14, margin: 0 }}>{projects.length} projects across all groups</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', background: '#13162A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
            {(['grid', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: '7px 12px', border: 'none', cursor: 'pointer', background: view === v ? 'rgba(99,102,241,0.2)' : 'transparent', color: view === v ? '#818CF8' : '#8B92B3', transition: 'all 150ms' }}>
                {v === 'grid'
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                }
              </button>
            ))}
          </div>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#13162A', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '8px 14px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8B92B3" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#F0F2FF', fontSize: 13, fontFamily: 'Inter', width: 140 }} />
          </div>
          <button style={{ padding: '9px 18px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, boxShadow: '0 4px 14px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 14px', borderRadius: 99, border: '1px solid', cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'Inter', transition: 'all 150ms',
              borderColor: filter === f ? '#6366F1' : 'rgba(255,255,255,0.1)',
              background: filter === f ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: filter === f ? '#818CF8' : '#8B92B3' }}>
            {f}
          </button>
        ))}
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {filtered.map(p => (
            <div key={p.id}
              onClick={() => navigate(`/projects/${p.id}`)}
              style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '22px', cursor: 'pointer', transition: 'all 200ms', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${p.color}40`; el.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.06)'; el.style.transform = 'none'; }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: p.color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 500, background: statusStyle[p.status].bg, color: statusStyle[p.status].text }}>{p.status}</span>
                <span style={{ fontSize: 11, color: p.priority === 'Critical' ? '#F87171' : p.priority === 'High' ? '#FBBF24' : '#8B92B3', fontWeight: 600 }}>{p.priority}</span>
              </div>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15, color: '#F0F2FF', margin: '0 0 4px' }}>{p.name}</h3>
              <p style={{ fontSize: 12, color: '#8B92B3', margin: '0 0 16px' }}>{p.group}</p>
              {/* Progress */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: '#8B92B3' }}>Progress</span>
                  <span style={{ fontSize: 11, color: p.color, fontFamily: 'JetBrains Mono', fontWeight: 500 }}>{Math.round(p.done/p.tasks*100)}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${Math.round(p.done/p.tasks*100)}%`, background: p.color, borderRadius: 99 }} />
                </div>
              </div>
              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex' }}>
                  {p.members.slice(0,3).map((m, i) => (
                    <div key={m} style={{ width: 24, height: 24, borderRadius: '50%', background: `${p.color}30`, border: '2px solid #13162A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: p.color, marginLeft: i > 0 ? -7 : 0 }}>{m}</div>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: '#8B92B3', fontFamily: 'JetBrains Mono' }}>Due {p.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Project','Group','Status','Priority','Progress','Deadline','Team'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#8B92B3', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#F0F2FF' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}><span style={{ fontSize: 12, color: '#8B92B3' }}>{p.group}</span></td>
                  <td style={{ padding: '14px 20px' }}><span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 500, background: statusStyle[p.status].bg, color: statusStyle[p.status].text }}>{p.status}</span></td>
                  <td style={{ padding: '14px 20px' }}><span style={{ fontSize: 11, fontWeight: 600, color: p.priority === 'Critical' ? '#F87171' : p.priority === 'High' ? '#FBBF24' : '#8B92B3' }}>{p.priority}</span></td>
                  <td style={{ padding: '14px 20px', minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${Math.round(p.done/p.tasks*100)}%`, background: p.color, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#8B92B3', fontFamily: 'JetBrains Mono', minWidth: 28 }}>{Math.round(p.done/p.tasks*100)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}><span style={{ fontSize: 12, color: '#8B92B3', fontFamily: 'JetBrains Mono' }}>{p.deadline}</span></td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex' }}>
                      {p.members.slice(0,3).map((m, i) => (
                        <div key={m} style={{ width: 22, height: 22, borderRadius: '50%', background: `${p.color}30`, border: '2px solid #13162A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: p.color, marginLeft: i > 0 ? -6 : 0 }}>{m}</div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
