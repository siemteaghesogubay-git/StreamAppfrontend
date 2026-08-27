import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Heart, Play } from 'lucide-react';
import api from '../services/api';

export default function MyListPage() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/watchlist').then(res => setMovies(res.data));
  }, []);

  const remove = async (movieId) => {
    await api.delete(`/watchlist/${movieId}`);
    setMovies(prev => prev.filter(m => m.id !== movieId));
  };

  const s = {
    page: { padding: '32px 24px', color: dark ? '#fff' : '#111' },
    title: { fontSize: 22, fontWeight: 600, marginBottom: 8 },
    sub: { color: '#888', fontSize: 14, marginBottom: 32 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 },
    card: { borderRadius: 10, overflow: 'hidden', background: dark ? '#111a11' : '#fff', border: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}`, cursor: 'pointer' },
    thumb: { aspectRatio: '2/3', background: 'linear-gradient(135deg, #1a2e1a, #0d4a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
    cardInfo: { padding: '8px 10px' },
    cardTitle: { fontSize: 13, fontWeight: 500, margin: '0 0 3px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
    cardMeta: { fontSize: 11, color: '#888' },
    removeBtn: { position: 'absolute', top: 6, right: 6, background: 'rgba(239,68,68,0.8)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    empty: { textAlign: 'center', marginTop: 80 },
  };

  return (
    <div style={s.page}>
      <h2 style={s.title}>Min lista</h2>
      <p style={s.sub}>{movies.length} filmer sparade</p>

      {movies.length === 0 ? (
        <div style={s.empty}>
          <Heart size={48} color="#1db954" style={{ marginBottom: 16 }} />
          <p style={{ color: '#888', fontSize: 15 }}>Du har inte lagt till några filmer än.</p>
          <p style={{ color: '#666', fontSize: 13, marginTop: 8 }}>Klicka på + på en film för att spara den här.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {movies.map(movie => (
            <div key={movie.id} style={s.card} onClick={() => navigate(`/watch/${movie.id}`)}>
              <div style={s.thumb}>
                {movie.thumbnailUrl ? (
                  <img src={movie.thumbnailUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Play size={28} color="#1db954" />
                )}
                <button style={s.removeBtn} onClick={(e) => { e.stopPropagation(); remove(movie.id); }}>✕</button>
              </div>
              <div style={s.cardInfo}>
                <p style={s.cardTitle}>{movie.title}</p>
                <p style={s.cardMeta}>{movie.genre} · {movie.year}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}