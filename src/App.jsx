import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import UploadPage from './pages/UploadPage';
import AdminPage from './pages/AdminPage';
import EditMoviePage from './pages/EditMoviePage';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'Admin') return <Navigate to="/" />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/watch/:id" element={<ProtectedRoute><WatchPage /></ProtectedRoute>} />
        <Route path="/upload" element={<AdminRoute><UploadPage /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin/edit-movie/:id" element={<AdminRoute><EditMoviePage /></AdminRoute>} />
      </Routes>
    </>
  );
  
}