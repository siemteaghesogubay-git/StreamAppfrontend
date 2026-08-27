import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import UploadPage from './pages/UploadPage';
import AdminPage from './pages/AdminPage';
import EditMoviePage from './pages/EditMoviePage';
import MyListPage from './pages/MyListPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

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

function Layout({ children, search, setSearch }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <div style={{ background: dark ? '#0a0f0a' : '#f0f4f0', minHeight: '100vh' }}>
      <Navbar search={search} setSearch={setSearch} />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState('');

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout search={search} setSearch={setSearch}>
            <HomePage search={search} setSearch={setSearch} />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/watch/:id" element={
        <ProtectedRoute>
          <Layout search={search} setSearch={setSearch}>
            <WatchPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/upload" element={
        <AdminRoute>
          <Layout search={search} setSearch={setSearch}>
            <UploadPage />
          </Layout>
        </AdminRoute>
      } />
      <Route path="/admin" element={
        <AdminRoute>
          <Layout search={search} setSearch={setSearch}>
            <AdminPage />
          </Layout>
        </AdminRoute>
      } />
      <Route path="/admin/edit-movie/:id" element={
        <AdminRoute>
          <Layout search={search} setSearch={setSearch}>
            <EditMoviePage />
          </Layout>
        </AdminRoute>
      } />
      <Route path="/my-list" element={
        <ProtectedRoute>
          <Layout search={search} setSearch={setSearch}>
            <MyListPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <Layout search={search} setSearch={setSearch}>
            <HistoryPage />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout search={search} setSearch={setSearch}>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}