import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/dashboard'), 900);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D16', display: 'flex' }}>
      {/* Left: Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 32px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)', borderRadius: 12, width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(99,102,241,0.35)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 22, color: '#F0F2FF', letterSpacing: '-0.5px' }}>FlowTask</span>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 28, color: '#F0F2FF', marginBottom: 8, letterSpacing: '-0.5px' }}>
            Welcome back
          </h1>
          <p style={{ color: '#8B92B3', fontSize: 15, marginBottom: 32 }}>Sign in to continue to FlowTask</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10, outline: 'none',
                  background: '#13162A', border: '1px solid rgba(99,102,241,0.25)',
                  color: '#F0F2FF', fontSize: 14, fontFamily: 'Inter', transition: 'border 150ms',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.25)')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10, outline: 'none',
                  background: '#13162A', border: '1px solid rgba(99,102,241,0.25)',
                  color: '#F0F2FF', fontSize: 14, fontFamily: 'Inter', transition: 'border 150ms',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.6)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.25)')}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 13, color: '#6366F1', cursor: 'pointer' }}>Forgot password?</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px', borderRadius: 10, fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14,
                background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366F1,#818CF8)',
                color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(99,102,241,0.35)', transition: 'all 150ms',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: 12, color: '#8B92B3' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* SSO Demo */}
          <button
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 10,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: '#C7D0F8', fontSize: 14, fontFamily: 'Inter', fontWeight: 500,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 150ms',
            }}
            onClick={() => navigate('/dashboard')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#8B92B3', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366F1', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right: Decorative panel */}
      <div style={{ flex: 1, background: 'linear-gradient(160deg,#13162A 0%,#0F1228 100%)', borderLeft: '1px solid rgba(99,102,241,0.12)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

        {/* Mini dashboard mockup */}
        <div style={{ width: '100%', maxWidth: 380, background: '#1C2040', borderRadius: 16, border: '1px solid rgba(99,102,241,0.2)', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, color: '#F0F2FF' }}>Sprint Progress</span>
            <span style={{ fontSize: 11, color: '#34D399', fontWeight: 500 }}>● Active</span>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Design system', pct: 85, color: '#6366F1' },
              { label: 'API Integration', pct: 60, color: '#A78BFA' },
              { label: 'User testing', pct: 35, color: '#34D399' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#C7D0F8' }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: '#8B92B3', fontFamily: 'JetBrains Mono' }}>{item.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 99 }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(99,102,241,0.08)', display: 'flex', gap: 8 }}>
            {['In Progress', 'Review', 'Done'].map((s, i) => (
              <span key={s} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, fontWeight: 500, background: ['rgba(99,102,241,0.15)','rgba(251,191,36,0.15)','rgba(52,211,153,0.15)'][i], color: ['#818CF8','#FBBF24','#34D399'][i] }}>{s}</span>
            ))}
          </div>
        </div>

        <p style={{ color: '#8B92B3', fontSize: 14, marginTop: 32, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
          Collaborate on projects, track tasks, and ship faster with your team.
        </p>
      </div>
    </div>
  );
}
