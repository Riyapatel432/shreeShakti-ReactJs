import { useSelector } from 'react-redux';
import { Box, Typography, Breadcrumbs, Link, Chip } from '@mui/material';
import { NavigateNext as NavIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';

export default function AuditLogsPage() {
  const auditLogs = useSelector(s => s.erp.auditLogs);

  const moduleColors = { Purchase: 'success', Inventory: 'secondary', 'Quality Control': 'error', Production: 'warning', Master: 'primary', HR: 'info' };

  const columns = [
    { id: 'timestamp', label: 'Timestamp', width: 160 },
    { id: 'user', label: 'User (Email)' },
    { id: 'module', label: 'Module', render: (row) => (
      <Chip label={row.module} size="small" color={moduleColors[row.module] || 'default'} sx={{ fontWeight: 600 }} />
    )},
    { id: 'action', label: 'Action Performed' },
    { id: 'ipAddress', label: 'IP Address', width: 130 },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Audit Logs</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>System Settings</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Audit Logs</Typography>
        </Breadcrumbs>
      </Box>
      <DataTable title="System Audit Trail" columns={columns} data={auditLogs.map((l, i) => ({ ...l, id: i }))}
        searchPlaceholder="Search user, module, action..." />
    </Box>
  );
}
