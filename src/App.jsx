import { useMemo, useEffect } from 'react';
import axios from 'axios';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { V_URL } from './baseUrl';
import { store } from './redux/store';
import { getTheme } from './theme/theme';
import { login, setAuthLoading } from './redux/slices/erpSlice';
import AppRoutes from './routes/AppRoutes';

// ─── Themed App ───────────────────────────────────────────────
// Handles theme selection and the initial auth check (cookie restore).
// Route rendering is fully delegated to <AppRoutes />.
function ThemedApp() {
  const dispatch   = useDispatch();
  const themeMode  = useSelector((s) => s.erp.themeMode);
  const theme      = useMemo(() => getTheme(themeMode), [themeMode]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${V_URL}/auth/get-profile`,
          { withCredentials: true }
        );
        if (res.data.success) dispatch(login(res.data.user));
      } catch {
        console.log('Not authenticated');
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

// ─── Root App ─────────────────────────────────────────────────
// Wraps everything in the Redux Provider.
export default function App() {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
}
