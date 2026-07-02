import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Breadcrumbs, Link, Chip, Grid, TextField, MenuItem } from '@mui/material';
import { NavigateNext as NavIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import { addPurchaseOrder } from '../../redux/slices/erpSlice';

const statusColors = { Released: 'success', 'Pending Delivery': 'primary', Draft: 'default', 'Under Review': 'warning' };
const approvalColors = { Approved: 'success', 'Pending HOD': 'warning', 'Pending MD': 'error' };

export default function PurchaseOrderPage() {
  const dispatch = useDispatch();
  const { purchaseOrders, vendors, projects } = useSelector(s => s.erp);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ vendor: '', project: '', totalAmount: '', itemsCount: 1 });

  const columns = [
    { id: 'id', label: 'PO Number', width: 140 },
    { id: 'reqNo', label: 'Req. No.', width: 140 },
    { id: 'date', label: 'Date' },
    { id: 'vendor', label: 'Vendor' },
    { id: 'project', label: 'Project' },
    { id: 'totalAmount', label: 'PO Value (₹)', render: (row) => `₹ ${(row.totalAmount / 100000).toFixed(2)} L` },
    { id: 'itemsCount', label: 'Items', width: 70 },
    { id: 'status', label: 'PO Status', render: (row) => <Chip label={row.status} size="small" color={statusColors[row.status] || 'default'} sx={{ fontWeight: 600 }} /> },
    { id: 'approvalStatus', label: 'Approval', render: (row) => <Chip label={row.approvalStatus} size="small" color={approvalColors[row.approvalStatus] || 'default'} variant="outlined" /> },
  ];

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    dispatch(addPurchaseOrder({
      id: `PO-2026-00${purchaseOrders.length + 46}`,
      reqNo: `PR-2026-00${purchaseOrders.length + 121}`,
      date: today, vendor: form.vendor, project: form.project,
      totalAmount: Number(form.totalAmount), status: 'Draft',
      approvalStatus: 'Pending HOD', itemsCount: Number(form.itemsCount)
    }));
    setModalOpen(false);
    setForm({ vendor: '', project: '', totalAmount: '', itemsCount: 1 });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Purchase Orders</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>Purchase Management</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Purchase Order</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable title="Purchase Order Register" columns={columns} data={purchaseOrders}
        searchPlaceholder="Search PO number, vendor..." onAddClick={() => setModalOpen(true)} addLabel="New PO" />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Purchase Order" onSubmit={handleSubmit} submitLabel="Create PO">
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField select fullWidth label="Vendor" value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} required>
            {vendors.map(v => <MenuItem key={v.id} value={v.name}>{v.name}</MenuItem>)}
          </TextField></Grid>
          <Grid item xs={12}><TextField select fullWidth label="Project" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} required>
            {projects.map(p => <MenuItem key={p.id} value={p.name}>{p.name}</MenuItem>)}
          </TextField></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Total Amount (₹)" value={form.totalAmount} onChange={e => setForm({ ...form, totalAmount: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="No. of Line Items" value={form.itemsCount} onChange={e => setForm({ ...form, itemsCount: e.target.value })} inputProps={{ min: 1 }} /></Grid>
        </Grid>
      </FormModal>
    </Box>
  );
}
