import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/sts_stream_logo.webp';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <img
        src={logo}
        alt="STS Stream"
        style={{ height: 48, objectFit: 'contain', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      />
      <div style={styles.navRight}>
        {user?.role === 'Admin' && (
          <button style={styles.uploadBtn} onClick={() => navigate('/upload')}>
            + Ladda upp film
          </button>
        )}
       {user?.role === 'Admin' && (
  <button style={styles.adminBtn} onClick={() => navigate('/admin')}>
    Admin-panel
  </button>
)}
        <span style={styles.username}>{user?.username}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logga ut</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px', background: '#0a0a0f', borderBottom: '1px solid #1a1a2e', position: 'sticky', top: 0, zIndex: 100 },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  username: { color: '#888', fontSize: 14 },
  uploadBtn: { background: '#7c3aed', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  adminBtn: { background: 'transparent', border: '1px solid #7c3aed', color: '#a855f7', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
  logoutBtn: { background: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 },
};