import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Film, Music, BookOpen, Heart, Clock, Settings } from 'lucide-react';

const links = [
  { icon: Home, label: 'Hem', path: '/' },
  { icon: Film, label: 'Filmer', path: '/?genre=Movie' },
  { icon: Music, label: 'Musik', path: '/?genre=Music' },
  { icon: BookOpen, label: 'Mezmur', path: '/?genre=Mezmur' },
  { icon: BookOpen, label: 'Ljudböcker', path: '/?genre=Audio Book' },
  { icon: Heart, label: 'Min lista', path: '/my-list' },
  { icon: Clock, label: 'Historik', path: '/history' },
  { icon: Settings, label: 'Inställningar', path: '/settings' },
];

export default function Sidebar() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dark = theme === 'dark';

  const s = {
    sidebar: { width: 200, minHeight: 'calc(100vh - 64px)', background: dark ? '#0d130d' : '#fff', borderRight: `1px solid ${dark ? '#1a2e1a' : '#e0e0e0'}`, padding: '16px 0', position: 'sticky', top: 64, alignSelf: 'flex-start' },
    link: (active) => ({ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', cursor: 'pointer', background: active ? (dark ? '#1a2e1a' : '#e8f5e9') : 'transparent', color: active ? '#1db954' : (dark ? '#aaa' : '#555'), borderLeft: active ? '3px solid #1db954' : '3px solid transparent', fontSize: 14, fontWeight: active ? 500 : 400, transition: 'all 0.15s' }),
  };

  return (
    <aside style={s.sidebar}>
      {links.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path || location.search.includes(path.split('=')[1]);
        return (
          <div key={label} style={s.link(active)} onClick={() => navigate(path)}>
            <Icon size={18} />
            {label}
          </div>
        );
      })}
    </aside>
  );
}