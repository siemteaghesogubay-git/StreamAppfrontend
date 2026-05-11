import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function EditMoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', genre: '', year: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/movie/all').then(res => {
      const movie = res.data.find(m => m.id === parseInt(id));
      if (movie) setForm({
        title: movie.title,
        description: movie.description,
        genre: movie.genre,
        year: movie.year
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/movie/${id}`, form);
      navigate('/admin');
    } catch {
      setError('Kunde inte spara ändringarna.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <h2 style={styles.title}>Redigera film</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Titel</label>
          <input
            style={styles.input}
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <label style={styles.label}>Beskrivning</label>
          <textarea
            style={{ ...styles.input, height: 80, resize: 'vertical' }}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <label style={styles.label}>Genre</label>
          <input
            style={styles.input}
            value={form.genre}
            onChange={e => setForm({ ...form, genre: e.target.value })}
          />
          <label style={styles.label}>År</label>
          <input
            style={styles.input}
            type="number"
            value={form.year}
            onChange={e => setForm({ ...form, year: e.target.value })}
            required
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button style={styles.cancelBtn} type="button" onClick={() => navigate('/admin')}>
              Avbryt
            </button>
            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? 'Sparar...' : 'Spara ändringar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' },
  box: { background: '#111118', border: '1px solid #222', borderRadius: 16, padding: 40, width: 440 },
  title: { color: '#fff', marginBottom: 24, fontWeight: 500 },
  label: { display: 'block', fontSize: 13, color: '#888', marginBottom: 6, marginTop: 14 },
  input: { width: '100%', background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, boxSizing: 'border-box' },
  button: { flex: 1, background: '#7c3aed', border: 'none', color: '#fff', padding: 11, borderRadius: 8, fontSize: 15, cursor: 'pointer' },
  cancelBtn: { flex: 1, background: 'transparent', border: '1px solid #333', color: '#888', padding: 11, borderRadius: 8, fontSize: 15, cursor: 'pointer' },
  error: { color: '#f87171', marginBottom: 12, fontSize: 14 },
};