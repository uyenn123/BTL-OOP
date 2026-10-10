import { useState } from 'react';

type Task = { id: number; title: string; project: string; assignee: string; priority: string; tags: string[]; color: string };

const initialColumns: Record<string, Task[]> = {
  Todo: [
    { id: 1, title: 'Write unit tests for TaskService', project: 'Backend API', assignee: 'HN', priority: 'Medium', tags: ['Testing', 'Java'], color: '#6366F1' },
    { id: 2, title: 'Create mobile navigation component', project: 'Mobile MVP', assignee: 'NK', priority: 'High', tags: ['React Native'], color: '#A78BFA' },
    { id: 3, title: 'Database schema migration', project: 'Backend API', assignee: 'LT', priority: 'Critical', tags: ['SQL', 'DB'], color: '#F87171' },
  ],
  'In Progress': [
    { id: 4, title: 'JWT refresh token endpoint', project: 'Backend API', assignee: 'LT', priority: 'Critical', tags: ['Auth', 'Java'], color: '#6366F1' },
    { id: 5, title: 'Set up CI/CD pipeline', project: 'DevOps', assignee: 'PQ', priority: 'High', tags: ['GitHub Actions'], color: '#38BDF8' },
    { id: 6, title: 'Dashboard analytics widgets', project: 'Frontend', assignee: 'NK', priority: 'Medium', tags: ['React', 'Charts'], color: '#34D399' },
  ],
  Review: [
    { id: 7, title: 'API Integration test suite', project: 'Backend API', assignee: 'HN', priority: 'High', tags: ['Testing'], color: '#FBBF24' },
    { id: 8, title: 'Figma design tokens export', project: 'Design System', assignee: 'MT', priority: 'Low', tags: ['Design'], color: '#A78BFA' },
  ],
  Done: [
    { id: 9, title: 'User authentication flow', project: 'Backend API', assignee: 'LT', priority: 'Critical', tags: ['Auth'], color: '#34D399' },
    { id: 10, title: 'ERD documentation', project: 'Docs', assignee: 'NK', priority: 'Low', tags: ['Docs'], color: '#8B92B3' },
    { id: 11, title: 'Project skeleton setup', project: 'Backend API', assignee: 'NK', priority: 'High', tags: ['Java', 'Spring'], color: '#6366F1' },
  ],
};

const colConfig: Record<string, { color: string; accent: string }> = {
  Todo: { color: '#8B92B3', accent: 'rgba(139,146,179,0.12)' },
  'In Progress': { color: '#818CF8', accent: 'rgba(99,102,241,0.12)' },
  Review: { color: '#FBBF24', accent: 'rgba(251,191,36,0.12)' },
  Done: { color: '#34D399', accent: 'rgba(52,211,153,0.12)' },
};

const priorityColors: Record<string, string> = { Critical: '#F87171', High: '#FBBF24', Medium: '#6366F1', Low: '#8B92B3' };

export default function Tasks() {
  const [columns, setColumns] = useState(initialColumns);
  const [dragging, setDragging] = useState<{ task: Task; from: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');

  const handleDragStart = (task: Task, col: string) => setDragging({ task, from: col });
  const handleDragEnd = () => { setDragging(null); setDragOver(null); };

  const handleDrop = (to: string) => {
    if (!dragging || dragging.from === to) { setDragging(null); setDragOver(null); return; }
    setColumns(prev => {
      const fromTasks = prev[dragging.from].filter(t => t.id !== dragging.task.id);
      const toTasks = [...prev[to], dragging.task];
      return { ...prev, [dragging.from]: fromTasks, [to]: toTasks };
    });
    setDragging(null); setDragOver(null);
  };

  const totalTasks = Object.values(columns).flat().length;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 24, color: '#F0F2FF', letterSpacing: '-0.3px', margin: '0 0 4px' }}>Kanban Board</h1>
            <p style={{ color: '#8B92B3', fontSize: 13, margin: 0 }}>{totalTasks} tasks · Sprint 7 · Sep 10 – Sep 24</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {/* Member filter */}
            {['All', 'NK', 'LT', 'HN', 'PQ'].map(m => (
              <button key={m} onClick={() => setFilter(m)}
                style={{ width: m === 'All' ? 'auto' : 34, height: 34, padding: m === 'All' ? '0 14px' : 0, borderRadius: '50%', border: `2px solid ${filter === m ? '#6366F1' : 'rgba(255,255,255,0.1)'}`, background: filter === m ? 'rgba(99,102,241,0.15)' : '#13162A', color: filter === m ? '#818CF8' : '#8B92B3', fontFamily: 'Inter', fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>
                {m}
              </button>
            ))}
            <button onClick={() => setShowModal(true)}
              style={{ padding: '9px 18px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Task
            </button>
          </div>
        </div>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20 }}>
          {Object.entries(columns).map(([col, tasks]) => (
            <div key={col} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: colConfig[col].color }} />
              <span style={{ fontSize: 12, color: '#8B92B3' }}>{col}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: colConfig[col].color, fontFamily: 'JetBrains Mono' }}>{tasks.length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ flex: 1, display: 'flex', gap: 16, padding: '20px 32px 24px', overflowX: 'auto', overflowY: 'hidden' }}>
        {Object.entries(columns).map(([col, tasks]) => {
          const cfg = colConfig[col];
          const displayed = filter === 'All' ? tasks : tasks.filter(t => t.assignee === filter);
          return (
            <div key={col}
              onDragOver={e => { e.preventDefault(); setDragOver(col); }}
              onDrop={() => handleDrop(col)}
              style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', background: dragOver === col ? 'rgba(99,102,241,0.05)' : 'transparent', borderRadius: 14, border: dragOver === col ? '1.5px dashed rgba(99,102,241,0.4)' : '1.5px solid transparent', transition: 'all 200ms' }}>
              {/* Column header */}
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.color }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: cfg.color, fontFamily: 'Plus Jakarta Sans' }}>{col}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, background: cfg.accent, padding: '1px 7px', borderRadius: 99, fontFamily: 'JetBrains Mono' }}>{displayed.length}</span>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B92B3', padding: 2 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>

              {/* Task cards */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {displayed.map(task => (
                  <div key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task, col)}
                    onDragEnd={handleDragEnd}
                    style={{
                      background: '#13162A', borderRadius: 12, border: `1px solid rgba(255,255,255,0.07)`,
                      padding: '14px 16px', cursor: 'grab', transition: 'all 150ms',
                      opacity: dragging?.task.id === task.id ? 0.4 : 1,
                      borderLeft: `3px solid ${task.color}`,
                      boxShadow: dragging?.task.id === task.id ? 'none' : '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                    onMouseEnter={e => { if (!dragging) { (e.currentTarget as HTMLElement).style.borderColor = `rgba(99,102,241,0.3)`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                    {/* Tags */}
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                      {task.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: `${task.color}18`, color: task.color, fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                    {/* Title */}
                    <p style={{ margin: '0 0 12px', fontSize: 13, color: col === 'Done' ? '#8B92B3' : '#C7D0F8', fontWeight: 500, lineHeight: 1.4, textDecoration: col === 'Done' ? 'line-through' : 'none' }}>{task.title}</p>
                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: priorityColors[task.priority], background: `${priorityColors[task.priority]}15`, padding: '2px 8px', borderRadius: 99 }}>{task.priority}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#8B92B3' }}>{task.project}</span>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${task.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: task.color }}>{task.assignee}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Drop zone */}
                {displayed.length === 0 && (
                  <div style={{ height: 80, borderRadius: 10, border: '1.5px dashed rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, color: '#8B92B3' }}>Drop tasks here</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}>
          <div style={{ background: '#1C2040', borderRadius: 16, border: '1px solid rgba(99,102,241,0.2)', padding: 28, width: 460, boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 18, color: '#F0F2FF', marginBottom: 22 }}>Create Task</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Title', 'e.g. Implement login endpoint'], ['Description', 'What needs to be done?']].map(([label, ph]) => (
                <div key={label}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>{label}</label>
                  <input placeholder={ph} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#13162A', border: '1px solid rgba(99,102,241,0.25)', color: '#F0F2FF', fontSize: 13, fontFamily: 'Inter', outline: 'none' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>Priority</label>
                  <select style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#13162A', border: '1px solid rgba(99,102,241,0.25)', color: '#F0F2FF', fontSize: 13, fontFamily: 'Inter', outline: 'none' }}>
                    {['Low','Medium','High','Critical'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>Assignee</label>
                  <select style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: '#13162A', border: '1px solid rgba(99,102,241,0.25)', color: '#F0F2FF', fontSize: 13, fontFamily: 'Inter', outline: 'none' }}>
                    {['NK - Khoa','LT - Linh','HN - Hung','PQ - Phuong'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#8B92B3', cursor: 'pointer', fontSize: 14, fontFamily: 'Inter' }}>Cancel</button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
