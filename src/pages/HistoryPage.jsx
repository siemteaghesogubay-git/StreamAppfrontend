import { useTheme } from '../context/ThemeContext';
import { Clock } from 'lucide-react';

export default function HistoryPage() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div style={{ padding: '32px 24px', color: dark ? '#fff' : '#111' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Historik</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 40 }}>Filmer du har tittat på.</p>

      <div style={{ textAlign: 'center', marginTop: 80 }}>
        <Clock size={48} color="#1db954" style={{ marginBottom: 16 }} />
        <p style={{ color: '#888', fontSize: 15 }}>Ingen historik än.</p>
        <p style={{ color: '#666', fontSize: 13, marginTop: 8 }}>Börja titta på filmer så visas de här.</p>
      </div>
    </div>
  );
}