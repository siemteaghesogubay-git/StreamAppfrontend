import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Play, Plus, Check, ChevronRight } from 'lucide-react';
import api from '../services/api';
import hero from '../assets/hero.png';

const CATEGORIES = ['Alla', 'Movie', 'Music', 'Comedy', 'Mezmur', 'Audio Book','series'];

export default function HomePage({ search }) {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Alla');
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dark = theme === 'dark';

  useEffect(() => {
    api.get('/movie/all').then(res => setMovies(res.data));
    api.get('/watchlist').then(res => setWatchlist(res.data.map(m => m.id))).catch(() => {});
  }, []);

  const toggleWatchlist = async (e, movieId) => {
    e.stopPropagation();
    const inList = watchlist.includes(movieId);
    if (inList) {
      await api.delete(`/watchlist/${movieId}`);
      setWatchlist(prev => prev.filter(id => id !== movieId));
    } else {
      await api.post(`/watchlist/${movieId}`);
      setWatchlist(prev => [...prev, movieId]);
    }
  };

  const filtered = movies
    .filter(m => activeCategory === 'Alla' || m.genre.toLowerCase() === activeCategory.toLowerCase())
    .filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()));

  const featured = movies[0];
  const continueWatching = movies.slice(0, 3);
  const popular = movies.slice(0, 3);

  const s = {
    page: { color: dark ? '#fff' : '#111' },
    hero: { position: 'relative', height: 380, backgroundImage: `url(${hero})`, backgroundSize: 'cover', backgroundPosition: 'center', margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden' },
    heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px 40px' },
    featuredLabel: { fontSize: 11, color: '#1db954', fontWeight: 600, letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' },
    heroTitle: { fontSize: 36, fontWeight: 700, marginBottom: 8, color: '#fff' },
    heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 20, maxWidth: 400 },
    heroButtons: { display: 'flex', gap: 12 },
    playBtn: { background: '#1db954', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 },
    listBtn: (inList) => ({ background: inList ? 'rgba(29,185,84,0.2)' : 'rgba(255,255,255,0.15)', border: `1px solid ${inList ? '#1db954' : 'rgba(255,255,255,0.3)'}`, color: inList ? '#1db954' : '#fff', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(4px)' }),
    content: { padding: '24px 16px' },
    catRow: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
    catBtn: (active) => ({ background: active ? '#1db954' : (dark ? '#1a2e1a' : '#e8f5e9'), border: 'none', color: active ? '#fff' : (dark ? '#aaa' : '#555'), padding: '7px 18px', borderRadius: 20, cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400 }),
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 600 },
    seeAll: { background: 'none', border: 'none', color: '#1db954', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 32 },
    card: { cursor: 'pointer', borderRadius: 10, overflow: 'hidden', background: dark ? '#111a11' : '#fff', border: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}` },
    thumb: { aspectRatio: '2/3', background: 'linear-gradient(135deg, #1a2e1a, #0d4a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' },
    addBtn: (inList) => ({ position: 'absolute', top: 6, right: 6, background: inList ? '#1db954' : 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }),
    cardInfo: { padding: '8px 10px' },
    cardTitle: { fontSize: 12, fontWeight: 500, margin: '0 0 3px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
    cardMeta: { fontSize: 11, color: '#888', margin: 0 },
    rightPanel: { width: 280, padding: '16px', borderLeft: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}`, minHeight: 'calc(100vh - 64px)', flexShrink: 0 },
    cwCard: { display: 'flex', gap: 10, marginBottom: 16, cursor: 'pointer' },
    cwThumb: { width: 72, height: 48, borderRadius: 6, background: 'linear-gradient(135deg, #1a2e1a, #0d4a1a)', overflow: 'hidden', flexShrink: 0 },
    cwInfo: { flex: 1 },
    cwTitle: { fontSize: 13, fontWeight: 500, margin: '0 0 3px' },
    cwMeta: { fontSize: 11, color: '#888' },
    progressBar: { height: 3, background: dark ? '#2a3e2a' : '#ddd', borderRadius: 2, marginTop: 6 },
    progress: (pct) => ({ height: '100%', width: `${pct}%`, background: '#1db954', borderRadius: 2 }),
    trendItem: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, cursor: 'pointer' },
    trendNum: { fontSize: 18, fontWeight: 700, color: '#1db954', width: 24, textAlign: 'center' },
    trendThumb: { width: 48, height: 48, borderRadius: 6, background: 'linear-gradient(135deg, #1a2e1a, #0d4a1a)', overflow: 'hidden' },
    trendInfo: { flex: 1 },
    trendTitle: { fontSize: 13, fontWeight: 500, margin: '0 0 2px' },
    trendMeta: { fontSize: 11, color: '#888' },
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={s.page}>

          <div style={s.hero}>
            <div style={s.heroOverlay}>
              <p style={s.featuredLabel}>FEATURED</p>
              <h1 style={s.heroTitle}>{featured?.title || 'STS Stream'}</h1>
              <p style={s.heroDesc}>En hyllning till vårt arv, vår kultur och vår framtid.</p>
              <div style={s.heroButtons}>
                <button style={s.playBtn} onClick={() => featured && navigate(`/watch/${featured.id}`)}>
                  <Play size={16} fill="#fff" /> Spela nu
                </button>
                <button
                  style={s.listBtn(featured ? watchlist.includes(featured.id) : false)}
                  onClick={(e) => featured && toggleWatchlist(e, featured.id)}
                >
                  {featured && watchlist.includes(featured.id)
                    ? <><Check size={16} /> I din lista</>
                    : <><Plus size={16} /> Min lista</>
                  }
                </button>
              </div>
            </div>
          </div>

          <div style={s.content}>
            <div style={s.catRow}>
              {CATEGORIES.map(cat => (
                <button key={cat} style={s.catBtn(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            <div style={s.sectionHeader}>
              <span style={s.sectionTitle}>Populära filmer</span>
              <button style={s.seeAll} onClick={() => navigate('/my-list')}>
                Visa alla <ChevronRight size={14} />
              </button>
            </div>

            {filtered.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>Inga filmer hittades.</p>
            ) : (
              <div style={s.grid}>
                {filtered.map(movie => (
                  <div key={movie.id} style={s.card} onClick={() => navigate(`/watch/${movie.id}`)}>
                    <div style={s.thumb}>
                      {movie.thumbnailUrl ? (
                        <img src={movie.thumbnailUrl} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Play size={28} color="#1db954" />
                      )}
                      <button
                        style={s.addBtn(watchlist.includes(movie.id))}
                        onClick={(e) => toggleWatchlist(e, movie.id)}
                      >
                        {watchlist.includes(movie.id) ? <Check size={14} /> : <Plus size={14} />}
                      </button>
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
        </div>
      </div>

      <div style={s.rightPanel}>
        <div style={s.sectionHeader}>
          <span style={s.sectionTitle}>Fortsätt titta</span>
          <button style={s.seeAll}>Visa alla</button>
        </div>
        {continueWatching.map((m, i) => (
          <div key={m.id} style={s.cwCard} onClick={() => navigate(`/watch/${m.id}`)}>
            <div style={s.cwThumb}>
              {m.thumbnailUrl && <img src={m.thumbnailUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={s.cwInfo}>
              <p style={s.cwTitle}>{m.title}</p>
              <p style={s.cwMeta}>{m.year} · {m.genre}</p>
              <div style={s.progressBar}>
                <div style={s.progress([45, 32, 78][i])} />
              </div>
              <p style={{ fontSize: 11, color: '#888', marginTop: 3 }}>{[45, 32, 78][i]}%</p>
            </div>
          </div>
        ))}

        <div style={{ ...s.sectionHeader, marginTop: 24 }}>
          <span style={s.sectionTitle}>Populärt just nu</span>
          <button style={s.seeAll}>Visa alla</button>
        </div>
        {popular.map((m, i) => (
          <div key={m.id} style={s.trendItem} onClick={() => navigate(`/watch/${m.id}`)}>
            <span style={s.trendNum}>{i + 1}</span>
            <div style={s.trendThumb}>
              {m.thumbnailUrl && <img src={m.thumbnailUrl} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            </div>
            <div style={s.trendInfo}>
              <p style={s.trendTitle}>{m.title}</p>
              <p style={s.trendMeta}>{m.genre} · {m.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}