import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        zIndex: 9999,
        transition: 'opacity 0.3s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <CircularProgress
          size={50}
          thickness={4}
          sx={{
            color: 'primary.main',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            letterSpacing: '0.05em',
            animation: 'pulse 1.5s infinite ease-in-out',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 1 },
            },
          }}
        >
          Shree Shakti Engineering Works
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            marginTop: -1,
          }}
        >
          Loading ERP Panel...
        </Typography>
      </Box>
    </Box>
  );
}
