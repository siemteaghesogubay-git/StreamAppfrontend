import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  const dark = theme === 'dark';

  const [streamUrl, setStreamUrl] = useState(null);
  const [movieInfo, setMovieInfo] = useState(null);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);

  const [form, setForm] = useState({
    rating: 5,
    comment: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMovie();
    loadReviews();
  }, [id]);

  const loadMovie = async () => {
    try {
      const movieRes = await api.get('/movie/all');

      const movie = movieRes.data.find(
        m => m.id === parseInt(id)
      );

      if (movie) {
        setMovieInfo(movie);

        // Extern video
        if (movie.isExternal && movie.externalUrl) {
          setStreamUrl(movie.externalUrl);
          return;
        }
      }

      // Lokal stream-token
      const tokenRes = await api.get(
        `/movie/${id}/stream-token`
      );

      setStreamUrl(tokenRes.data.streamUrl);
    } catch (err) {
      setError('Kunde inte ladda filmen.');
    }
  };

  const loadReviews = async () => {
    try {
      const reviewsRes = await api.get(
        `/movie/${id}/reviews`
      );

      setReviews(reviewsRes.data);

      const avgRes = await api.get(
        `/movie/${id}/reviews/average`
      );

      setAverage(avgRes.data.average);
    } catch {
      console.error('Kunde inte hämta reviews');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const res = await api.post(
        `/movie/${id}/reviews`,
        form
      );

      setReviews(prev => [
        res.data,
        ...prev.filter(
          r => r.username !== user.username
        )
      ]);

      const avgRes = await api.get(
        `/movie/${id}/reviews/average`
      );

      setAverage(avgRes.data.average);

      setForm({
        rating: 5,
        comment: ''
      });
    } catch {
      setError('Kunde inte skicka omdöme.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await api.delete(
        `/movie/${id}/reviews/${reviewId}`
      );

      setReviews(prev =>
        prev.filter(r => r.id !== reviewId)
      );
    } catch {
      setError('Kunde inte ta bort omdöme.');
    }
  };

  const renderStars = (rating) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  // UPPDATERAD getEmbedUrl
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // youtube.com/watch?v=VIDEO_ID
    if (url.includes('youtube.com/watch')) {
      try {
        const videoId =
          new URL(url).searchParams.get('v');

        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      } catch {
        return null;
      }
    }

    // youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      const videoId =
        url.split('youtu.be/')[1].split('?')[0];

      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    // youtube.com/embed/VIDEO_ID
    if (url.includes('youtube.com/embed/')) {
      return url.includes('autoplay')
        ? url
        : `${url}?autoplay=1&rel=0`;
    }

    // youtube.com/shorts/VIDEO_ID
    if (url.includes('youtube.com/shorts/')) {
      const videoId =
        url.split('shorts/')[1].split('?')[0];

      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    // vimeo.com/VIDEO_ID
    if (url.includes('vimeo.com/')) {
      const videoId =
        url.split('vimeo.com/')[1].split('?')[0];

      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }

    return null;
  };

  const embedUrl = getEmbedUrl(streamUrl);

  const useIframe =
    streamUrl?.includes('youtube.com') ||
    streamUrl?.includes('youtu.be') ||
    streamUrl?.includes('vimeo.com');

  const s = {
    page: {
      minHeight: '100vh',
      background: dark ? '#0a0f0a' : '#f0f4f0',
      color: dark ? '#fff' : '#111'
    },

    header: {
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    },

    backBtn: {
      background: 'none',
      border: 'none',
      color: dark ? '#888' : '#555',
      cursor: 'pointer',
      fontSize: 15,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },

    movieTitle: {
      fontSize: 18,
      fontWeight: 600
    },

    playerWrap: {
      display: 'flex',
      justifyContent: 'center',
      padding: '0 24px 24px'
    },

    video: {
      width: '100%',
      maxWidth: 960,
      borderRadius: 12,
      background: '#000',
      aspectRatio: '16/9'
    },

    iframe: {
      width: '100%',
      maxWidth: 960,
      aspectRatio: '16/9',
      borderRadius: 12,
      border: 'none'
    },

    reviewSection: {
      maxWidth: 960,
      margin: '0 auto',
      padding: '0 24px 40px'
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button
          style={s.backBtn}
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          Tillbaka
        </button>

        {movieInfo && (
          <span style={s.movieTitle}>
            {movieInfo.title}
          </span>
        )}
      </div>

      {error && (
        <p
          style={{
            color: '#f87171',
            textAlign: 'center'
          }}
        >
          {error}
        </p>
      )}

      {streamUrl ? (
        <div style={s.playerWrap}>
          {useIframe ? (
            <iframe
              style={s.iframe}
              src={embedUrl}
              allowFullScreen
              allow="autoplay; encrypted-media"
              title="Movie player"
            />
          ) : (
            <video
              style={s.video}
              controls
              autoPlay
              src={streamUrl}
            />
          )}
        </div>
      ) : (
        <p
          style={{
            color: '#888',
            textAlign: 'center'
          }}
        >
          Laddar...
        </p>
      )}
    </div>
  );
}