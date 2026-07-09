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
  fetchProduct,
  addProduct,
  updateProduct,
  deleteProduct
} from "../../redux/slices/productSlice";
import {
  fetchUnit
} from "../../redux/slices/unitSlice";
import {
  fetchProductCategory,
} from "../../redux/slices/productCategorySlice";
import { fetchMoc } from "../../redux/slices/moc.Slice";

// ================= VALIDATION RULES =================
const VALIDATION = {
  name: {
    required: true, 
    unique: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s.'-]+$/,
    patternMsg: "Only letters, spaces, dots, apostrophes and hyphens allowed"
  },
  description: {
    required: true,
    minLength: 5,
    maxLength: 250
  },
  unit:{
    required:true
  },
    hsn_code:{
    required:true
  },
  product_category:{
    required:true
  },
 
};


export default function ProductPage() {

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
  name: "",
  product_category: "",
  moc:"",
  unit: "",
  hsn_code: "",
  description: "",
  status: true,
};

  const [form, setForm] = useState(initialForm);
const [debouncedSearch, setDebouncedSearch] = useState("");
const {
  data: clients,
  loading: tableLoading,
  pagination,
} = useSelector((state) => state.products);
const { data: units } = useSelector(
  (state) => state.units
);

useEffect(() => {
  dispatch(
    fetchUnit({
    
      status: true,
    })
  );
}, [dispatch,status]);
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
const { data: productCategories } = useSelector(
  (state) => state.productCategories
);
const { data: mocs = [] } = useSelector((state) => state.mocs);
useEffect(() => {
  dispatch(fetchMoc({status:true}));
}, [dispatch]);

useEffect(() => {
  dispatch(
    fetchProductCategory({
      status:true
    })
  );
}, [dispatch,status]);
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
          fieldName === 'unit' ? 'Unit' :
          fieldName === 'moc' ? 'MOC' :
          fieldName === 'hsn_code' ? 'HSN Code' :
          fieldName === 'product_category' ? 'Product Category' :
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
    product_category:
      row.product_category?._id ||
      row.product_category ||
      "",

    unit:
      row.unit?._id ||
      row.unit ||
      "",
    moc:
      row.moc?._id ||
      row.moc ||
      "",
    hsn_code: row.hsn_code || "",
    description: row.description || "",
    status: row.status ?? true,
  });

  setErrors({});
  setTouched({});
  setServerError("");
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
        res = await dispatch(updateProduct({ id: editingId, data: form }));
      } else {
        res = await dispatch(addProduct(form));
      }

      setFormLoading(false);

      // Check if the action was fulfilled
     if (res.meta?.requestStatus === "fulfilled") {
 dispatch(
    fetchProduct({
      page: currentPage,
      limit,
      search,
    })
  );

  setSuccessMessage(
    isEdit
      ? "Product  updated successfully"
      : "Product  created successfully"
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
  const res = await dispatch(deleteProduct(deleteId));

  if (res.meta?.requestStatus === "fulfilled") {
    await dispatch(
      fetchProduct({
        page: currentPage,
        limit,
        search,
      })
    );

    setSuccessMessage(
      "Product deleted successfully"
    );
  } else {
    setServerError(
      res.payload?.message ||
        "Failed to delete product"
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
    label: "Category",
    render: (row) =>
      row.product_category?.name || "-",
  },
    {
    id: "name",
    label: "Product Name",
  },
{
  id: "moc",
  label: "MOC",
  render: (row) =>
    row.moc?.name || row.moc || "-",
},
{
  id: "unit",
  label: "Unit",
  render: (row) =>
    row.unit?.name || row.unit || "-",
},

  {
    id: "hsn_code",
    label: "HSN Code",
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
        <Tooltip title="Edit Product">
          <IconButton
            onClick={() => handleEdit(row)}
            color="primary"
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Product">
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
          Products
        </Typography>

        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Master</Link>
          <Typography color="warning.main">Products</Typography>
        </Breadcrumbs>
      </Box>

      {/* TABLE */}
<DataTable
  title="Products"
  columns={columns}
  data={clients || []}
  loading={tableLoading}

  searchPlaceholder="Search Products"
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
  addLabel="New Product "
/>

      {/* MODAL */}
   <FormModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  title={isEdit ? "Edit Product " : "Add New Product "}
  onSubmit={handleSubmit}
  submitLabel={isEdit ? "Update" : "Save"}
  serverError={serverError}
  setServerError={setServerError}
  maxWidth="lg"
  fullWidth
  loading={formLoading}
>
 <Grid container spacing={2}>


  {/* Product  */}
<Grid size={{ xs: 12, md: 6 }}>
  <TextField
    fullWidth
    select
    label="Product Category"
    value={form.product_category}
    onChange={(e) =>
      handleFieldChange("product_category", e.target.value)
    }
    onBlur={() => handleBlur("product_category")}
    {...fieldProps("product_category")}
  >
    <MenuItem value="">Select Product Category</MenuItem>

    {productCategories?.map((item) => (
      <MenuItem key={item._id} value={item._id}>
        {item.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>

  {/* Product Name */}
  <Grid size={{ xs: 12, md: 6 }}>
    <TextField
      fullWidth
      label="Product Name"
      value={form.name}
      onChange={(e) => handleFieldChange("name", e.target.value)}
      onBlur={() => handleBlur("name")}
      {...fieldProps("name")}
    />
  </Grid>

<Grid size={{ xs: 12, md: 6 }}>
  <TextField
    fullWidth
    select
    label="MOC"
    value={form.moc}
    onChange={(e) => handleFieldChange("moc", e.target.value)}
     onBlur={() => handleBlur("moc")}   // 👈 important
    {...fieldProps("moc")} 
  >
    <MenuItem value="">Select MOC</MenuItem>

    {mocs.map((item) => (
      <MenuItem key={item._id} value={item._id}>
        {item.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>

  {/* Unit */}
<Grid size={{ xs: 12, md: 6 }}>
  <TextField
    fullWidth
    select
    label="Unit"
    value={form.unit}
    onChange={(e) =>
      handleFieldChange("unit", e.target.value)
    }
    {...fieldProps("unit")}
  >
    {units?.map((item) => (
      <MenuItem key={item._id} value={item._id}>
        {item.name}
      </MenuItem>
    ))}
  </TextField>
</Grid>

  {/* HSN Code */}
  <Grid size={{ xs: 12, md: 6 }}>
    <TextField
      fullWidth
      label="HSN Code"
      value={form.hsn_code}
      onChange={(e) => handleFieldChange("hsn_code", e.target.value)}
      onBlur={() => handleBlur("hsn_code")}
      {...fieldProps("hsn_code")}
    />
  </Grid>

  {/* Description */}
  <Grid size={{ xs: 12 }}>
    <TextField
      fullWidth
      multiline
      rows={3}
      label="Description"
      value={form.description}
      onChange={(e) =>
        handleFieldChange("description", e.target.value)
      }
      onBlur={() => handleBlur("description")}
      {...fieldProps("description")}
    />
  </Grid>

  {/* Status */}
  <Grid size={{ xs: 12, md: 4 }}>
    <TextField
      fullWidth
      select
      label="Status"
      value={form.status}
      onChange={(e) =>
        setForm({
          ...form,
          status: e.target.value === "true",
        })
      }
    >
      <MenuItem value="true">Active</MenuItem>
      <MenuItem value="false">Inactive</MenuItem>
    </TextField>
  </Grid>

</Grid>
</FormModal>

      {/* DELETE CONFIRM */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Product </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Product ?
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