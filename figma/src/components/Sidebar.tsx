import { NavLink, useNavigate } from 'react-router';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: DashIcon, label: 'Dashboard' },
  { to: '/groups', icon: GroupIcon, label: 'Groups' },
  { to: '/projects', icon: ProjectIcon, label: 'Projects' },
  { to: '/tasks', icon: TaskIcon, label: 'Tasks' },
];

function DashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function GroupIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function ProjectIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  );
}
function TaskIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
}

export default function Sidebar({ notifCount = 3 }: { notifCount?: number }) {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const notifications = [
    { id: 1, text: 'Minh Khoa assigned you a task in "Q4 Launch"', time: '2m ago', unread: true },
    { id: 2, text: 'Linh Tran commented on "API Integration"', time: '15m ago', unread: true },
    { id: 3, text: 'Sprint 7 deadline is tomorrow', time: '1h ago', unread: false },
  ];

  return (
    <>
      <aside
        style={{ background: 'linear-gradient(180deg, #131629 0%, #0E1024 100%)', borderRight: '1px solid rgba(99,102,241,0.12)', width: 240, flexShrink: 0 }}
        className="flex flex-col h-screen sticky top-0 z-30"
      >
        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3">
          <div style={{ background: 'linear-gradient(135deg, #6366F1, #A78BFA)', borderRadius: 10 }} className="w-9 h-9 flex items-center justify-center shadow-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 18, color: '#F0F2FF', letterSpacing: '-0.3px' }}>FlowTask</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                borderRadius: 8, textDecoration: 'none', transition: 'all 150ms',
                fontFamily: 'Inter', fontWeight: 500, fontSize: 14,
                background: isActive ? 'rgba(99,102,241,0.18)' : 'transparent',
                color: isActive ? '#818CF8' : '#8B92B3',
                borderLeft: isActive ? '2px solid #6366F1' : '2px solid transparent',
              })}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                if (!el.getAttribute('data-active')) {
                  el.style.background = 'rgba(255,255,255,0.04)';
                  el.style.color = '#C7D0F8';
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                if (!el.getAttribute('data-active')) {
                  el.style.background = '';
                  el.style.color = '';
                }
              }}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 flex flex-col gap-1">
          {/* Notification bell */}
          <button
            onClick={() => setShowNotif(!showNotif)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#8B92B3', fontFamily: 'Inter', fontWeight: 500, fontSize: 14, width: '100%',
              transition: 'all 150ms',
            }}
            className="hover:bg-white/5 hover:text-[#C7D0F8]"
          >
            <div className="relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notifCount > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -5, background: '#6366F1', borderRadius: 99, width: 14, height: 14, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {notifCount}
                </span>
              )}
            </div>
            Notifications
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate('/profile')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer',
              width: '100%', transition: 'all 150ms',
            }}
            className="hover:bg-white/5"
          >
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#fff' }}>
              NK
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F2FF', lineHeight: 1.2 }}>Nguyen Khoa</div>
              <div style={{ fontSize: 11, color: '#8B92B3', lineHeight: 1.2 }}>nguyenkhoa@flowtask</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Notification dropdown */}
      {showNotif && (
        <div
          style={{
            position: 'fixed', bottom: 80, left: 248, zIndex: 100,
            background: '#1C2040', border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 12, width: 320, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(99,102,241,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF' }}>Notifications</span>
            <span style={{ fontSize: 11, color: '#6366F1', cursor: 'pointer' }}>Mark all read</span>
          </div>
          {notifications.map(n => (
            <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: n.unread ? 'rgba(99,102,241,0.05)' : 'transparent', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              {n.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', marginTop: 5, flexShrink: 0 }} />}
              {!n.unread && <div style={{ width: 6, height: 6, marginTop: 5, flexShrink: 0 }} />}
              <div>
                <p style={{ fontSize: 13, color: '#C7D0F8', lineHeight: 1.4, margin: 0 }}>{n.text}</p>
                <p style={{ fontSize: 11, color: '#8B92B3', margin: '4px 0 0' }}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
