import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Bell, Sun, Moon, Upload, Settings, ChevronDown } from 'lucide-react';
import logo from '../assets/sts_stream_logo.webp';
import { useState } from 'react';

export default function Navbar({ search, setSearch }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const dark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const s = {
    nav: { display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px', height: 64, background: dark ? '#0d130d' : '#fff', borderBottom: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}`, position: 'sticky', top: 0, zIndex: 100 },
    logo: { height: 36, objectFit: 'contain', cursor: 'pointer', marginRight: 8 },
    searchWrap: { flex: 1, maxWidth: 480, position: 'relative' },
    searchIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#888', width: 18 },
    searchInput: { width: '100%', background: dark ? '#1a2e1a' : '#f0f4f0', border: `1px solid ${dark ? '#2a3e2a' : '#ddd'}`, borderRadius: 24, padding: '10px 16px 10px 44px', color: dark ? '#fff' : '#111', fontSize: 14, outline: 'none' },
    right: { display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: dark ? '#aaa' : '#555', display: 'flex', alignItems: 'center', padding: 6, borderRadius: 8 },
    uploadBtn: { background: '#1db954', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 },
    adminBtn: { background: 'transparent', border: '1px solid #1db954', color: '#1db954', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
    userWrap: { position: 'relative' },
    userBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: dark ? '#fff' : '#111' },
    avatar: { width: 32, height: 32, borderRadius: '50%', background: '#1db954', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#fff' },
    dropdown: { position: 'absolute', right: 0, top: 44, background: dark ? '#1a2e1a' : '#fff', border: `1px solid ${dark ? '#2a3e2a' : '#ddd'}`, borderRadius: 12, padding: 8, minWidth: 160, zIndex: 200 },
    dropItem: { display: 'block', width: '100%', background: 'none', border: 'none', padding: '10px 16px', textAlign: 'left', cursor: 'pointer', color: dark ? '#fff' : '#111', fontSize: 14, borderRadius: 8 },
  };

  return (
    <nav style={s.nav}>
      <img src={logo} alt="STS Stream" style={s.logo} onClick={() => navigate('/')} />

      <div style={s.searchWrap}>
        <Search style={s.searchIcon} size={18} />
        <input
          style={s.searchInput}
          placeholder="Sök filmer, serier, artister..."
          value={search || ''}
          onChange={e => setSearch && setSearch(e.target.value)}
        />
      </div>

      <div style={s.right}>
        {user?.role === 'Admin' && (
          <>
            <button style={s.uploadBtn} onClick={() => navigate('/upload')}>
              <Upload size={16} /> Ladda upp film
            </button>
            <button style={s.adminBtn} onClick={() => navigate('/admin')}>
              Admin-panel
            </button>
          </>
        )}

        <button style={s.iconBtn} onClick={toggleTheme}>
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button style={s.iconBtn}>
          <Bell size={20} />
        </button>

        <div style={s.userWrap}>
          <button style={s.userBtn} onClick={() => setShowMenu(!showMenu)}>
            <div style={s.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
            <span style={{ fontSize: 14 }}>{user?.username}</span>
            <ChevronDown size={16} />
          </button>

          {showMenu && (
            <div style={s.dropdown}>
              <button style={s.dropItem} onClick={() => { navigate('/settings'); setShowMenu(false); }}>
                ⚙️ Inställningar
              </button>
              <button style={{ ...s.dropItem, color: '#ef4444' }} onClick={handleLogout}>
                🚪 Logga ut
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}