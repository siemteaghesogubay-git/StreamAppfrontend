import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Shield, Monitor, Users, Play } from 'lucide-react';
import hero from '../assets/hero.png';
import logo from '../assets/sts_stream_logo.webp';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      login(res.data);
      navigate('/');
    } catch {
      setError('E-postadressen används redan.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Shield, title: 'Säker streaming', desc: 'Din data är skyddad' },
    { icon: Monitor, title: 'Hög kvalitet', desc: 'Streama i 4K Ultra HD' },
    { icon: Users, title: 'För vår community', desc: 'Av oss, för oss' },
    { icon: Play, title: 'Snabb & smidigt', desc: 'Titta när du vill' },
  ];

  return (
    <div style={s.page}>
      <div style={{ ...s.bg, backgroundImage: `url(${hero})` }} />
      <div style={s.bgOverlay} />

      <div style={s.left}>
        <img src={logo} alt="STS Stream" style={s.logo} />

        <div style={s.tagline}>
          <h1 style={s.tagH1}>Gå med idag.<br />Vår kultur.<br /><span style={{ color: '#1db954' }}>Din stream.</span></h1>
          <p style={s.tagDesc}>Eritreansk & Etiopisk underhållning.<br />Filmer, musik, komedier, mezmur och mycket mer.</p>
        </div>

        <div style={s.features}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={s.featureCard}>
              <div style={s.featureIcon}>
                <Icon size={22} color="#1db954" />
              </div>
              <div>
                <p style={s.featureTitle}>{title}</p>
                <p style={s.featureDesc}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.right}>
        <div style={s.formBox}>
          <div style={s.formHeader}>
            <h2 style={s.formTitle}>Skapa konto</h2>
            <p style={s.formSub}>Gå med i <span style={{ color: '#1db954' }}>STS Stream</span> idag</p>
            <div style={s.logoCircle}>STS</div>
          </div>

          {error && <div style={s.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <label style={s.label}>Användarnamn</label>
            <div style={s.inputWrap}>
              <User size={18} style={s.inputIcon} />
              <input
                style={s.input}
                type="text"
                placeholder="ditt_användarnamn"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <label style={s.label}>E-post</label>
            <div style={s.inputWrap}>
              <Mail size={18} style={s.inputIcon} />
              <input
                style={s.input}
                type="email"
                placeholder="exempel@epost.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <label style={s.label}>Lösenord</label>
            <div style={s.inputWrap}>
              <Lock size={18} style={s.inputIcon} />
              <input
                style={{ ...s.input, paddingRight: 44 }}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button style={s.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Skapar konto...' : <><span>Registrera dig</span> <ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={s.loginText}>
            Har du ett konto? <Link to="/login" style={{ color: '#1db954', textDecoration: 'none', fontWeight: 500 }}>Logga in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' },
  bg: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center' },
  bgOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(5,15,5,0.92) 55%, rgba(5,15,5,0.75))' },
  left: { position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 48px', maxWidth: 580 },
  logo: { height: 44, objectFit: 'contain', alignSelf: 'flex-start' },
  tagline: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  tagH1: { fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 20 },
  tagDesc: { fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 },
  features: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 32 },
  featureCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(29,185,84,0.2)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(8px)' },
  featureIcon: { width: 40, height: 40, borderRadius: 10, background: 'rgba(29,185,84,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureTitle: { fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 2px' },
  featureDesc: { fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 },
  right: { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', flex: 1 },
  formBox: { background: 'rgba(10,20,10,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420, backdropFilter: 'blur(20px)' },
  formHeader: { textAlign: 'center', marginBottom: 28 },
  formTitle: { fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 },
  formSub: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16 },
  logoCircle: { width: 52, height: 52, borderRadius: '50%', background: 'rgba(29,185,84,0.15)', border: '2px solid #1db954', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#1db954', margin: '0 auto' },
  errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: 8, marginTop: 16 },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 14, color: '#888' },
  input: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px 12px 44px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  eyeBtn: { position: 'absolute', right: 14, background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  submitBtn: { width: '100%', background: '#1db954', border: 'none', color: '#fff', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
  loginText: { textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 24 },
};