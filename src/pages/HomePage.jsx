import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import hero from '../assets/hero.png';

const CATEGORIES = ['Alla', 'Music', 'Movie', 'Comedy', 'Mezmur', 'Audio Book'];

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Alla');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/movie/all').then(res => setMovies(res.data));
  }, []);

  const filtered = movies
    .filter(m => activeCategory === 'Alla' || m.genre.toLowerCase() === activeCategory.toLowerCase())
    .filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={styles.page}>

      <div style={{ ...styles.heroBg, backgroundImage: `url(${hero})` }}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>STS <span style={{ color: '#a855f7' }}>Stream</span></h1>
          <p style={styles.heroSub}>Din privata videostreamingplattform</p>
          <button
            style={styles.heroBtn}
            onClick={() => document.getElementById('content').scrollIntoView({ behavior: 'smooth' })}>
            ▶ Börja titta
          </button>
        </div>
      </div>

      <div id="content" style={styles.content}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Sök efter filmer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div style={styles.categories}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              style={{ ...styles.catBtn, ...(activeCategory === cat ? styles.catActive : {}) }}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <h2 style={styles.sectionTitle}>
          {search
            ? `Sökresultat för "${search}" (${filtered.length})`
            : activeCategory === 'Alla' ? 'Alla filmer' : activeCategory}
        </h2>

        {filtered.length === 0 ? (
          <div style={styles.emptyWrap}>
            <p style={styles.emptyIcon}>🎬</p>
            <p style={styles.empty}>Inga filmer hittades.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map(movie => (
              <div
                key={movie.id}
                style={styles.card}
                onClick={() => navigate(`/watch/${movie.id}`)}
              >
                <div style={styles.thumbnail}>
                  {movie.thumbnailUrl ? (
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={styles.playIcon}>▶</span>
                  )}
                </div>
                <div style={styles.cardInfo}>
                  <p style={styles.cardTitle}>{movie.title}</p>
                  <p style={styles.cardMeta}>{movie.genre} · {movie.year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', color: '#fff' },
  heroBg: { width: '100%', height: '70vh', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '0 60px' },
  heroTitle: { fontSize: 56, fontWeight: 700, margin: '0 0 12px', color: '#fff' },
  heroSub: { fontSize: 18, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px' },
  heroBtn: { background: '#7c3aed', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: 10, fontSize: 16, cursor: 'pointer', fontWeight: 500 },
  content: { padding: '40px 24px' },
  searchWrap: { position: 'relative', marginBottom: 24, maxWidth: 480 },
  searchIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 },
  searchInput: { width: '100%', background: '#111118', border: '1px solid #2a2a3e', borderRadius: 24, padding: '12px 44px', color: '#fff', fontSize: 15, boxSizing: 'border-box', outline: 'none' },
  clearBtn: { position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 16 },
  categories: { display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' },
  catBtn: { background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 20px', borderRadius: 20, cursor: 'pointer', fontSize: 14 },
  catActive: { background: '#7c3aed', border: '1px solid #7c3aed', color: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: 500, marginBottom: 20 },
  emptyWrap: { textAlign: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  empty: { color: '#555', fontSize: 14 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 },
  card: { cursor: 'pointer', borderRadius: 10, overflow: 'hidden', background: '#111118', border: '1px solid #1a1a2e', transition: 'transform 0.15s' },
  thumbnail: { aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  playIcon: { fontSize: 32, color: '#a855f7' },
  cardInfo: { padding: '10px 12px' },
  cardTitle: { fontSize: 14, fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  cardMeta: { fontSize: 12, color: '#666', margin: '4px 0 0' },
};