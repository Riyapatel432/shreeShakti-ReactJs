import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Breadcrumbs, Link, Chip, TextField, Grid, MenuItem, IconButton } from '@mui/material';
import { NavigateNext as NavIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../redux/slices/userSlice';
import { useTheme } from '@mui/material';
import Swal from 'sweetalert2';

const statusColors = { 'Active': 'success', 'Inactive': 'error' };

export default function UsersPage() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { data: users, loading, pagination } = useSelector(s => s.users);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'User', status: 'Active' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchUsers({ page, limit, search }));
  }, [dispatch, page, limit, search]);

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip label={row.status} size="small" color={statusColors[row.status] || 'default'} sx={{ fontWeight: 600 }} />
    )},
    { id: 'actions', label: 'Actions', render: (row) => (
      <Box>
        <IconButton size="small" color="primary" onClick={() => handleEdit(row)}><EditIcon fontSize="small" /></IconButton>
        <IconButton size="small" color="error" onClick={() => handleDelete(row._id)}><DeleteIcon fontSize="small" /></IconButton>
      </Box>
    )}
  ];

  const handleEdit = (user) => {
    setEditId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.grey[500],
      confirmButtonText: 'Yes, delete it!',
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(id));
      }
    });
  };

  const handleSubmit = async () => {
    if (editId) {
      await dispatch(updateUser({ id: editId, data: form }));
    } else {
      await dispatch(addUser(form));
    }
    setModalOpen(false);
    resetForm();
    dispatch(fetchUsers({ page, limit, search }));
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ name: '', email: '', phone: '', role: 'User', status: 'Active' });
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>User Master</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.85rem' }}>Master Management</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Users</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable
        title="All Users"
        columns={columns}
        data={users}
        searchPlaceholder="Search users by name or email..."
        onAddClick={() => { resetForm(); setModalOpen(true); }}
        addLabel="New User"
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        onSearch={setSearch}
        totalRecords={pagination.totalRecords}
        currentPage={pagination.currentPage}
        rowsPerPage={pagination.limit}
      />

      <FormModal 
        open={modalOpen} 
        onClose={() => { setModalOpen(false); resetForm(); }} 
        title={editId ? "Edit User" : "Create New User"} 
        onSubmit={handleSubmit} 
        submitLabel={editId ? "Update" : "Create"}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}><TextField fullWidth label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="email" label="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select fullWidth label="Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              {['Admin', 'User', 'Manager'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select fullWidth label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {['Active', 'Inactive'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </FormModal>
    </Box>
  );
}
