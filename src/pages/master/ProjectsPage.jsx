import { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Grid,
  TextField,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { NavigateNext as NavIcon, Person } from '@mui/icons-material';
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Snackbar from '../../components/common/SnackBar';
import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject
} from "../../redux/slices/projectSlice";
import { fetchClients } from "../../redux/slices/clientSlice";

const STATUS_OPTIONS = ["Enquiry", "Costing", "Quoted", "Won", "Lost", "In Production", "Completed"];

const STATUS_COLORS = {
  "Enquiry": "default",
  "Costing": "info",
  "Quoted": "primary",
  "Won": "success",
  "Lost": "error",
  "In Production": "warning",
  "Completed": "success"
};

export default function ProjectsPage() {
  const dispatch = useDispatch();
  const { projects = [], loading } = useSelector((state) => state.projects || {});
  const { data: clients = [] } = useSelector((state) => state.clients || {});

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    client: '',
    status: 'Enquiry',
    startDate: '',
    expectedCompletionDate: '',
    description: ''
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadData = useCallback(() => {
    dispatch(fetchProjects());
    // Only fetch clients if they aren't loaded yet
    if (!clients || clients.length === 0) {
      dispatch(fetchClients({ page: 1, limit: 100 }));
    }
  }, [dispatch, clients.length]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingId(project._id);
      setFormData({
        projectName: project.projectName || '',
        client: project.client?._id || project.client || '',
        status: project.status || 'Enquiry',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        expectedCompletionDate: project.expectedCompletionDate ? project.expectedCompletionDate.split('T')[0] : '',
        description: project.description || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        projectName: '',
        client: '',
        status: 'Enquiry',
        startDate: '',
        expectedCompletionDate: '',
        description: ''
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.projectName || !formData.client) {
      setSnackbar({ open: true, message: 'Please fill in Project Name and Client', severity: 'error' });
      return;
    }

    try {
      if (editingId) {
        await dispatch(updateProject({ id: editingId, data: formData })).unwrap();
        setSnackbar({ open: true, message: 'Project updated successfully', severity: 'success' });
      } else {
        await dispatch(createProject(formData)).unwrap();
        setSnackbar({ open: true, message: 'Project created successfully', severity: 'success' });
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      setSnackbar({ open: true, message: err?.message || 'Action failed', severity: 'error' });
    }
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteProject(row._id)).unwrap();
        setSnackbar({ open: true, message: 'Project deleted successfully', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: err?.message || 'Delete failed', severity: 'error' });
      }
    }
  };

  const columns = [
    { id: 'projectName', label: 'Project Name' },
    { id: 'client', label: 'Client' },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip label={row.rawStatus} size="small" color={STATUS_COLORS[row.rawStatus] || 'default'} sx={{ fontWeight: 600 }} />
    )},
    { id: 'startDate', label: 'Start Date' },
    { id: 'expectedCompletionDate', label: 'Expected Completion' },
  ];

  const rows = projects.map((p, index) => ({
    _id: p._id,
    srNo: index + 1,
    projectName: p.projectName,
    client: p.client?.company_name || p.client?.name || '-',
    rawStatus: p.status,
    startDate: p.startDate ? new Date(p.startDate).toLocaleDateString() : '-',
    expectedCompletionDate: p.expectedCompletionDate ? new Date(p.expectedCompletionDate).toLocaleDateString() : '-',
  }));

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>Project Master</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="/admin/dashboard" sx={{ fontSize: '0.85rem' }}>Master Management</Link>
          <Typography color="warning.main" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Projects</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable
        title="All Projects"
        columns={columns}
        data={rows}
        searchPlaceholder="Search projects, clients..."
        onAddClick={() => handleOpenModal()}
        addLabel="New Project"
        onEditClick={handleOpenModal}
        onDeleteClick={handleDelete}
        loading={loading}
      />

      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Project' : 'Create New Project'} onSubmit={handleSubmit} submitLabel={editingId ? 'Save Changes' : 'Create Project'}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Project Name *"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Client *"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            >
              <MenuItem value="">Select Client</MenuItem>
              {Array.isArray(clients) && clients.map(c => (
                <MenuItem key={c._id} value={c._id}>{c.company_name || c.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {STATUS_OPTIONS.map(opt => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={formData.startDate ? dayjs(formData.startDate) : null}
                onChange={(newValue) => setFormData({ ...formData, startDate: newValue ? newValue.format('YYYY-MM-DD') : '' })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Expected Completion"
                value={formData.expectedCompletionDate ? dayjs(formData.expectedCompletionDate) : null}
                onChange={(newValue) => setFormData({ ...formData, expectedCompletionDate: newValue ? newValue.format('YYYY-MM-DD') : '' })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>
        </Grid>
      </FormModal>

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
}
