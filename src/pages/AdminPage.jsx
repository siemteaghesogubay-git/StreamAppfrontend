import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Film, Users, Edit, Trash2, Shield, User } from 'lucide-react';
import api from '../services/api';

export default function AdminPage() {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('movies');
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dark = theme === 'dark';

  useEffect(() => {
    api.get('/movie/all').then(res => setMovies(res.data));
    api.get('/user').then(res => setUsers(res.data));
  }, []);

  const deleteMovie = async (id) => {
    if (!confirm('Ta bort filmen?')) return;
    await api.delete(`/movie/${id}`);
    setMovies(movies.filter(m => m.id !== id));
  };

  const deleteUser = async (id) => {
    if (!confirm('Ta bort användaren?')) return;
    await api.delete(`/user/${id}`);
    setUsers(users.filter(u => u.id !== id));
  };

  const updateRole = async (id, role) => {
    await api.put(`/user/${id}/role`, { role });
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const s = {
    page: { padding: '32px 24px', color: dark ? '#fff' : '#111' },
    header: { marginBottom: 32 },
    title: { fontSize: 24, fontWeight: 700, marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#888' },
    stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 32 },
    statCard: { background: dark ? '#111a11' : '#fff', border: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}`, borderRadius: 12, padding: '16px 20px' },
    statNum: { fontSize: 28, fontWeight: 700, color: '#1db954', margin: '0 0 4px' },
    statLabel: { fontSize: 12, color: '#888', margin: 0 },
    tabs: { display: 'flex', gap: 4, marginBottom: 24, background: dark ? '#111a11' : '#f0f4f0', borderRadius: 10, padding: 4, width: 'fit-content' },
    tab: (active) => ({ background: active ? '#1db954' : 'transparent', border: 'none', color: active ? '#fff' : '#888', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: active ? 600 : 400, display: 'flex', alignItems: 'center', gap: 8 }),
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px 16px', fontSize: 12, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, borderBottom: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}` },
    tr: { borderBottom: `1px solid ${dark ? '#1a2e1a' : '#f0f0f0'}` },
    td: { padding: '14px 16px', fontSize: 14 },
    thumb: { width: 48, height: 64, borderRadius: 6, background: 'linear-gradient(135deg, #1a2e1a, #0d4a1a)', objectFit: 'cover', display: 'block' },
    badge: (role) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: role === 'Admin' ? 'rgba(29,185,84,0.15)' : 'rgba(255,255,255,0.05)', color: role === 'Admin' ? '#1db954' : '#888' }),
    actions: { display: 'flex', gap: 8, alignItems: 'center' },
    editBtn: { background: 'rgba(29,185,84,0.1)', border: '1px solid rgba(29,185,84,0.3)', color: '#1db954', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 },
    roleBtn: { background: 'rgba(255,255,255,0.05)', border: `1px solid ${dark ? '#2a3e2a' : '#ddd'}`, color: dark ? '#aaa' : '#555', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 },
    deleteBtn: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 },
    avatar: { width: 36, height: 36, borderRadius: '50%', background: '#1db954', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>Admin-panel</h2>
        <p style={s.subtitle}>Hantera filmer och användare</p>
      </div>

      <div style={s.stats}>
        <div style={s.statCard}>
          <p style={s.statNum}>{movies.length}</p>
          <p style={s.statLabel}>Totalt filmer</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statNum}>{users.length}</p>
          <p style={s.statLabel}>Användare</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statNum}>{users.filter(u => u.role === 'Admin').length}</p>
          <p style={s.statLabel}>Admins</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statNum}>{users.filter(u => u.role === 'User').length}</p>
          <p style={s.statLabel}>Vanliga användare</p>
        </div>
      </div>

      <div style={s.tabs}>
        <button style={s.tab(tab === 'movies')} onClick={() => setTab('movies')}>
          <Film size={16} /> Filmer ({movies.length})
        </button>
        <button style={s.tab(tab === 'users')} onClick={() => setTab('users')}>
          <Users size={16} /> Användare ({users.length})
        </button>
      </div>

      {tab === 'movies' && (
        <div style={{ background: dark ? '#111a11' : '#fff', border: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}`, borderRadius: 16, overflow: 'hidden' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Film</th>
                <th style={s.th}>Genre</th>
                <th style={s.th}>År</th>
                <th style={s.th}>Storlek</th>
                <th style={s.th}>Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id} style={s.tr}>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {movie.thumbnailUrl
                        ? <img src={movie.thumbnailUrl} alt={movie.title} style={s.thumb} />
                        : <div style={s.thumb} />
                      }
                      <div>
                        <p style={{ fontWeight: 500, margin: '0 0 3px', fontSize: 14 }}>{movie.title}</p>
                        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{movie.description?.slice(0, 40)}...</p>
                      </div>
                    </div>
                  </td>
                  <td style={s.td}>
                    <span style={s.badge('User')}>{movie.genre}</span>
                  </td>
                  <td style={{ ...s.td, color: '#888' }}>{movie.year}</td>
                  <td style={{ ...s.td, color: '#888' }}>{(movie.fileSizeBytes / 1e6).toFixed(0)} MB</td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button style={s.editBtn} onClick={() => navigate(`/admin/edit-movie/${movie.id}`)}>
                        <Edit size={14} /> Redigera
                      </button>
                      <button style={s.deleteBtn} onClick={() => deleteMovie(movie.id)}>
                        <Trash2 size={14} /> Ta bort
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <div style={{ background: dark ? '#111a11' : '#fff', border: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}`, borderRadius: 16, overflow: 'hidden' }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Användare</th>
                <th style={s.th}>E-post</th>
                <th style={s.th}>Roll</th>
                <th style={s.th}>Registrerad</th>
                <th style={s.th}>Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={s.tr}>
                  <td style={s.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={s.avatar}>{user.username[0].toUpperCase()}</div>
                      <span style={{ fontWeight: 500 }}>{user.username}</span>
                    </div>
                  </td>
                  <td style={{ ...s.td, color: '#888' }}>{user.email}</td>
                  <td style={s.td}>
                    <span style={s.badge(user.role)}>{user.role}</span>
                  </td>
                  <td style={{ ...s.td, color: '#888' }}>
                    {new Date(user.createdAt).toLocaleDateString('sv-SE')}
                  </td>
                  <td style={s.td}>
                    <div style={s.actions}>
                      <button style={s.roleBtn} onClick={() => updateRole(user.id, user.role === 'Admin' ? 'User' : 'Admin')}>
                        {user.role === 'Admin' ? <><User size={14} /> Gör till User</> : <><Shield size={14} /> Gör till Admin</>}
                      </button>
                      <button style={s.deleteBtn} onClick={() => deleteUser(user.id)}>
                        <Trash2 size={14} /> Ta bort
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}