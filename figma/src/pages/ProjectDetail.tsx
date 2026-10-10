import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';

const tabs = ['Overview', 'Tasks', 'Members', 'Settings'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [comment, setComment] = useState('');

  const project = {
    name: 'Backend API v2',
    group: 'Engineering',
    color: '#A78BFA',
    status: 'Active',
    deadline: 'Sep 25, 2026',
    desc: 'Complete rewrite of the backend REST API with Spring Boot 3, implementing JWT authentication, role-based access, and comprehensive OpenAPI documentation.',
    tasks: 31, done: 20,
    members: [
      { name: 'Linh Tran', role: 'Lead', initials: 'LT', color: '#6366F1' },
      { name: 'Phuong Quynh', role: 'DevOps', initials: 'PQ', color: '#A78BFA' },
      { name: 'Hung Nguyen', role: 'Frontend', initials: 'HN', color: '#34D399' },
    ],
    milestones: [
      { name: 'Auth module', done: true },
      { name: 'User CRUD API', done: true },
      { name: 'Task API endpoints', done: false },
      { name: 'WebSocket integration', done: false },
    ],
    comments: [
      { author: 'LT', name: 'Linh Tran', text: 'JWT refresh token endpoint is now complete. Moving to role-based access next.', time: '2h ago' },
      { author: 'NK', name: 'Nguyen Khoa', text: 'Great progress! Make sure we have proper error codes for all endpoints per the API docs.', time: '1h ago' },
    ],
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span onClick={() => navigate('/projects')} style={{ fontSize: 13, color: '#8B92B3', cursor: 'pointer' }}>Projects</span>
        <span style={{ color: '#8B92B3' }}>/</span>
        <span style={{ fontSize: 13, color: '#F0F2FF', fontWeight: 500 }}>{project.name}</span>
      </div>

      {/* Header card */}
      <div style={{ background: '#13162A', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', padding: '28px 32px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: project.color }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 22, color: '#F0F2FF', margin: 0 }}>{project.name}</h1>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 500, background: 'rgba(52,211,153,0.12)', color: '#34D399' }}>{project.status}</span>
            </div>
            <p style={{ color: '#8B92B3', fontSize: 13, margin: '0 0 20px', maxWidth: 600, lineHeight: 1.6 }}>{project.desc}</p>
            <div style={{ display: 'flex', gap: 28 }}>
              {[['Group', project.group], ['Deadline', project.deadline], ['Tasks', `${project.done}/${project.tasks}`]].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 11, color: '#8B92B3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#F0F2FF' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
            <button onClick={() => navigate('/tasks')}
              style={{ padding: '9px 18px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13 }}>
              + Add Task
            </button>
            <div style={{ display: 'flex' }}>
              {project.members.map((m, i) => (
                <div key={m.initials} title={m.name} style={{ width: 34, height: 34, borderRadius: '50%', background: `${m.color}30`, border: `2px solid #13162A`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: m.color, marginLeft: i > 0 ? -10 : 0 }}>{m.initials}</div>
              ))}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#8B92B3' }}>Overall progress</span>
            <span style={{ fontSize: 12, color: project.color, fontFamily: 'JetBrains Mono' }}>{Math.round(project.done/project.tasks*100)}%</span>
          </div>
          <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
            <div style={{ height: '100%', width: `${Math.round(project.done/project.tasks*100)}%`, background: `linear-gradient(90deg,${project.color},#6366F1)`, borderRadius: 99 }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '10px 20px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500, fontSize: 13, transition: 'all 150ms',
              color: tab === t ? '#818CF8' : '#8B92B3',
              borderBottom: tab === t ? '2px solid #6366F1' : '2px solid transparent', marginBottom: -1 }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Milestones */}
          <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF' }}>Milestones</span>
            </div>
            <div style={{ padding: '8px 0' }}>
              {project.milestones.map(m => (
                <div key={m.name} style={{ padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${m.done ? '#34D399' : 'rgba(255,255,255,0.15)'}`, background: m.done ? 'rgba(52,211,153,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {m.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: m.done ? '#8B92B3' : '#C7D0F8', textDecoration: m.done ? 'line-through' : 'none' }}>{m.name}</span>
                  {m.done && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#34D399' }}>Done</span>}
                </div>
              ))}
            </div>

            {/* Comments */}
            <div style={{ padding: '18px 22px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF', display: 'block', marginBottom: 14 }}>Comments</span>
              {project.comments.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#818CF8', flexShrink: 0 }}>{c.author}</div>
                  <div style={{ flex: 1, background: '#1C2040', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#C7D0F8' }}>{c.name}</span>
                      <span style={{ fontSize: 11, color: '#8B92B3', fontFamily: 'JetBrains Mono' }}>{c.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#8B92B3', lineHeight: 1.5 }}>{c.text}</p>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#818CF8', flexShrink: 0 }}>NK</div>
                <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment…"
                  style={{ flex: 1, background: '#1C2040', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '9px 14px', color: '#F0F2FF', fontSize: 13, fontFamily: 'Inter', outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Sidebar info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Task breakdown */}
            <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF', marginBottom: 16 }}>Task Breakdown</div>
              {[['Done', project.done, '#34D399'], ['In Progress', 6, '#6366F1'], ['Review', 2, '#FBBF24'], ['Todo', project.tasks - project.done - 6 - 2, '#8B92B3']].map(([l, v, c]) => (
                <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c as string }} />
                    <span style={{ fontSize: 13, color: '#8B92B3' }}>{l}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: c as string, fontFamily: 'JetBrains Mono' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Team */}
            <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '18px 20px' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF', marginBottom: 14 }}>Team</div>
              {project.members.map(m => (
                <div key={m.initials} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${m.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: m.color }}>{m.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#C7D0F8' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#8B92B3' }}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Tasks' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <button onClick={() => navigate('/tasks')} style={{ padding: '12px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
            Open Kanban Board →
          </button>
        </div>
      )}
    </div>
  );
}
