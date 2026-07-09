/**
 * AppRoutes.jsx
 * ──────────────────────────────────────────────────────────────
 * Renders the full route tree by consuming the route config
 * from `routes.jsx`. This file owns the JSX structure
 * (<Routes>, <Route>, <Navigate>) while routes.jsx owns
 * the page ↔ path mapping.
 *
 * ProtectedRoute is also defined here because it is a
 * routing concern (redirect logic), not a UI component.
 * ──────────────────────────────────────────────────────────────
 */

import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../components/layout/MainLayout';
import { publicRoutes, userRoutes, adminRoutes } from './routes';

// ─── Route Guard ──────────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, currentUser, authLoading } = useSelector((s) => s.erp);

  if (authLoading) return null;

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return currentUser?.role === 'User'
      ? <Navigate to="/user/dashboard" replace />
      : <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

// ─── Route Tree ───────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public (no auth) ── */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* ── User (role: User) ── */}
      {userRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute allowedRoles={['User']}>
              {element}
            </ProtectedRoute>
          }
        />
      ))}

      {/* ── Admin (role: Admin) — nested inside MainLayout ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />

        {adminRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
  );
}
