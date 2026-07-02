import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Breadcrumbs, Link, Chip, Grid, TextField, MenuItem, LinearProgress } from '@mui/material';
import { NavigateNext as NavIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import { addEmployee } from '../../redux/slices/erpSlice';

const depts = ['Production', 'Quality Assurance', 'Purchase & Stores', 'Design', 'HR & Admin', 'Finance', 'Projects'];
const categories = ['Unskilled', 'Semi Skilled', 'Skilled', 'High Skilled', 'Supervisor', 'Manager', 'HOD'];
const statusColors = { Present: 'success', 'On Leave': 'warning', Absent: 'error' };

export default function EmployeesPage() {
  const dispatch = useDispatch();
  const employees = useSelector(s => s.erp.employees);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', dept: '', category: 'Skilled', status: 'Present' });

  const columns = [
    { id: 'id', label: 'Emp ID', width: 100 },
    { id: 'name', label: 'Employee Name' },
    { id: 'role', label: 'Designation / Trade' },
    { id: 'dept', label: 'Department', render: (row) => <Chip label={row.dept} size="small" variant="outlined" color="secondary" /> },
    { id: 'category', label: 'Skill Category' },
    { id: 'status', label: 'Today Status', render: (row) => (
      <Chip label={row.status} size="small" color={statusColors[row.status] || 'default'} sx={{ fontWeight: 700 }} />
    )},
    { id: 'attendanceRate', label: 'Attendance %', render: (row) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
        <LinearProgress variant="determinate" value={row.attendanceRate} sx={{ flexGrow: 1, height: 6, borderRadius: 3 }} color={row.attendanceRate >= 90 ? 'success' : 'warning'} />
        <Typography variant="caption" fontWeight={700}>{row.attendanceRate}%</Typography>
      </Box>
    )},
  ];

  const handleSubmit = () => {
    dispatch(addEmployee({
      id: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
      name: form.name, role: form.role, dept: form.dept,
      category: form.category, status: form.status, attendanceRate: 100
    }));
    setModalOpen(false);
    setForm({ name: '', role: '', dept: '', category: 'Skilled', status: 'Present' });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Employee Master</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>HR & Payroll</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Employee Master</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable title="Employee Register" columns={columns} data={employees}
        searchPlaceholder="Search name, designation, dept..." onAddClick={() => setModalOpen(true)} addLabel="New Employee" />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title="Register New Employee" onSubmit={handleSubmit} submitLabel="Register Employee">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}><TextField fullWidth label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></Grid>
          <Grid item xs={12} sm={5}><TextField fullWidth label="Designation / Trade" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField select fullWidth label="Department" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
            {depts.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </TextField></Grid>
          <Grid item xs={12} sm={6}><TextField select fullWidth label="Skill Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField></Grid>
          <Grid item xs={12} sm={6}><TextField select fullWidth label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {['Present', 'On Leave', 'Absent'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField></Grid>
        </Grid>
      </FormModal>
    </Box>
  );
}
