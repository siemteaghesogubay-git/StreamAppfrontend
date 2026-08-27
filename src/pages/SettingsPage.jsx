import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const dark = theme === 'dark';

  const s = {
    page: { padding: '32px 24px', color: dark ? '#fff' : '#111', maxWidth: 600 },
    title: { fontSize: 22, fontWeight: 600, marginBottom: 32 },
    section: { background: dark ? '#111a11' : '#fff', border: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}`, borderRadius: 12, padding: '20px 24px', marginBottom: 16 },
    sectionTitle: { fontSize: 14, fontWeight: 600, color: '#888', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${dark ? '#1a2e1a' : '#f0f0f0'}` },
    label: { fontSize: 15 },
    value: { fontSize: 14, color: '#888' },
    toggleBtn: { background: dark ? '#1a2e1a' : '#e8f5e9', border: 'none', color: dark ? '#fff' : '#111', padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 },
    themeBtn: { background: '#1db954', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <h2 style={s.title}>Inställningar</h2>

      <div style={s.section}>
        <p style={s.sectionTitle}>Konto</p>
        <div style={s.row}>
          <span style={s.label}>Användarnamn</span>
          <span style={s.value}>{user?.username}</span>
        </div>
        <div style={{ ...s.row, borderBottom: 'none' }}>
          <span style={s.label}>Roll</span>
          <span style={{ ...s.value, color: user?.role === 'Admin' ? '#1db954' : '#888' }}>{user?.role}</span>
        </div>
      </div>

      <div style={s.section}>
        <p style={s.sectionTitle}>Utseende</p>
        <div style={{ ...s.row, borderBottom: 'none' }}>
          <div>
            <p style={s.label}>Tema</p>
            <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
              {dark ? 'Mörkt läge aktivt' : 'Ljust läge aktivt'}
            </p>
          </div>
          <button style={s.themeBtn} onClick={toggleTheme}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            {dark ? 'Byt till ljust' : 'Byt till mörkt'}
          </button>
        </div>
      </div>

      <div style={s.section}>
        <p style={s.sectionTitle}>Prenumeration</p>
        <div style={{ ...s.row, borderBottom: 'none' }}>
          <div>
            <p style={s.label}>Status</p>
            <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Ingen aktiv prenumeration</p>
          </div>
          <button style={s.themeBtn}>Uppgradera</button>
        </div>
      </div>
    </div>
  );
}