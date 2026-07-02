import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext as NavIcon, Construction as ConstructionIcon } from '@mui/icons-material';

export default function ComingSoonPage({ module = 'Module', page = 'Feature' }) {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>{page}</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>{module}</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{page}</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: 400, gap: 2, textAlign: 'center',
        border: '2px dashed', borderColor: 'divider', borderRadius: 3,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
      }}>
        <ConstructionIcon sx={{ fontSize: 64, color: 'warning.main', opacity: 0.6 }} />
        <Typography variant="h5" fontWeight={700} color="text.primary">{page}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          This module is under active development as part of the Shree Shakti Mechanical ERP system. It will be available in the next sprint release.
        </Typography>
        <Typography variant="caption" color="text.disabled">Module: {module} › {page}</Typography>
      </Box>
    </Box>
  );
}
