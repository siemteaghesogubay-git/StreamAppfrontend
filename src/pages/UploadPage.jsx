import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function UploadPage() {
  const [form, setForm] = useState({ title: '', description: '', genre: '', year: '' });
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleThumbnail = (e) => {
    const f = e.target.files[0];
    setThumbnail(f);
    setThumbnailPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Välj en videofil.');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('genre', form.genre);
    formData.append('year', form.year);
    if (thumbnail) formData.append('thumbnail', thumbnail);

    try {
      await api.post('/movie/upload', formData);
      navigate('/');
    } catch {
      setError('Uppladdningen misslyckades.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <h2 style={styles.title}>Ladda upp film</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Titel</label>
          <input style={styles.input} placeholder="Titel" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />

          <label style={styles.label}>Beskrivning</label>
          <input style={styles.input} placeholder="Beskrivning" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

          <label style={styles.label}>Genre</label>
          <select style={styles.input} value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} required>
            <option value="">Välj genre</option>
            <option value="Music">Music</option>
            <option value="Movie">Movie</option>
            <option value="Comedy">Comedy</option>
            <option value="Mezmur">Mezmur</option>
            <option value="Audio Book">Audio Book</option>
          </select>

          <label style={styles.label}>År</label>
          <input style={styles.input} placeholder="År" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required />

          <label style={styles.label}>Omslagsbild</label>
          {thumbnailPreview && (
            <img src={thumbnailPreview} alt="Förhandsgranskning" style={styles.preview} />
          )}
          <input style={styles.fileInput} type="file" accept="image/*" onChange={handleThumbnail} />

          <label style={styles.label}>Videofil</label>
          <input style={styles.fileInput} type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} required />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Laddar upp...' : 'Ladda upp'}
          </button>
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
  input: { width: '100%', background: '#1a1a2e', border: '1px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, marginBottom: 4, boxSizing: 'border-box' },
  fileInput: { width: '100%', color: '#888', marginBottom: 8, fontSize: 13 },
  preview: { width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, marginBottom: 8 },
  button: { width: '100%', background: '#7c3aed', border: 'none', color: '#fff', padding: 11, borderRadius: 8, fontSize: 15, cursor: 'pointer', marginTop: 16 },
  error: { color: '#f87171', marginBottom: 12, fontSize: 14 },
};