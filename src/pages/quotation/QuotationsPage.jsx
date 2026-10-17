import { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Breadcrumbs, Link, Chip, Grid, TextField, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Tooltip, useTheme } from '@mui/material';
import Snackbar from '../../components/common/SnackBar';
import {
  Edit, Delete, NavigateNext as NavIcon, PictureAsPdf as PdfIcon
} from '@mui/icons-material';

import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

import {
  fetchQuotation, addQuotation, updateQuotation, deleteQuotation, exportQuotation
} from "../../redux/slices/quotationSlice";
import { fetchClients } from "../../redux/slices/clientSlice";
import { fetchCostingSheet } from "../../redux/slices/costingSheet/costingSheetSlice";

const VALIDATION = {
  quotation_no: { required: true },
  client: { required: true }
};

export default function QuotationsPage() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const initialForm = {
    quotation_no: "",
    client: "",
    costingSheet: "",
    tax: 18,
    tax_type: "GST",
    discount: 0,
    grand_total: 0,
    status: true,
  };

  const [form, setForm] = useState(initialForm);

  const { data: quotations = [], loading: tableLoading, pagination } = useSelector((state) => state.quotations);
  const { data: clients = [] } = useSelector((state) => state.clients);
  const { data: costingSheets = [] } = useSelector((state) => state.costingSheets);

  useEffect(() => {
    dispatch(fetchClients({ limit: 100 }));
    dispatch(fetchCostingSheet({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchQuotation({ page: currentPage, limit, search: debouncedSearch }));
  }, [dispatch, currentPage, limit, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const validateField = useCallback((fieldName, value) => {
    const rules = VALIDATION[fieldName];
    if (!rules) return "";
    const trimmed = typeof value === "string" ? value.trim() : String(value ?? "").trim();
    if (rules.required && !trimmed) return `${fieldName} is required`;
    return "";
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    Object.keys(VALIDATION).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    const allTouched = {};
    Object.keys(VALIDATION).forEach((f) => { allTouched[f] = true; });
    setTouched(allTouched);
    return isValid;
  }, [form, validateField]);

  const handleFieldChange = (fieldName, value) => {
    setForm((prev) => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, value) }));
    }
  };

  const fieldProps = (name) => ({
    error: !!(touched[name] && errors[name]),
    helperText: (touched[name] && errors[name]) || ""
  });

  const handleAdd = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setIsEdit(true);
    setEditingId(row._id);
    setForm({
      quotation_no: row.quotation_no || "",
      client: row.client?._id || row.client || "",
      costingSheet: row.costingSheet?._id || row.costingSheet || "",
      tax: row.tax ?? 18,
      tax_type: row.tax_type || "GST",
      discount: row.discount ?? 0,
      grand_total: row.grand_total ?? 0,
      status: row.status ?? true,
    });
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setServerError("");
    setFormLoading(true);

    try {
      let res;
      if (isEdit) {
        res = await dispatch(updateQuotation({ id: editingId, data: form }));
      } else {
        res = await dispatch(addQuotation(form));
      }
      setFormLoading(false);

      if (res.meta?.requestStatus === "fulfilled") {
        dispatch(fetchQuotation({ page: currentPage, limit, search }));
        setSuccessMessage(isEdit ? "Quotation updated successfully" : "Quotation created successfully");
        setModalOpen(false);
      } else {
        setServerError(res.payload?.message || "Something went wrong");
      }
    } catch (err) {
      setFormLoading(false);
      setServerError(err?.message || "Something went wrong");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
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
        handleDeleteConfirm(id);
      }
    });
};

  const handleDeleteConfirm = async (overrideId) => {
    const res = await dispatch(deleteQuotation(overrideId || deleteId));
    if (res.meta?.requestStatus === "fulfilled") {
      setSuccessMessage("Quotation deleted successfully");
    } else {
      setServerError(res.payload?.message || "Failed to delete");
    }
    setDeleteDialog(false);
    setDeleteId(null);
  };

  const handleExportPDF = async (id) => {
    try {
      await dispatch(exportQuotation(id));
      setSuccessMessage("PDF downloaded!");
    } catch(err) {
      setServerError("Failed to download PDF");
    }
  };

  const columns = [
    { id: "sr", label: "Sr No", width: 80, render: (_, index) => (currentPage - 1) * limit + index + 1 },
    { id: "quotation_no", label: "Quote No" },
    { id: "client", label: "Client", render: (row) => row.client?.company_name || row.client?.name || "-" },
    { id: "grand_total", label: "Grand Total (₹)", render: (row) => row.grand_total ? `₹${row.grand_total}` : "-" },
    { id: "createdAt", label: "Date", render: (row) => new Date(row.createdAt).toLocaleDateString("en-IN") },
    {
      id: "status", label: "Status", render: (row) => (
        <Chip label={row.status ? "Active" : "Inactive"} size="small" color={row.status ? "success" : "default"} variant="outlined" />
      ),
    },
    {
      id: "actions", label: "Actions", render: (row) => (
        <>
          <Tooltip title="Export PDF">
            <IconButton onClick={() => handleExportPDF(row._id)} color="secondary" size="small">
              <PdfIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(row)} color="primary" size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(row._id)} color="error" size="small">
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
        <Typography variant="h4" fontWeight={800}>Quotations</Typography>
        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Sales</Link>
          <Typography color="warning.main">Quotations</Typography>
        </Breadcrumbs>
      </Box>

      <DataTable
        title="Quotations" columns={columns} data={quotations || []} loading={tableLoading}
        searchPlaceholder="Search Quotes"
        onSearch={(value) => { setSearch(value); setCurrentPage(1); }}
        currentPage={currentPage} totalPages={pagination?.totalPages || 1} totalRecords={pagination?.totalRecords || 0} rowsPerPage={limit}
        onPageChange={setCurrentPage} onRowsPerPageChange={(newLimit) => { setLimit(newLimit); setCurrentPage(1); }}
        onAddClick={handleAdd} addLabel="New Quotation"
      />

      <FormModal
        open={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? "Edit Quotation" : "Create Quotation"}
        onSubmit={handleSubmit} submitLabel={isEdit ? "Update" : "Save"} serverError={serverError} setServerError={setServerError} maxWidth="lg" fullWidth loading={formLoading}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth label="Quotation No" value={form.quotation_no} onChange={(e) => handleFieldChange("quotation_no", e.target.value)} {...fieldProps("quotation_no")} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth select label="Client" value={form.client} onChange={(e) => handleFieldChange("client", e.target.value)} {...fieldProps("client")}>
              <MenuItem value="">Select Client</MenuItem>
              {clients.map((item) => <MenuItem key={item._id} value={item._id}>{item.company_name || item.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              select
              label="Costing Sheet"
              value={form.costingSheet}
              onChange={(e) => {
                const sheetId = e.target.value;
                const selected = costingSheets.find((s) => s._id === sheetId);
                handleFieldChange("costingSheet", sheetId);
                if (selected) {
                  const total = selected.amount || (selected.qty * selected.rate) || selected.grandTotal || selected.total || 0;
                  setForm((prev) => ({
                    ...prev,
                    costingSheet: sheetId,
                    grand_total: prev.grand_total ? prev.grand_total : total,
                  }));
                }
              }}
            >
              <MenuItem value="">-- Select Costing Sheet --</MenuItem>
              {costingSheets.map((sheet) => {
                const catName = sheet.product_category?.name || sheet.product_category || "General";
                const prodName = sheet.product?.name || "";
                const amount = sheet.amount || (sheet.qty * sheet.rate) || sheet.grandTotal || sheet.total || 0;
                return (
                  <MenuItem key={sheet._id} value={sheet._id}>
                    {catName} {prodName ? `- ${prodName}` : ""} (₹{amount})
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth type="number" label="Discount" value={form.discount} onChange={(e) => handleFieldChange("discount", e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth select label="Tax Type" value={form.tax_type} onChange={(e) => handleFieldChange("tax_type", e.target.value)}>
              <MenuItem value="GST">GST</MenuItem>
              <MenuItem value="IGST">IGST</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth type="number" label="Tax (%)" value={form.tax} onChange={(e) => handleFieldChange("tax", e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth type="number" label="Grand Total (Override)" value={form.grand_total} onChange={(e) => handleFieldChange("grand_total", e.target.value)} helperText="Leave 0 to use Costing Sheet Total" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value === true })}>
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FormModal>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Quotation</DialogTitle>
        <DialogContent>Are you sure you want to delete this Quotation?</DialogContent>
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