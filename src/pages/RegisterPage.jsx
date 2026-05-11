import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      login(res.data);
      navigate('/');
    } catch {
      setError('E-postadressen används redan.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Skapa konto</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Användarnamn"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
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
          <button style={styles.button} type="submit">Registrera</button>
        </form>
        <p style={styles.link}>
          Har du ett konto? <Link to="/login">Logga in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' },
  box: { background: '#111118', border: '1px solid #222', borderRadius: 16, padding: 40, width: 360 },
  title: { color: '#fff', marginBottom: 24, fontWeight: 500 },
  input: { width: '100%', background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' },
  button: { width: '100%', background: '#7c3aed', border: 'none', color: '#fff', padding: 11, borderRadius: 8, fontSize: 15, cursor: 'pointer', marginTop: 8 },
  error: { color: '#f87171', marginBottom: 12, fontSize: 14 },
  link: { color: '#888', marginTop: 16, fontSize: 14, textAlign: 'center' },
};