import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Breadcrumbs, Link, Chip, Grid, TextField, MenuItem } from '@mui/material';
import { NavigateNext as NavIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import { addMaterial } from '../../redux/slices/erpSlice';

export default function MaterialsPage() {
  const dispatch = useDispatch();
  const materials = useSelector(s => s.erp.materials);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ code: '', description: '', category: '', uom: 'MT', stock: '', minStock: '', unitPrice: '', bin: '' });

  const columns = [
    { id: 'code', label: 'Material Code', width: 200 },
    { id: 'description', label: 'Description' },
    { id: 'category', label: 'Category', render: (row) => <Chip label={row.category} size="small" variant="outlined" color="secondary" /> },
    { id: 'uom', label: 'UOM', width: 70 },
    { id: 'stock', label: 'Stock Qty', render: (row) => (
      <Typography variant="body2" color={row.stock < row.minStock ? 'error.main' : 'text.primary'} fontWeight={row.stock < row.minStock ? 700 : 400}>
        {row.stock} {row.uom}
      </Typography>
    )},
    { id: 'minStock', label: 'Min Stock', render: (row) => `${row.minStock} ${row.uom}` },
    { id: 'unitPrice', label: 'Unit Price (₹)', render: (row) => `₹ ${row.unitPrice.toLocaleString('en-IN')}` },
    { id: 'bin', label: 'Bin Location' },
  ];

  const handleSubmit = () => {
    dispatch(addMaterial({
      id: `MAT-${String(materials.length + 1).padStart(3, '0')}`,
      code: form.code, description: form.description, category: form.category,
      uom: form.uom, stock: Number(form.stock), minStock: Number(form.minStock),
      unitPrice: Number(form.unitPrice), bin: form.bin
    }));
    setModalOpen(false);
    setForm({ code: '', description: '', category: '', uom: 'MT', stock: '', minStock: '', unitPrice: '', bin: '' });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Materials Master</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>Master Management</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Materials Master</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable title="Material Register" columns={columns} data={materials}
        searchPlaceholder="Search material code, description..." onAddClick={() => setModalOpen(true)} addLabel="New Material" />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Material" onSubmit={handleSubmit} submitLabel="Add Material">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}><TextField fullWidth label="Material Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={7}><TextField fullWidth label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField select fullWidth label="UOM" value={form.uom} onChange={e => setForm({ ...form, uom: e.target.value })}>
            {['MT', 'Kgs', 'Mtrs', 'Nos', 'Ltrs', 'Sets'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
          </TextField></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth type="number" label="Opening Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth type="number" label="Min Stock Level" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth type="number" label="Unit Price (₹)" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Bin Location" value={form.bin} onChange={e => setForm({ ...form, bin: e.target.value })} /></Grid>
        </Grid>
      </FormModal>
    </Box>
  );
}
