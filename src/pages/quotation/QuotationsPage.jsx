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
  Map as MapIcon
} from '@mui/icons-material';

import DataTable from '../../components/common/DataTable';
import FormModal from '../../components/common/FormModal';
import countries from "../../city.json";
import {
  fetchPrice,
  addPrice,
  updatePrice,
  deletePrice
} from "../../redux/slices/priceSlice";
import { fetchProduct } from "../../redux/slices/productSlice";
import {fetchProductCategory} from "../../redux/slices/productCategorySlice";
// ================= VALIDATION RULES =================
const VALIDATION = {
  product: {
    required: true,
  },
 product_category: {
    required: true,
  },
  current_price: {
    required: true,
  },

  effective_date: {
    required: true,
  },
};


export default function QuotationsPage() {

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
  product: "",
   product_category: "",
  current_price: "",
  effective_date: "",
  status: true,
};

  const [form, setForm] = useState(initialForm);
const [debouncedSearch, setDebouncedSearch] = useState("");
const {
  data: prices = [],
  loading: tableLoading,
  pagination,
} = useSelector((state) => state.prices);
const {
  data: products = [],
} = useSelector((state) => state.products);
const {
  data: productCategories = [],
} = useSelector((state) => state.productCategories);

const filteredProducts = products.filter(
  (p) =>
    p.product_category?._id === form.product_category
);

useEffect(() => {
  dispatch(
    fetchProduct({
      page: currentPage,
      limit,
      search:debouncedSearch,
    })
  );
}, [dispatch, currentPage, limit, debouncedSearch]);

useEffect(() => {
  dispatch(
    fetchPrice({
      page: currentPage,
      limit,
      search:debouncedSearch,
    })
  );
}, [dispatch, currentPage, limit, debouncedSearch]);

useEffect(() => {
  dispatch(
    fetchProductCategory({
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

  const FIELD_LABELS = {
  product_category: "Product Category",
  product: "Product",
  current_price: "Current Price",
  effective_date: "Effective Date",
};
const trimmed =
  typeof value === "string"
    ? value.trim()
    : String(value ?? "").trim();
    // Required check
 if (rules.required && !trimmed) {
  return `${fieldName} is required`;
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

  setForm((prev) => {
    const updated = { ...prev, [fieldName]: value };

    // reset product when category changes
    if (fieldName === "product_category") {
      updated.product = "";
    }

    return updated;
  });

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
      
  product_category: row.product_category?._id || row.product_category || "",
  product: row.product?._id || row.product || "",
  current_price: row.current_price || "",
  effective_date: row.effective_date
    ? row.effective_date.split("T")[0]
    : "",
  status: row.status ?? true,
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
        res = await dispatch(updatePrice({ id: editingId, data: form }));
      } else {
        res = await dispatch(addPrice(form));
      }

      setFormLoading(false);

      // Check if the action was fulfilled
     if (res.meta?.requestStatus === "fulfilled") {
 dispatch(
    fetchPrice({
      page: currentPage,
      limit,
      search,
    })
  );

  setSuccessMessage(
    isEdit
      ? "Product price updated successfully"
      : "Product price created successfully"
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
  const res = await dispatch(deletePrice(deleteId));

  if (res.meta?.requestStatus === "fulfilled") {
    setSuccessMessage("Product price deleted successfully");
  } else {
    setServerError(
      res.payload?.message || "Failed to delete product price"
    );
  }

  setDeleteDialog(false);
  setDeleteId(null);
};
  // ================= TABLE =================
 const columns = [
  {
    id: "sr",
    label: "Sr No",
    width: 80,
    render: (_, index) =>
      (currentPage - 1) * limit + index + 1,
  },
 {
    id: "product_category",
    label: "Product Category",
    render: (row) => row.product_category?.name || "-",
  },
  {
    id: "product",
    label: "Product",
    render: (row) => row.product?.name || "-",
  },

  {
    id: "current_price",
    label: "Current Price",
  },

  {
    id: "effective_date",
    label: "Effective Date",
    render: (row) =>
      row.effective_date
        ? new Date(row.effective_date).toLocaleDateString("en-IN")
        : "-",
  },

  {
    id: "status",
    label: "Status",
    render: (row) => (
      <Chip
        label={row.status ? "Active" : "Inactive"}
        size="small"
        color={row.status ? "success" : "default"}
        variant="outlined"
      />
    ),
  },

  {
    id: "actions",
    label: "Actions",
    render: (row) => (
      <>
        <Tooltip title="Edit Price">
          <IconButton
            onClick={() => handleEdit(row)}
            color="primary"
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Price">
          <IconButton
            onClick={() => handleDeleteClick(row._id)}
            color="error"
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    ),
  },
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
          Quotations
        </Typography>

        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Master</Link>
          <Typography color="warning.main">Quotations</Typography>
        </Breadcrumbs>
      </Box>

      {/* TABLE */}
<DataTable
  title="Prices"
  columns={columns}
  data={prices || []}
  loading={tableLoading}

  searchPlaceholder="Search Prices"
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
  addLabel="New Quotation"
/>

      {/* MODAL */}
   <FormModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  title={isEdit ? "Edit Quotation" : "Add New Quotation"}
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
    select
    label="Product Category"
    value={form.product_category}
    onChange={(e) =>
      handleFieldChange("product_category", e.target.value)
    }
    {...fieldProps("product_category")}
  >
    <MenuItem value="">Select Product Category</MenuItem>

    {productCategories.map((item) => (
      <MenuItem key={item._id} value={item._id}>
        {item.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>

 <Grid size={{ xs: 12, md: 4 }}>
  <TextField
    fullWidth
    select
    label="Product"
    value={form.product}
    onChange={(e) =>
      handleFieldChange("product", e.target.value)
    }
    {...fieldProps("product")}
  >
    <MenuItem value="">Select Product</MenuItem>

   {filteredProducts.map((item) => (
  <MenuItem key={item._id} value={item._id}>
    {item.name}
  </MenuItem>
))}
  </TextField>
</Grid>

<Grid size={{ xs: 12, md: 4 }}>
  <TextField
    fullWidth
    type="number"
    label="Current Price"
    value={form.current_price}
    onChange={(e) =>
      handleFieldChange("current_price", e.target.value)
    }
    {...fieldProps("current_price")}
  />
</Grid>

<Grid size={{ xs: 12, md: 4 }}>
  <TextField
    fullWidth
    type="date"
    label="Effective Date"
    value={form.effective_date}
    onChange={(e) =>
      handleFieldChange("effective_date", e.target.value)
    }
    // InputLabelProps={{ shrink: true }}
    {...fieldProps("effective_date")}
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
        <DialogTitle>Delete Product Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Product Category?
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