import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Upload, Link, Film } from 'lucide-react';
import api from '../services/api';

export default function UploadPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '',
    year: '',
    externalUrl: ''
  });

  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [uploadType, setUploadType] = useState('file');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { theme } = useTheme();

  const dark = theme === 'dark';

  const navigate = useNavigate();

  const handleThumbnail = (e) => {
    const f = e.target.files[0];

    if (!f) return;

    setThumbnail(f);

    setThumbnailPreview(
      URL.createObjectURL(f)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadType === 'file' && !file) {
      return setError('Välj en videofil.');
    }

    if (
      uploadType === 'url' &&
      !form.externalUrl
    ) {
      return setError('Ange en URL.');
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();

      formData.append('title', form.title);
      formData.append(
        'description',
        form.description
      );
      formData.append('genre', form.genre);
      formData.append('year', form.year);

      // Filuppladdning
      if (uploadType === 'file' && file) {
        formData.append('file', file);
      }

      // Extern URL
      if (uploadType === 'url') {
        formData.append(
          'externalUrl',
          form.externalUrl
        );
      }

      // Thumbnail
      if (thumbnail) {
        formData.append(
          'thumbnail',
          thumbnail
        );
      }

      await api.post(
        '/movie/upload',
        formData
      );

      navigate('/');
    } catch (err) {
      console.error(err);

      setError(
        'Uppladdningen misslyckades.'
      );
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '40px 24px',
      background: dark
        ? '#0a0f0a'
        : '#f0f4f0'
    },

    box: {
      background: dark
        ? '#111a11'
        : '#fff',

      border: `1px solid ${
        dark
          ? '#1a2e1a'
          : '#e0e0e0'
      }`,

      borderRadius: 20,

      padding: '40px 36px',

      width: '100%',
      maxWidth: 520
    },

    title: {
      fontSize: 22,
      fontWeight: 700,
      color: dark ? '#fff' : '#111',
      marginBottom: 4
    },

    subtitle: {
      fontSize: 14,
      color: '#888',
      marginBottom: 32
    },

    typeTabs: {
      display: 'flex',
      gap: 8,
      marginBottom: 28,
      background: dark
        ? '#0a0f0a'
        : '#f0f4f0',
      borderRadius: 10,
      padding: 4
    },

    typeTab: (active) => ({
      flex: 1,

      background: active
        ? '#1db954'
        : 'transparent',

      border: 'none',

      color: active
        ? '#fff'
        : '#888',

      padding: '10px 16px',

      borderRadius: 8,

      cursor: 'pointer',

      fontSize: 14,

      fontWeight: active
        ? 600
        : 400,

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }),

    label: {
      display: 'block',
      fontSize: 13,
      fontWeight: 500,

      color: dark
        ? 'rgba(255,255,255,0.7)'
        : '#555',

      marginBottom: 8,
      marginTop: 16
    },

    input: {
      width: '100%',

      background: dark
        ? 'rgba(255,255,255,0.05)'
        : '#f8f8f8',

      border: `1px solid ${
        dark
          ? 'rgba(255,255,255,0.1)'
          : '#e0e0e0'
      }`,

      borderRadius: 10,

      padding: '11px 14px',

      color: dark ? '#fff' : '#111',

      fontSize: 14,

      boxSizing: 'border-box',

      outline: 'none'
    },

    select: {
      width: '100%',

      background: dark
        ? 'rgba(255,255,255,0.05)'
        : '#f8f8f8',

      border: `1px solid ${
        dark
          ? 'rgba(255,255,255,0.1)'
          : '#e0e0e0'
      }`,

      borderRadius: 10,

      padding: '11px 14px',

      color: dark ? '#fff' : '#111',

      fontSize: 14,

      boxSizing: 'border-box'
    },

    previewImg: {
      width: '100%',
      aspectRatio: '16/9',
      objectFit: 'cover',
      borderRadius: 10,
      marginBottom: 8
    },

    fileZone: {
      border: `2px dashed ${
        dark
          ? '#2a3e2a'
          : '#ddd'
      }`,

      borderRadius: 10,

      padding: '24px',

      textAlign: 'center',

      cursor: 'pointer',

      marginTop: 8
    },

    urlInfo: {
      background:
        'rgba(29,185,84,0.05)',

      border:
        '1px solid rgba(29,185,84,0.2)',

      borderRadius: 10,

      padding: '12px 16px',

      marginTop: 8,

      fontSize: 13,

      color: '#888'
    },

    submitBtn: {
      width: '100%',

      background: '#1db954',

      border: 'none',

      color: '#fff',

      padding: '14px',

      borderRadius: 10,

      fontSize: 15,

      fontWeight: 600,

      cursor: 'pointer',

      marginTop: 24,

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    },

    error: {
      background:
        'rgba(239,68,68,0.1)',

      border:
        '1px solid rgba(239,68,68,0.3)',

      borderRadius: 8,

      padding: '10px 14px',

      color: '#f87171',

      fontSize: 13,

      marginBottom: 16
    }
  };

  return (
    <div style={s.page}>
      <div style={s.box}>
        <h2 style={s.title}>
          Ladda upp film
        </h2>

        <p style={s.subtitle}>
          Ladda upp en fil eller länka
          från en extern källa
        </p>

        {error && (
          <div style={s.error}>
            {error}
          </div>
        )}

        <div style={s.typeTabs}>
          <button
            type="button"
            style={s.typeTab(
              uploadType === 'file'
            )}
            onClick={() =>
              setUploadType('file')
            }
          >
            <Upload size={16} />
            Ladda upp fil
          </button>

          <button
            type="button"
            style={s.typeTab(
              uploadType === 'url'
            )}
            onClick={() =>
              setUploadType('url')
            }
          >
            <Link size={16} />
            Extern URL
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={s.label}>
            Titel
          </label>

          <input
            style={s.input}
            placeholder="Filmens titel"
            value={form.title}
            onChange={e =>
              setForm({
                ...form,
                title: e.target.value
              })
            }
            required
          />

          <label style={s.label}>
            Beskrivning
          </label>

          <textarea
            style={{
              ...s.input,
              height: 80,
              resize: 'vertical'
            }}
            placeholder="Kort beskrivning..."
            value={form.description}
            onChange={e =>
              setForm({
                ...form,
                description:
                  e.target.value
              })
            }
          />

          <label style={s.label}>
            Genre
          </label>

          <select
            style={s.select}
            value={form.genre}
            onChange={e =>
              setForm({
                ...form,
                genre: e.target.value
              })
            }
            required
          >
            <option value="">
              Välj genre
            </option>

            <option value="Movie">
              Movie
            </option>

            <option value="Music">
              Music
            </option>

            <option value="Comedy">
              Comedy
            </option>

            <option value="Mezmur">
              Mezmur
            </option>

            <option value="Audio Book">
              Audio Book
            </option>

            <option value="Drama">
              Drama
            </option>

            <option value="Historical">
              Historical
            </option>
          </select>

          <label style={s.label}>
            År
          </label>

          <input
            style={s.input}
            placeholder="2024"
            type="number"
            min="1900"
            max="2030"
            value={form.year}
            onChange={e =>
              setForm({
                ...form,
                year: e.target.value
              })
            }
            required
          />

          <label style={s.label}>
            Omslagsbild
          </label>

          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Preview"
              style={s.previewImg}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnail}
            style={{
              color: dark
                ? '#888'
                : '#555',

              fontSize: 13,

              marginTop: 4
            }}
          />

          {uploadType === 'file' ? (
            <>
              <label style={s.label}>
                Videofil
              </label>

              <div
                style={s.fileZone}
                onClick={() =>
                  document
                    .getElementById(
                      'videoInput'
                    )
                    .click()
                }
              >
                <Film
                  size={32}
                  color="#1db954"
                  style={{
                    marginBottom: 8
                  }}
                />

                <p
                  style={{
                    color: dark
                      ? '#fff'
                      : '#111',

                    fontSize: 14,

                    margin:
                      '0 0 4px'
                  }}
                >
                  {file
                    ? file.name
                    : 'Klicka för att välja fil'}
                </p>

                <p
                  style={{
                    color: '#888',
                    fontSize: 12
                  }}
                >
                  MP4, MOV, MKV,
                  AVI — upp till
                  10 GB
                </p>

                <input
                  id="videoInput"
                  type="file"
                  accept="video/*"
                  style={{
                    display: 'none'
                  }}
                  onChange={e =>
                    setFile(
                      e.target.files[0]
                    )
                  }
                />
              </div>
            </>
          ) : (
            <>
              <label style={s.label}>
                Extern video-URL
              </label>

              <input
                style={s.input}
                placeholder="https://youtube.com/watch?v=..."
                value={form.externalUrl}
                onChange={e =>
                  setForm({
                    ...form,
                    externalUrl:
                      e.target.value
                  })
                }
              />

              <div style={s.urlInfo}>
                <p
                  style={{
                    margin:
                      '0 0 8px',

                    fontWeight: 600,

                    color: dark
                      ? '#fff'
                      : '#333'
                  }}
                >
                  Stödda
                  YouTube-format:
                </p>

                <p
                  style={{
                    margin:
                      '0 0 4px'
                  }}
                >
                  •
                  https://www.youtube.com/watch?v=VIDEO_ID
                </p>

                <p
                  style={{
                    margin:
                      '0 0 4px'
                  }}
                >
                  •
                  https://youtu.be/VIDEO_ID
                </p>

                <p
                  style={{
                    margin:
                      '0 0 4px'
                  }}
                >
                  •
                  https://www.youtube.com/shorts/VIDEO_ID
                </p>

                <p
                  style={{
                    margin:
                      '0 0 12px'
                  }}
                >
                  •
                  https://vimeo.com/VIDEO_ID
                </p>

                <p
                  style={{
                    margin:
                      '0 0 4px',

                    fontWeight: 600,

                    color: dark
                      ? '#fff'
                      : '#333'
                  }}
                >
                  Tips:
                </p>

                <p style={{ margin: 0 }}>
                  Kopiera länken
                  direkt från
                  YouTube — alla
                  format fungerar!
                </p>
              </div>
            </>
          )}

          <button
            style={s.submitBtn}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              'Laddar upp...'
            ) : (
              <>
                <Upload size={18} />
                Publicera film
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
