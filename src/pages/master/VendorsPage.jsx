import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Breadcrumbs, Link, Chip, Grid, TextField, Rating } from '@mui/material';
import { NavigateNext as NavIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import { addVendor } from '../../redux/slices/erpSlice';

export default function VendorsPage() {
  const dispatch = useDispatch();
  const vendors = useSelector(s => s.erp.vendors);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', contact: '', email: '', phone: '', category: '' });

  const columns = [
    { id: 'id', label: 'Vendor ID', width: 110 },
    { id: 'code', label: 'Code', width: 130 },
    { id: 'name', label: 'Vendor Name' },
    { id: 'contact', label: 'Contact Person' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'category', label: 'Category', render: (row) => (
      <Chip label={row.category} size="small" variant="outlined" color="primary" />
    )},
    { id: 'rating', label: 'Rating', render: (row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Rating value={row.rating} precision={0.1} readOnly size="small" />
        <Typography variant="caption" fontWeight={700}>{row.rating}</Typography>
      </Box>
    )},
  ];

  const handleSubmit = () => {
    dispatch(addVendor({
      id: `VND-00${vendors.length + 1}`,
      name: form.name, code: form.code, contact: form.contact,
      email: form.email, phone: form.phone, category: form.category, rating: 4.0
    }));
    setModalOpen(false);
    setForm({ name: '', code: '', contact: '', email: '', phone: '', category: '' });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Vendor Master</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>Master Management</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Vendors</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable title="All Vendors" columns={columns} data={vendors}
        searchPlaceholder="Search vendor name, category..." onAddClick={() => setModalOpen(true)} addLabel="New Vendor" />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Register New Vendor" onSubmit={handleSubmit} submitLabel="Register Vendor">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}><TextField fullWidth label="Vendor Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth label="Vendor Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Contact Person" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Grid>
        </Grid>
      </FormModal>
    </Box>
  );
}
