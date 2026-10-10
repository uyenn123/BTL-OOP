import { useState } from 'react';
import { useNavigate } from 'react-router';

const tabs = ['Profile', 'Security', 'Notifications', 'Appearance'];

export default function Profile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 10, background: '#0B0D16', border: '1px solid rgba(99,102,241,0.2)', color: '#F0F2FF', fontSize: 14, fontFamily: 'Inter', outline: 'none' };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>
      <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 24, color: '#F0F2FF', letterSpacing: '-0.3px', margin: '0 0 24px' }}>Account Settings</h1>

      {/* Profile hero */}
      <div style={{ background: '#13162A', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', padding: '28px 32px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
            NK
          </div>
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#34D399', border: '2px solid #13162A' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 20, color: '#F0F2FF', margin: '0 0 4px' }}>Nguyen Minh Khoa</h2>
          <p style={{ color: '#8B92B3', fontSize: 13, margin: '0 0 12px' }}>Team Lead · Engineering · nguyenkhoa@flowtask.dev</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['12', 'Active Tasks'], ['5', 'Projects'], ['3', 'Groups']].map(([v, l]) => (
              <div key={l}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 18, color: '#6366F1' }}>{v}</span>
                <span style={{ fontSize: 12, color: '#8B92B3', marginLeft: 4 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <button style={{ padding: '9px 18px', borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818CF8', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500, fontSize: 13 }}>
          Change photo
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '10px 20px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500, fontSize: 13, transition: 'all 150ms',
              color: tab === t ? '#818CF8' : '#8B92B3', borderBottom: tab === t ? '2px solid #6366F1' : '2px solid transparent', marginBottom: -1 }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Profile' && (
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[['First name', 'Minh Khoa'], ['Last name', 'Nguyen']].map(([label, val]) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>{label}</label>
                <input defaultValue={val} style={inputStyle} onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')} />
              </div>
            ))}
          </div>
          {[['Email', 'nguyenkhoa@flowtask.dev'], ['Job title', 'Team Lead'], ['Organization', 'FPT University']].map(([label, val]) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>{label}</label>
              <input defaultValue={val} style={inputStyle} onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')} />
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>Bio</label>
            <textarea defaultValue="Full-stack developer and team lead. Passionate about clean architecture and shipping great products."
              rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')} />
          </div>
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button onClick={handleSave}
              style={{ padding: '11px 24px', borderRadius: 10, background: saved ? 'rgba(52,211,153,0.2)' : 'linear-gradient(135deg,#6366F1,#818CF8)', color: saved ? '#34D399' : '#fff', border: saved ? '1px solid #34D399' : 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, transition: 'all 200ms', display: 'flex', alignItems: 'center', gap: 8, boxShadow: saved ? 'none' : '0 4px 14px rgba(99,102,241,0.3)' }}>
              {saved ? (<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Saved!</>) : 'Save changes'}
            </button>
            <button style={{ padding: '11px 20px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#8B92B3', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500, fontSize: 14 }}>Cancel</button>
          </div>
        </div>
      )}

      {tab === 'Security' && (
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Change password */}
          <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '22px 24px' }}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 15, color: '#F0F2FF', marginBottom: 16 }}>Change Password</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Current password', 'New password', 'Confirm new password'].map(l => (
                <div key={l}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>{l}</label>
                  <input type="password" placeholder="••••••••" style={inputStyle} onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')} onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.2)')} />
                </div>
              ))}
              <button style={{ alignSelf: 'flex-start', padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13 }}>Update password</button>
            </div>
          </div>
          {/* 2FA */}
          <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 15, color: '#F0F2FF', marginBottom: 4 }}>Two-factor authentication</div>
              <div style={{ fontSize: 13, color: '#8B92B3' }}>Add an extra layer of security to your account</div>
            </div>
            <div style={{ width: 44, height: 24, borderRadius: 99, background: 'rgba(52,211,153,0.2)', border: '1px solid #34D399', display: 'flex', alignItems: 'center', padding: '0 3px', cursor: 'pointer' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#34D399', marginLeft: 'auto', boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} />
            </div>
          </div>
          {/* Danger zone */}
          <div style={{ background: 'rgba(248,113,113,0.05)', borderRadius: 14, border: '1px solid rgba(248,113,113,0.2)', padding: '22px 24px' }}>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 15, color: '#F87171', marginBottom: 8 }}>Danger Zone</h3>
            <p style={{ fontSize: 13, color: '#8B92B3', marginBottom: 14 }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
            <button style={{ padding: '9px 18px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(248,113,113,0.4)', color: '#F87171', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500, fontSize: 13 }}>Delete account</button>
          </div>
        </div>
      )}

      {tab === 'Notifications' && (
        <div style={{ maxWidth: 560 }}>
          {[
            { section: 'Email Notifications', items: [['Task assigned to you', true], ['Comments on your tasks', true], ['Project updates', false], ['Weekly digest', true]] },
            { section: 'In-App Notifications', items: [['Task due reminders', true], ['Mention alerts', true], ['Sprint start/end', false]] },
          ].map(({ section, items }) => (
            <div key={section} style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF' }}>{section}</div>
              {items.map(([label, enabled]) => (
                <div key={label as string} style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: 13, color: '#C7D0F8' }}>{label as string}</span>
                  <div style={{ width: 40, height: 22, borderRadius: 99, background: enabled ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.08)', border: `1px solid ${enabled ? '#6366F1' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', padding: '0 3px', cursor: 'pointer' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: enabled ? '#6366F1' : '#8B92B3', marginLeft: enabled ? 'auto' : 0, transition: 'all 200ms' }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === 'Appearance' && (
        <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '22px 24px' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF', marginBottom: 16 }}>Theme</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {[
                { label: 'Dark', bg: '#0B0D16', active: true },
                { label: 'Dim', bg: '#1C2040', active: false },
                { label: 'Light', bg: '#F7F8FA', active: false },
              ].map(t => (
                <button key={t.label}
                  style={{ padding: '16px 12px', borderRadius: 10, border: `2px solid ${t.active ? '#6366F1' : 'rgba(255,255,255,0.08)'}`, background: t.bg, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 150ms' }}>
                  <div style={{ width: 32, height: 20, borderRadius: 4, background: t.active ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)' }} />
                  <span style={{ fontSize: 12, color: t.active ? '#818CF8' : '#8B92B3', fontFamily: 'Inter', fontWeight: 500 }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ background: '#13162A', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '22px 24px' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF', marginBottom: 14 }}>Accent color</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['#6366F1','#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6'].map((c, i) => (
                <button key={c} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: i === 0 ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer', transition: 'transform 150ms' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.2)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')} />
              ))}
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')}
            style={{ alignSelf: 'flex-start', padding: '11px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>
            Save appearance
          </button>
        </div>
      )}
    </div>
  );
}
