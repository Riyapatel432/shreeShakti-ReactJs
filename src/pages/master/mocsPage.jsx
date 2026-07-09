import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
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
  Tooltip,
} from '@mui/material';
import Snackbar from '../../components/common/Snackbar';
import {
  Edit,
  Delete,
  NavigateNext as NavIcon,
  Person,
} from "@mui/icons-material";

import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';

import {
  fetchMoc,
  addMoc,
  updateMoc,
  deleteMoc
} from "../../redux/slices/moc.Slice";

// ================= VALIDATION RULES =================
const VALIDATION = {
  name: {
    required: true, 
    unique: true,
    minLength: 1,
    maxLength: 100,
  },
};


export default function MocsPage() {

  const dispatch = useDispatch();

  // ================= STATE =================
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
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
const initialForm = {
  name: "",
  status: true,
};

  const [form, setForm] = useState(initialForm);
const [debouncedSearch, setDebouncedSearch] = useState("");
const {
  data: mocs,
  loading: tableLoading,
  pagination,
} = useSelector((state) => state.mocs);

useEffect(() => {
  dispatch(
    fetchMoc({
      page: currentPage,
      limit,
      search:debouncedSearch,
    })
  );
}, [dispatch, currentPage, limit, debouncedSearch]);

useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearch]);

useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => {
    clearTimeout(handler);
  };
}, [search]);

  // ================= SINGLE FIELD VALIDATOR =================
  const validateField = useCallback((fieldName, value) => {
    const rules = VALIDATION[fieldName];
    if (!rules) return "";

  
const trimmed =
  typeof value === "string"
    ? value.trim()
    : String(value ?? "").trim();
    // Required check
    if (rules.required && !trimmed) {
      return `${fieldName === 'name' ? 'Name' :
        fieldName === 'description' ? 'Description' :
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    // Skip further checks if empty and not required
    if (!trimmed) return "";

    // Min length
    if (rules.minLength && trimmed.length < rules.minLength) {
      return `Minimum ${rules.minLength} characters required`;
    }

    // Max length
    if (rules.maxLength && trimmed.length > rules.maxLength) {
      return `Maximum ${rules.maxLength} characters allowed`;
    }

    // Exact length
    if (rules.exactLength && trimmed.length !== rules.exactLength) {
      return `Must be exactly ${rules.exactLength} characters`;
    }

    // Pattern
    if (rules.pattern && !rules.pattern.test(trimmed)) {
      return rules.patternMsg || "Invalid format";
    }

    return "";
  }, []);

  // ================= FULL FORM VALIDATOR =================
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

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(VALIDATION).forEach((f) => { allTouched[f] = true; });
    setTouched(allTouched);

    return isValid;
  }, [form, validateField]);

  // ================= FIELD CHANGE HANDLER =================
  const handleFieldChange = (fieldName, rawValue) => {
    let value = rawValue;


    setForm((prev) => ({ ...prev, [fieldName]: value }));

    // Real-time validation only if field was touched
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    }
  };

  // ================= FIELD BLUR HANDLER =================
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    // Trim on blur
    const trimmed = (form[fieldName] || "").trim();
    setForm((prev) => ({ ...prev, [fieldName]: trimmed }));

    const error = validateField(fieldName, trimmed);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  // ================= FIELD PROPS HELPER =================
  const fieldProps = (name) => ({
    error: !!(touched[name] && errors[name]),
    helperText: (touched[name] && errors[name]) || ""
  });

  // ================= OPEN ADD =================
  const handleAdd = () => {
    setIsEdit(false);
    setEditingId(null);
    setForm(initialForm);
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  // ================= OPEN EDIT =================
  const handleEdit = (row) => {
    setIsEdit(true);
    setEditingId(row._id);
   setForm({
  name: row.name || "",
  status: row.status ?? true,
});
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    // Client-side validation gate
    if (!validateForm()) return;

    setServerError("");
    setFormLoading(true);

    try {
      let res;

      if (isEdit) {
        res = await dispatch(updateMoc({ id: editingId, data: form }));
      } else {
        res = await dispatch(addMoc(form));
      }

      setFormLoading(false);

      // Check if the action was fulfilled
     if (res.meta?.requestStatus === "fulfilled") {
dispatch(
  fetchMoc({
    page: currentPage,
    limit,
    search,
  })
);

 setSuccessMessage(
  isEdit
    ? "Moc updated successfully"
    : "Moc created successfully"
);

  setModalOpen(false);
  setForm(initialForm);
  setIsEdit(false);
  setEditingId(null);
  setErrors({});
  setTouched({});

  return;
}

      // Handle rejected action
      const payload = res.payload;

      if (payload?.field) {
        setTouched((prev) => ({ ...prev, [payload.field]: true }));
        setErrors((prev) => ({
          ...prev,
          [payload.field]: payload.message,
        }));
      } else {
        setServerError(payload?.message || "Something went wrong");
      }
    } catch (err) {
      setFormLoading(false);
      setServerError(err?.message || "Something went wrong");
    }
  };

  // ================= DELETE =================
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialog(true);
  };

const handleDeleteConfirm = async () => {
  const res = await dispatch(deleteMoc(deleteId));

  if (res.meta?.requestStatus === "fulfilled") {
    setSuccessMessage("Moc deleted successfully");
  } else {
    setServerError(
      res.payload?.message || "Failed to delete Moc"
    );
  }

  setDeleteDialog(false);
  setDeleteId(null);
};
  // ================= TABLE =================
  const columns = [
    {
      id: 'sr',
      label: 'Sr No',
      width: 80,
      render: (_, index) =>
  (currentPage - 1) * limit + index + 1
    },
   {
  id: "name",
  label: "Moc Name",
},
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip
  label={row.status ? "Active" : "Inactive"}
  size="small"
  color={row.status ? "success" : "default"}
  variant="outlined"
/>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <>
          <Tooltip title="Edit Moc ">
            <IconButton onClick={() => handleEdit(row)} color="primary" size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Moc ">
            <IconButton onClick={() => handleDeleteClick(row._id)} color="error" size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  // ================= UI =================
  return (
    <Box>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Moc 
        </Typography>

        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Master</Link>
          <Typography color="warning.main">Moc </Typography>
        </Breadcrumbs>
      </Box>

      {/* TABLE */}
<DataTable
  title="Mocs "
  columns={columns}
  data={mocs || []}
  loading={tableLoading}

  searchPlaceholder="Search Mocs "
  onSearch={(value) => {
    setSearch(value);
    setCurrentPage(1);
  }}

  currentPage={currentPage}
  totalPages={pagination?.totalPages || 1}
  totalRecords={pagination?.totalRecords || 0}
  rowsPerPage={limit}

  onPageChange={(page) => {
    setCurrentPage(page);
  }}

  onRowsPerPageChange={(newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  }}

  onAddClick={handleAdd}
  addLabel="New Moc "
/>

      {/* MODAL */}
   <FormModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  title={isEdit ? "Edit Moc " : "Add New Moc "}
  onSubmit={handleSubmit}
  submitLabel={isEdit ? "Update" : "Save"}
  serverError={serverError}
  setServerError={setServerError}
  maxWidth="lg"
  fullWidth
  loading={formLoading}
>
  <Grid container spacing={2}>

    {/* ================= ROW 1 ================= */}

     <Grid size={{ xs: 12, md: 4 }}>
  <TextField
    fullWidth
    label="Moc Name"
    value={form.name}
    onChange={(e) => handleFieldChange("name", e.target.value)}
    onBlur={() => handleBlur("name")}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Person fontSize="small" />
        </InputAdornment>
      ),
    }}
    {...fieldProps("name")}
  />

    </Grid>


    <Grid size={{ xs: 12, md: 4 }}>
   <TextField
  fullWidth
  select
  label="Status"
  value={form.status}
  onChange={(e) =>
    setForm({ ...form, status: e.target.value === true })
  }
>
  <MenuItem value={true}>Active</MenuItem>
        <MenuItem value={false}>Inactive</MenuItem>
</TextField>
    </Grid>

  </Grid>
</FormModal>

      {/* DELETE CONFIRM */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Moc </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Moc ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
<Snackbar
  open={!!successMessage}
  message={successMessage}
  severity="success"
  onClose={() => setSuccessMessage("")}
/>

<Snackbar
  open={!!serverError}
  message={serverError}
  severity="error"
  onClose={() => setServerError("")}
/>
    </Box>
  );
}