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
  Business,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Receipt,
  LocationOn,
  LocationCity,
  Home,
  Map as MapIcon
} from '@mui/icons-material';

import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import countries from "../../city.json";
import {
  fetchClients,
  addClient,
  updateClient,
  deleteClient
} from "../../redux/slices/clientSlice";

// ================= VALIDATION RULES =================
const VALIDATION = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s.'-]+$/,
    patternMsg: "Only letters, spaces, dots, apostrophes and hyphens allowed"
  },
  company_name: {
    required: true,
    minLength: 2,
    maxLength: 150,
    pattern: /^[a-zA-Z0-9\s.&,'-]+$/,
    patternMsg: "Only letters, numbers, spaces and basic punctuation allowed"
  },
  email: {
    required: true,
    maxLength: 100,
    pattern: /^\S+@\S+\.\S+$/,
    patternMsg: "Please enter a valid email address"
  },
  phone: {
    required: true,
    exactLength: 10,
    pattern: /^[0-9]{10}$/,
    patternMsg: "Phone number must be exactly 10 digits"
  },
  gst_no: {
    required: true,
    exactLength: 15,
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    patternMsg: "Invalid GST format (e.g. 22AAAAA0000A1Z5)"
  },
  address: {
    required: true,
    minLength: 5,
    maxLength: 250
  },
  city: {
    required: true,
   
  },
  state: {
    required: true,
    minLength: 2,
    maxLength: 50,
    
  }
};


export default function ClientsPage() {

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
const [cities, setCities] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const initialForm = {
    name: '',
    company_name: '',
    email: '',
    phone: '',
    gst_no: '',
    address: '',
    city: '',
    state: '',
    status: true
  };

  const [form, setForm] = useState(initialForm);
const [debouncedSearch, setDebouncedSearch] = useState("");
const {
  data: clients,
  loading: tableLoading,
  pagination,
} = useSelector((state) => state.clients);

useEffect(() => {
  dispatch(
    fetchClients({
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
      return `${fieldName === 'gst_no' ? 'GST No' :
        fieldName === 'company_name' ? 'Company Name' :
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

    // ---- Input Masking ----

    // Phone: digits only, max 10
    if (fieldName === 'phone') {
      value = rawValue.replace(/\D/g, '').slice(0, 10);
    }

    // GST: auto uppercase, alphanumeric only, max 15
    if (fieldName === 'gst_no') {
      value = rawValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15);
    }

    // Email: lowercase, no spaces
    if (fieldName === 'email') {
      value = rawValue.toLowerCase().replace(/\s/g, '');
    }

    // Name / City / State: prevent leading spaces & consecutive spaces
    if (['name', 'city', 'state'].includes(fieldName)) {
      value = rawValue.replace(/^\s+/, '').replace(/\s{2,}/g, ' ');
    }
if (fieldName === "state") {
  const selectedState = states.find(
    (s) => s.name === value
  );

  setCities(selectedState?.cities || []);

  setForm((prev) => ({
    ...prev,
    state: value,
    city: "", // reset city when state changes
  }));

  return;
}
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
      name: row.name || '',
      company_name: row.company_name || '',
      email: row.email || '',
      phone: row.phone || '',
      gst_no: row.gst_no || '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      status: row.status ?? true
    });
    const selectedState = states.find(
  (s) => s.name === row.state
);

setCities(selectedState?.cities || []);
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
        res = await dispatch(updateClient({ id: editingId, data: form }));
      } else {
        res = await dispatch(addClient(form));
      }

      setFormLoading(false);

      // Check if the action was fulfilled
     if (res.meta?.requestStatus === "fulfilled") {
 dispatch(
    fetchClients({
      page: currentPage,
      limit,
      search,
    })
  );

  setSuccessMessage(
    isEdit
      ? "Client updated successfully"
      : "Client created successfully"
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
  const res = await dispatch(deleteClient(deleteId));

  if (res.meta?.requestStatus === "fulfilled") {
    setSuccessMessage("Client deleted successfully");
  } else {
    setServerError(
      res.payload?.message || "Failed to delete client"
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
    { id: 'company_name', label: 'Company Name' },
    { id: 'name', label: 'Client Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'gst_no', label: 'GST No' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State' },
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
          <Tooltip title="Edit Client">
            <IconButton onClick={() => handleEdit(row)} color="primary" size="small">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Client">
            <IconButton onClick={() => handleDeleteClick(row._id)} color="error" size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  const india = countries.find(
  (country) => country.name === "India"
);

const states = india?.states || [];
  // ================= UI =================
  return (
    <Box>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Client Master
        </Typography>

        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Master</Link>
          <Typography color="warning.main">Clients</Typography>
        </Breadcrumbs>
      </Box>

      {/* TABLE */}
<DataTable
  title="All Clients"
  columns={columns}
  data={clients || []}
  loading={tableLoading}

  searchPlaceholder="Search clients..."
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
  addLabel="New Client"
/>

      {/* MODAL */}
   <FormModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  title={isEdit ? "Edit Client" : "Add New Client"}
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
        label="Client Name"
        value={form.name}
        onChange={(e) => handleFieldChange('name', e.target.value)}
        onBlur={() => handleBlur('name')}
         slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <Person fontSize="small" />
        </InputAdornment>
      ),
    },
  }}
        {...fieldProps("name")}
      />
    </Grid>

    <Grid size={{ xs: 12, md: 4 }}>
      <TextField
        fullWidth
        label="Company Name"
        value={form.company_name}
        onChange={(e) => handleFieldChange('company_name', e.target.value)}
        onBlur={() => handleBlur('company_name')}
                slotProps={{
    input: {
      startAdornment: (
            <InputAdornment position="start">
              <Business fontSize="small" />
            </InputAdornment>
          )
    },
  }}
        {...fieldProps("company_name")}
      />
    </Grid>

    <Grid size={{ xs: 12, md: 4 }}>
      <TextField
        fullWidth
        label="Email Address"
        value={form.email}
        onChange={(e) => handleFieldChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
         slotProps={{
    input: {
      startAdornment: (
         <InputAdornment position="start">
              <EmailIcon fontSize="small" />
            </InputAdornment>
      ),
    },
  }}
        {...fieldProps("email")}
      />
    </Grid>

    {/* ================= ROW 2 ================= */}
    <Grid size={{ xs: 12, md: 4 }}>
      <TextField
        fullWidth
        label="Phone Number"
        value={form.phone}
        onChange={(e) => handleFieldChange('phone', e.target.value)}
        onBlur={() => handleBlur('phone')}
                slotProps={{
    input: {
      startAdornment: (
         <InputAdornment position="start">
              <PhoneIcon fontSize="small" />
            </InputAdornment>
      ),
    },
  }}
        {...fieldProps("phone")}
      />
    </Grid>

    <Grid size={{ xs: 12, md: 4 }}>
      <TextField
        fullWidth
        label="GST Number"
        value={form.gst_no}
        onChange={(e) => handleFieldChange('gst_no', e.target.value)}
        onBlur={() => handleBlur('gst_no')}
        slotProps={{
                  input: {
                    startAdornment: (
                    <InputAdornment position="start">
                            <Receipt fontSize="small" />
                          </InputAdornment>
                    ),
                  },
                }}
        {...fieldProps("gst_no")}
      />
    </Grid>

    <Grid size={{ xs: 12, md: 4 }}>
      <TextField
        fullWidth
        multiline
        minRows={1}
        label="Address"
        value={form.address}
        onChange={(e) => handleFieldChange('address', e.target.value)}
        onBlur={() => handleBlur('address')}
         slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <Home fontSize="small" />
        </InputAdornment>
      ),
    },
  }}
        {...fieldProps("address")}
      />
    </Grid>

    {/* ================= ROW 3 ================= */}
   <Grid size={{ xs: 12, md: 4 }}>
  <TextField
    fullWidth
    select
    label="State"
    value={form.state}
    onChange={(e) => handleFieldChange("state", e.target.value)}
    onBlur={() => handleBlur("state")}
    {...fieldProps("state")}
  >
    {states.map((state) => (
      <MenuItem key={state.name} value={state.name}>
        {state.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>

    <Grid size={{ xs: 12, md: 4 }}>
  <TextField
    fullWidth
    select
    label="City"
    value={form.city}
    onChange={(e) => handleFieldChange("city", e.target.value)}
    onBlur={() => handleBlur("city")}
    disabled={!form.state}
    {...fieldProps("city")}
  >
    {cities.map((city) => (
      <MenuItem key={city.name} value={city.name}>
        {city.name}
      </MenuItem>
    ))}
  </TextField>
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
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this client?
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