import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [streamUrl, setStreamUrl] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/movie/${id}/stream-token`)
      .then(res => setStreamUrl(res.data.streamUrl))
      .catch(() => setError('Kunde inte ladda filmen.'));
  }, [id]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← Tillbaka</button>
      </div>
      {error && <p style={{ color: '#f87171', textAlign: 'center' }}>{error}</p>}
      {streamUrl ? (
        <div style={styles.playerWrap}>
          <video
            style={styles.video}
            controls
            autoPlay
            src={streamUrl}
          />
        </div>
      ) : (
        !error && <p style={{ color: '#888', textAlign: 'center' }}>Laddar...</p>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#000', color: '#fff' },
  header: { padding: '16px 24px' },
  backBtn: { background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: 15 },
  playerWrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 24px' },
  video: { width: '100%', maxWidth: 960, borderRadius: 12, background: '#000' },
};