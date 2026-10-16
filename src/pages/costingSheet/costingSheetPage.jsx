import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Breadcrumbs, Link, Chip, Grid, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from '@mui/material';
import Snackbar from '../../components/common/Snackbar';
import { Edit, Delete, NavigateNext as NavIcon, Description } from '@mui/icons-material';

import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

import {
    fetchCostingSheet,
    addCostingSheet,
    deleteCostingSheet
} from "../../redux/slices/costingSheet/costingSheetSlice";
import { fetchClients } from "../../redux/slices/clientSlice";
import { fetchProduct } from "../../redux/slices/productSlice";
import { fetchNBSizes, fetchDependencies } from "../../redux/slices/standardsSlice";
import { generateTechSpec } from "../../redux/slices/techSpecSlice";
import { fetchProjects } from "../../redux/slices/projectSlice";

export default function CostingSheetPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const initialForm = {
    client: "",
    project: "",
    product_category: "StorageTank",
    status: "Draft",
    design_inputs: {},
    line_items: [],
    wastagePercent: 0,
    labourConsumablesPercent: 0,
    freightAmount: 0,
    ndtInspectionAmount: 0
  };

  const [form, setForm] = useState(initialForm);
  const [newItem, setNewItem] = useState({ description: "", qty: 1, rate: 0 });

  const { data: costingSheets = [], loading: tableLoading, pagination } = useSelector((state) => state.costingSheets);
  const { data: clients = [] } = useSelector((state) => state.clients);
  const { data: products = [] } = useSelector((state) => state.products); 
  const { nbSizes, dependencies } = useSelector((state) => state.standards);
  const { projects = [] } = useSelector((state) => state.projects || {});

  useEffect(() => {
    dispatch(fetchClients({ limit: 100 }));
    dispatch(fetchProjects({ limit: 100 }));
    dispatch(fetchProduct({ limit: 100 }));
    dispatch(fetchNBSizes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCostingSheet({ page: currentPage, limit, search: debouncedSearch }));
  }, [dispatch, currentPage, limit, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDesignInput = (field, value) => {
    setForm(prev => ({
      ...prev,
      design_inputs: { ...prev.design_inputs, [field]: value }
    }));
    if (field === 'nbSize' && value) {
      dispatch(fetchDependencies(value));
    }
  };

  const handleAddItem = () => {
    if (!newItem.description) return;
    setForm(prev => ({
      ...prev,
      line_items: [...prev.line_items, newItem]
    }));
    setNewItem({ description: "", qty: 1, rate: 0 });
  };

  const handleRemoveItem = (index) => {
    setForm(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index)
    }));
  };

  const handleAdd = () => {
    setForm(initialForm);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setServerError("");
    setFormLoading(true);

    try {
      const res = await dispatch(addCostingSheet(form));
      setFormLoading(false);

      if (res.meta?.requestStatus === "fulfilled") {
        dispatch(fetchCostingSheet({ page: currentPage, limit, search }));
        setSuccessMessage("CostingSheet created successfully");
        setModalOpen(false);
      } else {
        setServerError(res.payload?.message || "Something went wrong");
      }
    } catch (err) {
      setFormLoading(false);
      setServerError(err?.message || "Something went wrong");
    }
  };

  const handleDeleteConfirm = async () => {
    const res = await dispatch(deleteCostingSheet(deleteId));
    if (res.meta?.requestStatus === "fulfilled") {
      dispatch(fetchCostingSheet({ page: currentPage, limit, search }));
      setSuccessMessage("Deleted successfully");
    } else {
      setServerError(res.payload?.message || "Failed to delete");
    }
    setDeleteDialog(false);
  };

  const handleGenerateTechSpec = async (costingSheetId) => {
    Swal.fire({
      title: 'Generate Technical Specification?',
      text: "This will create a new Tech Spec linked to this Costing Sheet.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, generate it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setFormLoading(true);
        const res = await dispatch(generateTechSpec(costingSheetId));
        setFormLoading(false);
        if (res.meta?.requestStatus === "fulfilled") {
          Swal.fire("Generated!", "Technical Specification has been created.", "success").then(() => {
            navigate('/admin/tech-specs');
          });
        } else {
          Swal.fire("Error", res.payload?.message || "Failed to generate", "error");
        }
      }
    });
  };

  const columns = [
    { id: "sr", label: "Sr No", width: 80, render: (_, index) => (currentPage - 1) * limit + index + 1 },
    { id: "product_category", label: "Category" },
    { id: "client", label: "Client", render: (row) => row.client?.company_name || "-" },
    { id: "project", label: "Project", render: (row) => row.project?.projectName || "-" },
    { id: "grandTotal", label: "Total (₹)", render: (row) => `₹${row.grandTotal}` },
    { id: "status", label: "Status", render: (row) => <Chip label={row.status} size="small" variant="outlined" /> },
    {
      id: "actions", label: "Actions", render: (row) => (
        <>
          <Tooltip title="Generate Tech Spec">
            <IconButton onClick={() => handleGenerateTechSpec(row._id)} color="primary" size="small">
              <Description fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => { setDeleteId(row._id); setDeleteDialog(true); }} color="error" size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>Costing Engine</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Engineering</Link>
          <Typography color="warning.main">Costing Sheets</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable
        title="Costing Sheets" columns={columns} data={costingSheets || []} loading={tableLoading}
        searchPlaceholder="Search Category" onSearch={(value) => { setSearch(value); setCurrentPage(1); }}
        currentPage={currentPage} totalPages={pagination?.totalPages || 1} totalRecords={pagination?.totalRecords || 0} rowsPerPage={limit}
        onPageChange={setCurrentPage} onRowsPerPageChange={(newLimit) => { setLimit(newLimit); setCurrentPage(1); }}
        onAddClick={handleAdd} addLabel="New Costing Sheet"
      />

      <FormModal
        open={modalOpen} onClose={() => setModalOpen(false)} title="Create BOM Costing Sheet"
        onSubmit={handleSubmit} submitLabel="Save Engine" serverError={serverError} setServerError={setServerError} maxWidth="lg" fullWidth loading={formLoading}
      >
        <Grid container spacing={3}>
          {/* Header Block */}
          <Grid xs={12}>
            <Typography variant="h6" color="primary">Header Information</Typography>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField fullWidth select label="Client" value={form.client} onChange={(e) => handleFieldChange("client", e.target.value)}>
              <MenuItem value="">Select Client</MenuItem>
              {clients.map((c) => <MenuItem key={c._id} value={c._id}>{c.company_name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField fullWidth select label="Project" value={form.project} onChange={(e) => handleFieldChange("project", e.target.value)}>
              <MenuItem value="">Select Project</MenuItem>
              {Array.isArray(projects) && projects.map((p) => <MenuItem key={p._id} value={p._id}>{p.projectName}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField fullWidth select label="Product Category" value={form.product_category} onChange={(e) => handleFieldChange("product_category", e.target.value)}>
              <MenuItem value="StorageTank">Storage Tank</MenuItem>
              <MenuItem value="PressureVessel">Pressure Vessel</MenuItem>
              <MenuItem value="HeatExchanger">Heat Exchanger</MenuItem>
              <MenuItem value="Condenser">Condenser</MenuItem>
              <MenuItem value="Reactor">Reactor</MenuItem>
            </TextField>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField fullWidth select label="Status" value={form.status} onChange={(e) => handleFieldChange("status", e.target.value)}>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Final">Final</MenuItem>
            </TextField>
          </Grid>

          {/* Design Input Block */}
          <Grid xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" color="secondary">Design Inputs ({form.product_category})</Typography>
          </Grid>
          
          {form.product_category === "StorageTank" && (
            <>
              <Grid xs={12} md={4}><TextField fullWidth label="Capacity (KL)" type="number" onChange={(e) => handleDesignInput("capacity", e.target.value)}/></Grid>
              <Grid xs={12} md={4}><TextField fullWidth label="Diameter (mm)" type="number" onChange={(e) => handleDesignInput("diameter", e.target.value)}/></Grid>
              <Grid xs={12} md={4}><TextField fullWidth label="Height (mm)" type="number" onChange={(e) => handleDesignInput("height", e.target.value)}/></Grid>
            </>
          )}

          {form.product_category === "HeatExchanger" && (
            <>
              <Grid xs={12} md={3}><TextField fullWidth label="Tube OD (mm)" type="number" onChange={(e) => handleDesignInput("tube_od", e.target.value)}/></Grid>
              <Grid xs={12} md={3}><TextField fullWidth label="Tube Length (mm)" type="number" onChange={(e) => handleDesignInput("tube_length", e.target.value)}/></Grid>
              <Grid xs={12} md={3}><TextField fullWidth label="Tube Count" type="number" onChange={(e) => handleDesignInput("tube_count", e.target.value)}/></Grid>
              <Grid xs={12} md={3}><TextField fullWidth label="Passes" type="number" onChange={(e) => handleDesignInput("passes", e.target.value)}/></Grid>
            </>
          )}

          {/* Piping Specifications Block (Demonstrates Standard Library Usage) */}
          <Grid xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" color="primary">Piping Specifications (From Standards Library)</Typography>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField fullWidth select label="NB Size" value={form.design_inputs?.nbSize || ""} onChange={(e) => handleDesignInput("nbSize", e.target.value)}>
              <MenuItem value="">Select NB Size</MenuItem>
              {nbSizes?.map((nb) => <MenuItem key={nb._id} value={nb._id}>{nb.nb_inch} ({nb.nb_mm}mm)</MenuItem>)}
              <MenuItem value="custom">Custom Size</MenuItem>
            </TextField>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField fullWidth select label="Pipe Schedule" value={form.design_inputs?.pipeSchedule || ""} onChange={(e) => {
              handleDesignInput("pipeSchedule", e.target.value);
              const selectedSch = dependencies?.schedules?.find(s => s._id === e.target.value);
              if (selectedSch) {
                handleDesignInput("wallThickness", selectedSch.wallThickness);
              }
            }} disabled={!form.design_inputs?.nbSize || form.design_inputs?.nbSize === 'custom'}>
              <MenuItem value="">Select Schedule</MenuItem>
              {dependencies?.schedules?.map((sch) => <MenuItem key={sch._id} value={sch._id}>{sch.schedule}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid xs={12} md={4}>
            <TextField fullWidth label="Wall Thickness (mm)" type="number" value={form.design_inputs?.wallThickness || ""} onChange={(e) => handleDesignInput("wallThickness", e.target.value)} InputProps={{ readOnly: form.design_inputs?.nbSize !== 'custom' }} />
          </Grid>

          {/* BOM Block */}
          <Grid xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" color="error">BOM Line Items</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1 }}>
              <TextField label="Description (e.g. Shell Plate)" size="small" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} sx={{ flex: 2 }} />
              <TextField label="Qty (nos or kg)" size="small" type="number" value={newItem.qty} onChange={(e) => setNewItem({...newItem, qty: Number(e.target.value)})} sx={{ flex: 1 }} />
              <TextField label="Rate (₹)" size="small" type="number" value={newItem.rate} onChange={(e) => setNewItem({...newItem, rate: Number(e.target.value)})} sx={{ flex: 1 }} />
              <Button variant="contained" onClick={handleAddItem}>Add</Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Rate (₹)</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.line_items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>{item.rate}</TableCell>
                      <TableCell>
                        <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)}><Delete fontSize="small"/></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {form.line_items.length === 0 && (
                    <TableRow><TableCell colSpan={4} align="center">No items added to BOM.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Rollup Block */}
          <Grid xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" color="success.main">Rollup Overheads</Typography>
          </Grid>
          <Grid xs={12} md={3}>
            <TextField fullWidth label="Wastage (%)" type="number" value={form.wastagePercent} onChange={(e) => handleFieldChange("wastagePercent", Number(e.target.value))} />
          </Grid>
          <Grid xs={12} md={3}>
            <TextField fullWidth label="Labour/Consumables (%)" type="number" value={form.labourConsumablesPercent} onChange={(e) => handleFieldChange("labourConsumablesPercent", Number(e.target.value))} />
          </Grid>
          <Grid xs={12} md={3}>
            <TextField fullWidth label="Freight Amount (₹)" type="number" value={form.freightAmount} onChange={(e) => handleFieldChange("freightAmount", Number(e.target.value))} />
          </Grid>
          <Grid xs={12} md={3}>
            <TextField fullWidth label="NDT / Inspection (₹)" type="number" value={form.ndtInspectionAmount} onChange={(e) => handleFieldChange("ndtInspectionAmount", Number(e.target.value))} />
          </Grid>

        </Grid>
      </FormModal>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Costing Sheet</DialogTitle>
        <DialogContent>Are you sure you want to delete this sheet?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={!!successMessage} message={successMessage} severity="success" onClose={() => setSuccessMessage("")} />
      <Snackbar open={!!serverError} message={serverError} severity="error" onClose={() => setServerError("")} />
    </Box>
  );
}