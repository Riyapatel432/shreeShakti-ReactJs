import React, { useEffect, useState, useCallback } from "react";
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { Box,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  InputAdornment,
  Tooltip, useTheme } from '@mui/material';
import {
  Edit,
  Delete,
  NavigateNext as NavIcon,
  TrendingUp,
  History as HistoryIcon,
  Description,
  Inventory
} from '@mui/icons-material';

import DataTable from "../../components/common/DataTable";
import FormModal from "../../components/common/FormModal";
import Snackbar from '../../components/common/SnackBar';

import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  recordStockMovement,
  getMaterialLedger,
  clearError,
  clearLedger,
} from "../../redux/slices/materialSlice";
import { getMaterialCategories } from "../../redux/slices/materialCategorySlice";
import { fetchMoc } from "../../redux/slices/moc.Slice";
import { fetchUnit } from "../../redux/slices/unitSlice";

export default function MaterialRegisterPage() {
  const theme = useTheme();

  const dispatch = useDispatch();

  // State slices
  const {
    materials,
    ledger,
    pagination,
    ledgerPagination,
    loading: tableLoading,
  } = useSelector((state) => state.materials);
  const { categories } = useSelector((state) => state.materialCategories);
  const { data: mocs } = useSelector((state) => state.mocs);
  const { data: units } = useSelector((state) => state.units);

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [ledgerPage, setLedgerPage] = useState(1);

  // Modals & UI State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentMaterial, setCurrentMaterial] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const initialForm = {
    materialCode: "",
    description: "",
    category: "",
    moc: "",
    uom: "",
    minStockLevel: 0,
    reorderQty: 0,
    binLocation: "",
    unitRate: 0,
    currentStock: 0,
    status: true,
  };

  const [form, setForm] = useState(initialForm);

  const [stockForm, setStockForm] = useState({
    transactionType: "IN",
    quantity: "",
    referenceType: "ManualAdjustment",
    referenceId: "",
    remarks: "",
  });

  // Effects
  useEffect(() => {
    dispatch(getMaterials({ page: currentPage, limit, search: debouncedSearch }));
  }, [dispatch, currentPage, limit, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    dispatch(getMaterialCategories({ limit: 100 }));
    dispatch(fetchMoc({ limit: 100 }));
    dispatch(fetchUnit({ limit: 100 }));
  }, [dispatch]);

  // Handlers
  const handleFieldChange = (field, value) => {
    if (field === "materialCode") value = value.toUpperCase();
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm(initialForm);
    setServerError("");
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setIsEdit(true);
    setEditingId(row._id);
    setForm({
      materialCode: row.materialCode,
      description: row.description,
      category: row.category?._id || "",
      moc: row.moc?._id || "",
      uom: row.uom?._id || "",
      minStockLevel: row.minStockLevel || 0,
      reorderQty: row.reorderQty || 0,
      binLocation: row.binLocation || "",
      unitRate: row.unitRate || 0,
      status: row.status === "Active",
    });
    setServerError("");
    setModalOpen(true);
  };

  const handleOpenStock = (row) => {
    setCurrentMaterial(row);
    setEditingId(row._id);
    setStockForm({
      transactionType: "IN",
      quantity: "",
      referenceType: "ManualAdjustment",
      referenceId: "",
      remarks: "",
    });
    setServerError("");
    setStockModalOpen(true);
  };

  const handleOpenLedger = (row) => {
    setCurrentMaterial(row);
    setEditingId(row._id);
    setLedgerPage(1);
    dispatch(clearLedger());
    dispatch(getMaterialLedger({ id: row._id, page: 1, limit: 10 }));
    setLedgerModalOpen(true);
  };

  // Submissions
  const handleSubmit = async () => {
    setServerError("");
    setFormLoading(true);

    const payload = {
      ...form,
      status: form.status ? "Active" : "Inactive"
    };

    try {
      let res;
      if (isEdit) {
        res = await dispatch(updateMaterial({ id: editingId, ...payload }));
      } else {
        res = await dispatch(createMaterial(payload));
      }

      setFormLoading(false);

      if (res.meta?.requestStatus === "fulfilled") {
        setSuccessMessage(isEdit ? "Material updated successfully" : "Material created successfully");
        setModalOpen(false);
        dispatch(getMaterials({ page: currentPage, limit, search: debouncedSearch }));
      } else {
        setServerError(res.payload || "Something went wrong");
      }
    } catch (err) {
      setFormLoading(false);
      setServerError(err.message || "Something went wrong");
    }
  };

  const handleStockSubmit = async () => {
    setServerError("");
    setFormLoading(true);

    try {
      const res = await dispatch(recordStockMovement({ 
        id: editingId, 
        movementData: { ...stockForm, quantity: Number(stockForm.quantity) } 
      }));

      setFormLoading(false);

      if (res.meta?.requestStatus === "fulfilled") {
        setSuccessMessage("Stock movement recorded successfully");
        setStockModalOpen(false);
        dispatch(getMaterials({ page: currentPage, limit, search: debouncedSearch }));
      } else {
        setServerError(res.payload || "Failed to record stock movement");
      }
    } catch (err) {
      setFormLoading(false);
      setServerError(err.message || "Error recording stock");
    }
  };

  const handleDeleteConfirm = async () => {
    const res = await dispatch(deleteMaterial(deleteId));
    if (res.meta?.requestStatus === "fulfilled") {
      setSuccessMessage("Material deleted successfully");
      dispatch(getMaterials({ page: currentPage, limit, search: debouncedSearch }));
    } else {
      setServerError(res.payload || "Failed to delete material");
    }
    setDeleteDialog(false);
    setDeleteId(null);
  };

  // Tables
  const columns = [
    {
      id: 'sr',
      label: 'Sr No',
      width: 80,
      render: (_, index) => (currentPage - 1) * limit + index + 1
    },
    { id: 'materialCode', label: 'Material Code' },
    { id: 'description', label: 'Description' },
    { id: 'category', label: 'Category', render: (row) => row.category?.name || '-' },
    {
      id: 'currentStock',
      label: 'Stock',
      render: (row) => {
        const isLow = row.currentStock <= row.minStockLevel;
        return (
          <Chip
            label={`${row.currentStock} ${row.uom?.name || ''}`}
            size="small"
            color={isLow ? "error" : "success"}
            variant={isLow ? "filled" : "outlined"}
          />
        );
      }
    },
    { id: 'binLocation', label: 'Bin Loc' },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          color={row.status === 'Active' ? "success" : "default"}
          variant="outlined"
        />
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <>
          <Tooltip title="Stock Entry">
            <IconButton onClick={() => handleOpenStock(row)} color="success" size="small">
              <TrendingUp fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Ledger">
            <IconButton onClick={() => handleOpenLedger(row)} color="secondary" size="small">
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(row)} color="primary" size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => { setDeleteId(row._id); setDeleteDialog(true); }} color="error" size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>Material Register</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Inventory</Link>
          <Typography color="warning.main">Materials</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable
        title="All Materials"
        columns={columns}
        data={materials || []}
        loading={tableLoading}
        searchPlaceholder="Search materials..."
        onSearch={(value) => { setSearch(value); setCurrentPage(1); }}
        currentPage={currentPage}
        totalPages={pagination?.totalPages || 1}
        totalRecords={pagination?.totalRecords || 0}
        rowsPerPage={limit}
        onPageChange={(page) => setCurrentPage(page)}
        onRowsPerPageChange={(newLimit) => { setLimit(newLimit); setCurrentPage(1); }}
        onAddClick={handleAdd}
        addLabel="New Material"
      />

      {/* Main Material Modal */}
      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEdit ? "Edit Material" : "Add New Material"}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Update" : "Save"}
        serverError={serverError}
        setServerError={setServerError}
        maxWidth="md"
        fullWidth
        loading={formLoading}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth required
              label="Material Code"
              value={form.materialCode}
              onChange={(e) => handleFieldChange('materialCode', e.target.value)}
              slotProps={{ input: { startAdornment: (<InputAdornment position="start"><Inventory fontSize="small" /></InputAdornment>) } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth required
              label="Description"
              value={form.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              slotProps={{ input: { startAdornment: (<InputAdornment position="start"><Description fontSize="small" /></InputAdornment>) } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth select required
              label="Category"
              value={form.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
            >
              {categories?.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth select
              label="MOC"
              value={form.moc}
              onChange={(e) => handleFieldChange('moc', e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {mocs?.map((m) => (
                <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth select
              label="UOM"
              value={form.uom}
              onChange={(e) => handleFieldChange('uom', e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {units?.map((u) => (
                <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth type="number"
              label="Min Stock Level"
              value={form.minStockLevel}
              onChange={(e) => handleFieldChange('minStockLevel', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth type="number"
              label="Reorder Qty"
              value={form.reorderQty}
              onChange={(e) => handleFieldChange('reorderQty', e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Bin Location"
              value={form.binLocation}
              onChange={(e) => handleFieldChange('binLocation', e.target.value)}
            />
          </Grid>
          {!isEdit && (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth type="number"
                label="Opening Stock"
                value={form.currentStock}
                onChange={(e) => handleFieldChange('currentStock', e.target.value)}
              />
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FormModal>

      {/* Stock Movement Modal */}
      <FormModal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        title={`Stock Entry - ${currentMaterial?.materialCode}`}
        onSubmit={handleStockSubmit}
        submitLabel="Record Movement"
        serverError={serverError}
        setServerError={setServerError}
        maxWidth="sm"
        fullWidth
        loading={formLoading}
      >
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Current Stock: <strong>{currentMaterial?.currentStock}</strong>
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth select required
              label="Transaction Type"
              value={stockForm.transactionType}
              onChange={(e) => setStockForm({ ...stockForm, transactionType: e.target.value })}
            >
              <MenuItem value="IN">IN (Receive)</MenuItem>
              <MenuItem value="OUT">OUT (Issue)</MenuItem>
              <MenuItem value="ADJUSTMENT">ADJUSTMENT</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth type="number" required
              label="Quantity"
              inputProps={{ min: 0.001, step: "any" }}
              value={stockForm.quantity}
              onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth select required
              label="Reference Type"
              value={stockForm.referenceType}
              onChange={(e) => setStockForm({ ...stockForm, referenceType: e.target.value })}
            >
              <MenuItem value="Purchase">Purchase</MenuItem>
              <MenuItem value="Production">Production</MenuItem>
              <MenuItem value="Issue">Issue</MenuItem>
              <MenuItem value="Return">Return</MenuItem>
              <MenuItem value="ManualAdjustment">Manual Adjustment</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Remarks"
              value={stockForm.remarks}
              onChange={(e) => setStockForm({ ...stockForm, remarks: e.target.value })}
            />
          </Grid>
        </Grid>
      </FormModal>

      {/* Ledger Modal */}
      <Dialog open={ledgerModalOpen} onClose={() => setLedgerModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Stock Ledger - {currentMaterial?.materialCode}</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <DataTable
            title="Transactions"
            columns={[
              { id: 'createdAt', label: 'Date', render: (row) => new Date(row.createdAt).toLocaleString() },
              { id: 'transactionType', label: 'Type', render: (row) => (
                <Typography color={row.transactionType === 'IN' ? 'success.main' : row.transactionType === 'OUT' ? 'error.main' : 'info.main'} fontWeight={600} variant="body2">
                  {row.transactionType}
                </Typography>
              )},
              { id: 'quantity', label: 'Qty' },
              { id: 'balanceAfter', label: 'Balance' },
              { id: 'referenceType', label: 'Ref', render: (row) => (
                <Box>
                  <Typography variant="body2">{row.referenceType}</Typography>
                  {row.remarks && <Typography variant="caption" color="text.secondary">{row.remarks}</Typography>}
                </Box>
              )},
              { id: 'performedBy', label: 'User', render: (row) => row.performedBy?.name || 'System' }
            ]}
            data={ledger || []}
            loading={tableLoading}
            hidePagination={false}
            currentPage={ledgerPage}
            totalPages={ledgerPagination?.totalPages || 1}
            totalRecords={ledgerPagination?.totalRecords || 0}
            rowsPerPage={10}
            onPageChange={(page) => {
              setLedgerPage(page);
              dispatch(getMaterialLedger({ id: currentMaterial._id, page, limit: 10 }));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLedgerModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Material</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this material?
        </DialogContent>
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
