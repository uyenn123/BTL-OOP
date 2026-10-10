import { useState } from 'react';
import { useNavigate } from 'react-router';

const stats = [
  { label: 'Active Projects', value: 12, delta: '+2', color: '#6366F1', icon: '◈' },
  { label: 'Tasks Due Today', value: 8, delta: '-3', color: '#FBBF24', icon: '◷' },
  { label: 'Completed This Week', value: 34, delta: '+12', color: '#34D399', icon: '✓' },
  { label: 'Team Members', value: 27, delta: '+1', color: '#A78BFA', icon: '◉' },
];

const recentTasks = [
  { id: 1, title: 'Design login flow mockup', project: 'Q4 Launch', assignee: 'NK', priority: 'High', status: 'In Progress', due: 'Sep 16' },
  { id: 2, title: 'Implement JWT refresh token', project: 'Backend API', assignee: 'LT', priority: 'Critical', status: 'Review', due: 'Sep 15' },
  { id: 3, title: 'Write unit tests for TaskService', project: 'Backend API', assignee: 'HN', priority: 'Medium', status: 'Todo', due: 'Sep 18' },
  { id: 4, title: 'Create ERD documentation', project: 'Docs', assignee: 'NK', priority: 'Low', status: 'Done', due: 'Sep 14' },
  { id: 5, title: 'Set up CI/CD pipeline', project: 'DevOps', assignee: 'PQ', priority: 'High', status: 'In Progress', due: 'Sep 17' },
];

const activities = [
  { avatar: 'LT', name: 'Linh Tran', action: 'completed', target: 'API Integration setup', time: '5m ago', color: '#34D399' },
  { avatar: 'NK', name: 'Nguyen Khoa', action: 'commented on', target: 'Task: JWT tokens', time: '18m ago', color: '#6366F1' },
  { avatar: 'HN', name: 'Hung Nguyen', action: 'moved', target: '"Unit tests" to Review', time: '1h ago', color: '#FBBF24' },
  { avatar: 'PQ', name: 'Phuong Quynh', action: 'created project', target: 'DevOps Automation', time: '2h ago', color: '#A78BFA' },
];

const priorityColor: Record<string, string> = { Critical: '#F87171', High: '#FBBF24', Medium: '#6366F1', Low: '#8B92B3' };
const statusColor: Record<string, { bg: string; text: string }> = {
  'In Progress': { bg: 'rgba(99,102,241,0.15)', text: '#818CF8' },
  'Review': { bg: 'rgba(251,191,36,0.15)', text: '#FBBF24' },
  'Done': { bg: 'rgba(52,211,153,0.15)', text: '#34D399' },
  'Todo': { bg: 'rgba(255,255,255,0.06)', text: '#8B92B3' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'mine'>('all');

  const filtered = tab === 'mine' ? recentTasks.filter(t => t.assignee === 'NK') : recentTasks;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#8B92B3', fontSize: 13, marginBottom: 4 }}>Monday, September 15</p>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 26, color: '#F0F2FF', letterSpacing: '-0.5px', margin: 0 }}>
            Good morning, Khoa 👋
          </h1>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          style={{
            padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)',
            color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14,
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Task
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, width: 70, height: 70, borderRadius: '50%', background: `radial-gradient(circle,${s.color}22 0%,transparent 70%)` }} />
            <div style={{ fontSize: 22, marginBottom: 8, color: s.color }}>{s.icon}</div>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 28, color: '#F0F2FF', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#8B92B3', marginTop: 6 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: s.delta.startsWith('+') ? '#34D399' : '#F87171', marginTop: 4, fontFamily: 'JetBrains Mono', fontWeight: 500 }}>{s.delta} this week</div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Tasks table */}
        <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['all', 'mine'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500, fontSize: 13, transition: 'all 150ms',
                    background: tab === t ? 'rgba(99,102,241,0.18)' : 'transparent', color: tab === t ? '#818CF8' : '#8B92B3' }}>
                  {t === 'all' ? 'All Tasks' : 'Mine'}
                </button>
              ))}
            </div>
            <span onClick={() => navigate('/tasks')} style={{ fontSize: 12, color: '#6366F1', cursor: 'pointer' }}>View all →</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['Task', 'Project', 'Priority', 'Status', 'Due'].map(h => (
                  <th key={h} style={{ padding: '10px 22px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#8B92B3', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', cursor: 'pointer', transition: 'background 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '13px 22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="checkbox" defaultChecked={t.status === 'Done'} style={{ accentColor: '#6366F1', width: 14, height: 14 }} onClick={e => e.stopPropagation()} />
                      <span style={{ fontSize: 13, color: t.status === 'Done' ? '#8B92B3' : '#C7D0F8', textDecoration: t.status === 'Done' ? 'line-through' : 'none' }}>{t.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 22px' }}>
                    <span style={{ fontSize: 12, color: '#8B92B3' }}>{t.project}</span>
                  </td>
                  <td style={{ padding: '13px 22px' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: priorityColor[t.priority] }}>{t.priority}</span>
                  </td>
                  <td style={{ padding: '13px 22px' }}>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 500, background: statusColor[t.status].bg, color: statusColor[t.status].text }}>{t.status}</span>
                  </td>
                  <td style={{ padding: '13px 22px' }}>
                    <span style={{ fontSize: 12, color: '#8B92B3', fontFamily: 'JetBrains Mono' }}>{t.due}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity feed */}
        <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF' }}>Activity</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {activities.map((a, i) => (
              <div key={i} style={{ padding: '12px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${a.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: a.color, flexShrink: 0 }}>
                  {a.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#C7D0F8', lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600 }}>{a.name}</span>
                    {' '}<span style={{ color: '#8B92B3' }}>{a.action}</span>
                    {' '}<span style={{ color: '#A78BFA' }}>{a.target}</span>
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: 11, color: '#8B92B3', fontFamily: 'JetBrains Mono' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sprint progress mini */}
          <div style={{ margin: '8px 16px 16px', background: '#1C2040', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#C7D0F8' }}>Sprint 7</span>
              <span style={{ fontSize: 11, color: '#34D399', fontFamily: 'JetBrains Mono' }}>68%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99 }}>
              <div style={{ height: '100%', width: '68%', background: 'linear-gradient(90deg,#6366F1,#A78BFA)', borderRadius: 99 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              {[['21', 'Done'], ['5', 'Left'], ['3d', 'Remain']].map(([v, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F0F2FF', fontFamily: 'Plus Jakarta Sans' }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#8B92B3' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#8B92B3', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>Quick Access</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { title: 'Q4 Product Launch', group: 'Engineering', tasks: 24, done: 18, color: '#6366F1' },
            { title: 'Backend API v2', group: 'Engineering', tasks: 31, done: 20, color: '#A78BFA' },
            { title: 'Design System', group: 'Design', tasks: 15, done: 12, color: '#34D399' },
          ].map(p => (
            <div key={p.title}
              onClick={() => navigate('/projects')}
              style={{ background: '#13162A', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '18px 20px', cursor: 'pointer', transition: 'all 150ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, marginBottom: 10 }} />
              <div style={{ fontWeight: 600, fontSize: 14, color: '#F0F2FF', marginBottom: 4, fontFamily: 'Plus Jakarta Sans' }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#8B92B3', marginBottom: 12 }}>{p.group}</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${Math.round(p.done/p.tasks*100)}%`, background: p.color, borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 11, color: '#8B92B3' }}>{p.done}/{p.tasks} tasks complete</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
