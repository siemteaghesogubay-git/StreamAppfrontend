import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import hero from '../assets/home_bg.webp';
import logo from '../assets/sts_stream_logo.webp';



export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate('/');
    } catch {
      setError('Fel e-post eller lösenord.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.bg, backgroundImage: `url(${hero})` }} />
      <div style={styles.overlay} />

      <div style={styles.content}>
        <img src={logo} alt="STS Stream" style={styles.logo} />

        <div style={styles.box}>
          <h2 style={styles.title}>Logga in</h2>
          <p style={styles.subtitle}>Välkommen tillbaka till STS Stream</p>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              type="email"
              placeholder="E-post"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Lösenord"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button style={styles.button} type="submit">Logga in</button>
          </form>

          <p style={styles.link}>
            Inget konto? <Link to="/register" style={{ color: '#a855f7' }}>Registrera dig</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bg: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' },
  content: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 },
  logo: { height: 80, objectFit: 'contain' },
  box: { background: 'rgba(10,10,15,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 40, width: 360, backdropFilter: 'blur(12px)' },
  title: { color: '#fff', marginBottom: 6, fontWeight: 500, fontSize: 22 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 24 },
  input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' },
  button: { width: '100%', background: '#7c3aed', border: 'none', color: '#fff', padding: 11, borderRadius: 8, fontSize: 15, cursor: 'pointer', marginTop: 8 },
  error: { color: '#f87171', marginBottom: 12, fontSize: 14 },
  link: { color: '#888', marginTop: 16, fontSize: 14, textAlign: 'center' },
};