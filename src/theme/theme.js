import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#60a5fa' : '#1b3a57',
        light: isDark ? '#93c5fd' : '#2c5282',
        dark: isDark ? '#3b82f6' : '#102a43',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#94a3b8' : '#475569',
        light: isDark ? '#cbd5e1' : '#64748b',
        dark: isDark ? '#475569' : '#334155',
        contrastText: '#ffffff',
      },
      warning: {
        main: isDark ? '#f59e0b' : '#d97706',
        light: isDark ? '#fbbf24' : '#f59e0b',
        dark: isDark ? '#d97706' : '#b45309',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#121212' : '#f4f6f8',
        paper: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#111827',
        secondary: isDark ? '#94a3b8' : '#6b7280',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2.5rem', fontWeight: 600 },
      h2: { fontSize: '2rem', fontWeight: 600 },
      h3: { fontSize: '1.75rem', fontWeight: 600 },
      h4: { fontSize: '1.5rem', fontWeight: 600 },
      h5: { fontSize: '1.25rem', fontWeight: 600 },
      h6: { fontSize: '1rem', fontWeight: 600 },
      subtitle1: { fontSize: '1rem', fontWeight: 500 },
      subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
      body1: { fontSize: '1rem', lineHeight: 1.5 },
      body2: { fontSize: '0.875rem', lineHeight: 1.43 },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#121212' : '#f4f6f8',
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: '6px', height: '6px' },
            '&::-webkit-scrollbar-track': { background: isDark ? '#121212' : '#f4f6f8' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: isDark ? '#424242' : '#c1c1c1', borderRadius: '4px' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            backgroundImage: 'none',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
            boxShadow: isDark 
              ? '0 2px 4px rgba(0,0,0,0.5)' 
              : '0 2px 8px rgba(0, 0, 0, 0.04)',
            transition: 'box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: isDark 
                ? '0 4px 8px rgba(0,0,0,0.6)' 
                : '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '6px', 
            padding: '8px 16px', 
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          containedPrimary: {
            backgroundColor: isDark ? '#60a5fa' : '#1b3a57',
            '&:hover': { backgroundColor: isDark ? '#3b82f6' : '#12263b' },
          },
          containedWarning: {
            backgroundColor: isDark ? '#f59e0b' : '#d97706',
            '&:hover': { backgroundColor: isDark ? '#d97706' : '#b45309' },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { 
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff', 
            borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`, 
            color: isDark ? '#94a3b8' : '#4b5563' 
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: 'none', 
            color: isDark ? '#f8fafc' : '#111827',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: isDark ? '#2d2d2d' : '#f9fafb',
            color: isDark ? '#e5e7eb' : '#4b5563',
            fontWeight: 600, 
            fontSize: '0.8125rem', 
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`,
          },
          body: { 
            padding: '12px 16px', 
            fontSize: '0.875rem', 
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.04)'}` 
          },
        },
      },
    },
  });
};
