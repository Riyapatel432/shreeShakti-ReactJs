import { Box, Grid, Typography, Breadcrumbs, Link, Chip } from '@mui/material';
import { NavigateNext as NavIcon, Circle as CircleIcon } from '@mui/icons-material';
import KPICards from '../components/dashboard/KPICards';
import Charts from '../components/dashboard/Charts';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const { selectedPlant, selectedFinancialYear } = useSelector(s => s.erp);

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.5px', mb: 0.5 }}>
            Operations Dashboard
          </Typography>
          <Breadcrumbs separator={<NavIcon fontSize="small" />} aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>Home</Link>
            <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Dashboard</Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<CircleIcon sx={{ fontSize: '10px !important', color: '#22c55e !important' }} />}
            label="Live Data"
            size="small"
            sx={{ bgcolor: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 600, border: '1px solid rgba(34,197,94,0.3)' }}
          />
          <Chip label={selectedFinancialYear} size="small" variant="outlined" color="primary" sx={{ fontWeight: 600 }} />
        </Box>
      </Box>

      {/* KPI Cards Row */}
      <Box sx={{ mb: 3 }}>
        <KPICards />
      </Box>

      {/* Charts */}
      <Box sx={{ mb: 3 }}>
        <Charts />
      </Box>

      {/* Bottom Row: Activity Timeline */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <ActivityTimeline />
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{
            background: (theme) => theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(30,58,138,0.3) 0%, rgba(249,115,22,0.1) 100%)'
              : 'linear-gradient(135deg, rgba(30,58,138,0.05) 0%, rgba(249,115,22,0.05) 100%)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 3,
            p: 3,
            height: '100%',
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <Typography variant="h2" sx={{ fontSize: '4rem', mb: 1 }}>⚙️</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Quick Access Hub</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Navigate using the left sidebar to access all ERP modules — Purchase, Inventory, Production, Quality, HR & more.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {['📦 Inventory', '🔩 Production', '✅ Quality', '👷 HR', '📊 Reports'].map(item => (
                <Chip key={item} label={item} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
