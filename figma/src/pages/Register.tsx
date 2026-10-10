import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' });
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', borderRadius: 10, outline: 'none',
    background: '#13162A', border: '1px solid rgba(99,102,241,0.25)',
    color: '#F0F2FF', fontSize: 14, fontFamily: 'Inter', transition: 'border 150ms',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D16', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <div style={{ background: 'linear-gradient(135deg,#6366F1,#A78BFA)', borderRadius: 10, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(99,102,241,0.3)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: '#F0F2FF' }}>FlowTask</span>
      </div>

      <div style={{ width: '100%', maxWidth: 440, background: '#13162A', borderRadius: 16, border: '1px solid rgba(99,102,241,0.18)', padding: 32 }}>
        {/* Steps */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 99, background: s <= step ? '#6366F1' : 'rgba(255,255,255,0.08)', transition: 'background 300ms' }} />
          ))}
        </div>

        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 24, color: '#F0F2FF', marginBottom: 4, letterSpacing: '-0.3px' }}>
          {step === 1 ? 'Create your account' : 'Set up your workspace'}
        </h1>
        <p style={{ color: '#8B92B3', fontSize: 14, marginBottom: 24 }}>
          {step === 1 ? 'Join thousands of teams using FlowTask' : 'Tell us a bit more to get started'}
        </p>

        <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {step === 1 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>Full name</label>
                <input style={inputStyle} placeholder="Nguyen Minh Khoa" value={form.name} onChange={e => update('name', e.target.value)} required
                  onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.25)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>Email</label>
                <input type="email" style={inputStyle} placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} required
                  onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.25)')} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>Password</label>
                <input type="password" style={inputStyle} placeholder="At least 8 characters" value={form.password} onChange={e => update('password', e.target.value)} required minLength={8}
                  onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.25)')} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 8 }}>Your role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['Developer', 'Designer', 'Manager', 'Other'].map(r => (
                    <button key={r} type="button"
                      onClick={() => update('role', r)}
                      style={{
                        padding: '10px 12px', borderRadius: 10, border: form.role === r ? '2px solid #6366F1' : '1px solid rgba(99,102,241,0.2)',
                        background: form.role === r ? 'rgba(99,102,241,0.15)' : 'transparent',
                        color: form.role === r ? '#818CF8' : '#8B92B3', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 150ms',
                      }}
                    >{r}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#C7D0F8', marginBottom: 6 }}>Team / organization</label>
                <input style={inputStyle} placeholder="Acme Corp, FPT University…" onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(99,102,241,0.25)')} />
              </div>
            </>
          )}

          <button type="submit" disabled={loading}
            style={{
              padding: '12px', borderRadius: 10, fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14, marginTop: 4,
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366F1,#818CF8)',
              color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 20px rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? (<><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Creating account…</>) : step === 1 ? 'Continue →' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#8B92B3', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6366F1', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
