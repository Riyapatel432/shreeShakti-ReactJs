import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Breadcrumbs, Link, Chip, Button, TextField, Grid, MenuItem } from '@mui/material';
import { NavigateNext as NavIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import { addProject } from '../../redux/slices/erpSlice';

const statusColors = { 'In Progress': 'primary', 'Completed': 'success', 'Planning': 'warning', 'On Hold': 'error' };

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const projects = useSelector(s => s.erp.projects);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', client: '', manager: '', status: 'Planning', budget: '', startDate: '', endDate: '' });

  const columns = [
    { id: 'id', label: 'Project ID', width: 140 },
    { id: 'name', label: 'Project Name' },
    { id: 'client', label: 'Client' },
    { id: 'manager', label: 'Manager' },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip label={row.status} size="small" color={statusColors[row.status] || 'default'} sx={{ fontWeight: 600 }} />
    )},
    { id: 'progress', label: 'Progress %', render: (row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flexGrow: 1, height: 6, bgcolor: 'divider', borderRadius: 3 }}>
          <Box sx={{ width: `${row.progress}%`, height: '100%', bgcolor: row.progress === 100 ? 'success.main' : 'primary.main', borderRadius: 3 }} />
        </Box>
        <Typography variant="caption" fontWeight={700}>{row.progress}%</Typography>
      </Box>
    )},
    { id: 'budget', label: 'Budget (₹)', render: (row) => `₹ ${(row.budget / 100000).toFixed(1)} L` },
    { id: 'startDate', label: 'Start Date' },
    { id: 'endDate', label: 'End Date' },
  ];

  const handleSubmit = () => {
    dispatch(addProject({
      id: `PRJ-2026-00${projects.length + 1}`,
      name: form.name,
      client: form.client,
      manager: form.manager,
      status: form.status,
      progress: 0,
      budget: Number(form.budget),
      value: 0,
      startDate: form.startDate,
      endDate: form.endDate
    }));
    setModalOpen(false);
    setForm({ name: '', client: '', manager: '', status: 'Planning', budget: '', startDate: '', endDate: '' });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Project Master</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>Master Management</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Projects</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable
        title="All Projects"
        columns={columns}
        data={projects}
        searchPlaceholder="Search projects, clients..."
        onAddClick={() => setModalOpen(true)}
        addLabel="New Project"
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Project" onSubmit={handleSubmit} submitLabel="Create Project">
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="Project Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Project Manager" value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField select fullWidth label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['Planning', 'In Progress', 'On Hold', 'Completed'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Budget (₹)" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="date" label="Start Date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="date" label="End Date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
        </Grid>
      </FormModal>
    </Box>
  );
}
