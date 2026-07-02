import { useSelector } from 'react-redux';
import { Box, Typography, Breadcrumbs, Link, Chip } from '@mui/material';
import { NavigateNext as NavIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';

const statusColors = { Passed: 'success', Rejected: 'error', Pending: 'warning' };

export default function IncomingInspectionPage() {
  const qcInspections = useSelector(s => s.erp.qcInspections);

  const columns = [
    { id: 'id', label: 'Inspection ID', width: 120 },
    { id: 'source', label: 'GRN Reference' },
    { id: 'date', label: 'Date' },
    { id: 'inspector', label: 'Inspector' },
    { id: 'item', label: 'Material Description' },
    { id: 'quantity', label: 'Qty' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'heatNo', label: 'Heat No.' },
    { id: 'mtrNo', label: 'MTR No.' },
    { id: 'status', label: 'QC Result', render: (row) => (
      <Chip label={row.status} size="small" color={statusColors[row.status] || 'default'} sx={{ fontWeight: 700 }} />
    )},
    { id: 'deviation', label: 'Deviation / Remarks', render: (row) => (
      <Typography variant="caption" color={row.deviation === 'None' ? 'text.secondary' : 'error.main'} fontWeight={row.deviation === 'None' ? 400 : 700}>
        {row.deviation}
      </Typography>
    )},
    { id: 'ncrNo', label: 'NCR No.', render: (row) => row.ncrNo
      ? <Chip label={row.ncrNo} size="small" color="error" variant="outlined" sx={{ fontWeight: 600 }} />
      : <Typography variant="caption" color="text.secondary">-</Typography>
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Incoming Inspection (QC)</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>Quality Control</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Incoming Inspection</Typography>
        </Breadcrumbs>
      </Box>
      <DataTable title="Inspection Register" columns={columns} data={qcInspections} searchPlaceholder="Search inspection ID, material, vendor..." />
    </Box>
  );
}
