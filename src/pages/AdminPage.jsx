import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminPage() {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('movies');
  const navigate = useNavigate();

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

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Admin-panel</h2>

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(tab === 'movies' ? styles.activeTab : {}) }}
          onClick={() => setTab('movies')}>
          Filmer
        </button>
        <button
          style={{ ...styles.tab, ...(tab === 'users' ? styles.activeTab : {}) }}
          onClick={() => setTab('users')}>
          Användare
        </button>
      </div>

      {tab === 'movies' && (
        <div style={styles.list}>
          {movies.map(movie => (
            <div key={movie.id} style={styles.item}>
              <div>
                <p style={styles.itemTitle}>{movie.title}</p>
                <p style={styles.itemMeta}>{movie.genre} · {movie.year}</p>
                <p style={styles.itemMeta}>{movie.description}</p>
              </div>
              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => navigate(`/admin/edit-movie/${movie.id}`)}>
                  Redigera
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteMovie(movie.id)}>
                  Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div style={styles.list}>
          {users.map(user => (
            <div key={user.id} style={styles.item}>
              <div>
                <p style={styles.itemTitle}>{user.username}</p>
                <p style={styles.itemMeta}>{user.email}</p>
                <p style={styles.itemMeta}>Roll: <strong>{user.role}</strong></p>
              </div>
              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => updateRole(user.id, user.role === 'Admin' ? 'User' : 'Admin')}>
                  {user.role === 'Admin' ? 'Gör till User' : 'Gör till Admin'}
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteUser(user.id)}>
                  Ta bort
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


const styles = {
  page: { padding: '32px 24px', background: '#0a0a0f', minHeight: '100vh', color: '#fff' },
  title: { fontSize: 22, fontWeight: 500, marginBottom: 24 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: { background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  activeTab: { background: '#7c3aed', border: '1px solid #7c3aed', color: '#fff' },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  item: { background: '#111118', border: '1px solid #1a1a2e', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: 500, margin: '0 0 4px' },
  itemMeta: { fontSize: 13, color: '#666', margin: '0 0 2px' },
  actions: { display: 'flex', gap: 8 },
  editBtn: { background: 'transparent', border: '1px solid #7c3aed', color: '#a855f7', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 },
  deleteBtn: { background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13 },

};