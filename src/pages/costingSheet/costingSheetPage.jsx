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
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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
import {
    fetchCostingSheet,
    addCostingSheet,
    updateCostingSheet,
    deleteCostingSheet
} from "../../redux/slices/costingSheet/costingSheetSlice";
import {fetchPrice} from "../../redux/slices/priceSlice";
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

};


export default function costingSheetPage() {

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
  product_category: "",
  product: "",
  moc: "",
  dimensions: {
    od: 0,
    id: 0,
    l: 0,
    w: 0,
    thk: 0,
    nos: 0,
    std: 0,
  },
  qty: "",
  rate: "",
  amount: "",
  status: true,
};
const dimensionFields = [
  { key: "od", label: "OD" },
  { key: "id", label: "ID" },
  { key: "l", label: "L" },
  { key: "w", label: "W" },
  { key: "thk", label: "THK" },
  { key: "nos", label: "NOS" },
  { key: "std", label: "STD." },
];
  const [form, setForm] = useState(initialForm);
const [debouncedSearch, setDebouncedSearch] = useState("");
const {
  data: prices = [],
} = useSelector((state) => state.prices);
const {
  data: products = [],
} = useSelector((state) => state.products);
const {
  data: productCategories = [],
} = useSelector((state) => state.productCategories);
const {
  data: costingSheets = [],
  loading: tableLoading,
  pagination,
} = useSelector((state) => state.costingSheets);
const filteredProducts = products.filter(
  (item) => item.product_category?._id === form.product_category
);

useEffect(() => {
  dispatch(
    fetchProduct({
     status:true
    })
  );
}, [dispatch, status]);

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
      status:true
    })
  );
}, [dispatch, status]);

useEffect(() => {
  dispatch(
    fetchCostingSheet({
      page: currentPage,
      limit,
      search: debouncedSearch,
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
  moc:"MOC",
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
const handleFieldChange = async (field, value) => {
  setForm((prev) => {
    const updated = {
      ...prev,
      [field]: value,
    };

    // Product Category Changed
    if (field === "product_category") {
      updated.product = "";
      updated.moc = "";
      updated.rate = "";
      updated.qty = "";
      updated.amount = "";
    }

    return updated;
  });

  // Product Changed
if (field === "product") {
  const selectedProduct = products.find(
    (item) => item._id === value
  );

  const latestPrice = prices
    .filter(
      (item) =>
        item.product?._id === value &&
        item.status === true
    )
    .sort(
      (a, b) =>
        new Date(b.effective_date) -
        new Date(a.effective_date)
    )[0];

  const rate = latestPrice?.current_price || 0;

  setForm((prev) => ({
    ...prev,
    product: value,
    moc: selectedProduct?.moc?._id || "",
    dimensions: selectedProduct?.dimensions || {
      od: 0,
      id: 0,
      l: 0,
      w: 0,
      thk: 0,
      nos: 0,
      std: 0,
    },
    rate,
  }));

  return;
}

  // Qty Changed
  if (field === "qty") {
    setForm((prev) => ({
      ...prev,
      qty: value,
      amount: Number(value || 0) * Number(prev.rate || 0),
    }));
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
    product_category: row.product_category?._id || "",
    product: row.product?._id || "",
    moc: row.moc?._id || row.product?.moc?._id || "",
    dimensions: row.dimensions || {
      od: 0,
      id: 0,
      l: 0,
      w: 0,
      thk: 0,
      nos: 0,
      std: 0,
    },
    qty: row.qty || "",
    rate: row.rate || "",
    amount: row.amount || "",
    status: row.status ?? true,
  });

  setErrors({});
  setTouched({});
  setModalOpen(true);
};
const calculateQty = (categoryName, d) => {
    const {
        od = 0,
        id = 0,
        l = 0,
        w = 0,
        thk = 0,
        nos = 1,
    } = d;

    switch ((categoryName || "").toLowerCase()) {

        case "pipe":
        case "tube":
            return (
                ((od - thk) * thk *  l * nos) /
                1000
            );

        case "plate":
        case "sheet":
            return (
                (l * w * thk * 7.85 * nos) /
                1000000
            );

        case "round bar":
        case "shaft":
            return (
                (od * od * 0.006165 * l * nos) /
                1000
            );

        case "ring":
        case "flange":
            return (
                ((od * od - id * id) *
                    0.006165 *
                    thk *
                    nos) /
                1000
            );

        default:
            return 0;
    }
};

useEffect(() => {
  if (!form.product_category) return;

  const categoryName =
    productCategories.find(
      (item) => item._id === form.product_category
    )?.name || "";

  const qty = calculateQty(
    categoryName,
    form.dimensions || {}
  );

  setForm((prev) => ({
    ...prev,
    qty: qty.toFixed(3),
    amount: (
      qty *
      Number(prev.rate || 0)
    ).toFixed(2),
  }));
}, [
  form.product_category,
  form.dimensions,
  form.rate,
  productCategories,
]);

const handleDimensionChange = (key, value) => {
  setForm((prev) => ({
    ...prev,
    dimensions: {
      ...prev.dimensions,
      [key]: Number(value),
    },
  }));
};
  // ================= SUBMIT =================
  const handleSubmit = async () => {
console.log("in submit=======>");
    // Client-side validation gate
    if (!validateForm()) return;
console.log("after validation=======>");

    setServerError("");
    setFormLoading(true);

    try {
      let res;
console.log("ressss=======>");

      if (isEdit) {
console.log("in if block=======>");

        res = await dispatch(updateCostingSheet({ id: editingId, data: form }));
      } else {
console.log("in else block=======>");

        res = await dispatch(addCostingSheet(form));
      }

      setFormLoading(false);

      // Check if the action was fulfilled
     if (res.meta?.requestStatus === "fulfilled") {
console.log("in fulfilled=======>");

 dispatch(
    fetchCostingSheet({
      page: currentPage,
      limit,
      search,
    })
  );

  setSuccessMessage(
    isEdit
      ? "CostingSheet updated successfully"
      : "CostingSheet created successfully"
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
  const res = await dispatch(deleteCostingSheet(deleteId));

  if (res.meta?.requestStatus === "fulfilled") {
     dispatch(
    fetchCostingSheet({
      page: currentPage,
      limit,
      search,
    })
  );
    setSuccessMessage("CostingSheet deleted successfully");
  } else {
    setServerError(
      res.payload?.message || "Failed to delete CostingSheet"
    );
  }

  setDeleteDialog(false);
  setDeleteId(null);
};

const formatDimensions = (dimensions = {}) => {
  const parts = [];

  if (dimensions.od)
    parts.push(`${dimensions.od} OD`);

  if (dimensions.id)
    parts.push(`${dimensions.id} ID`);

  if (dimensions.l)
    parts.push(`${dimensions.l} L`);

  if (dimensions.w)
    parts.push(`${dimensions.w} W`);

  if (dimensions.thk)
    parts.push(`${dimensions.thk} THK`);

  if (dimensions.nos)
    parts.push(`${dimensions.nos} NOS`);

  if (dimensions.std)
    parts.push(`${dimensions.std} STD`);

  return parts.join(" X ");
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
    id: "moc",
    label: "MOC",
    render: (row) => row.product?.moc?.name || "-",
  },

   {
  id: "dimensions",
  label: "Dimensions",
  render: (row) => formatDimensions(row.dimensions),
},
  {
    id: "qty",
    label: "Qty",
  },

  {
    id: "rate",
    label: "Rate",
   
  },
  {
    id: "amount",
    label: "Amount",
   
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
        <Tooltip title="Edit Costing Sheet">
          <IconButton
            onClick={() => handleEdit(row)}
            color="primary"
            size="small"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Costing Sheet">
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

  // ================= UI =================
  return (
    <Box>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800}>
          Costing Sheet
        </Typography>

        <Breadcrumbs separator={<NavIcon fontSize="small" />}>
          <Link underline="hover">Master</Link>
          <Typography color="warning.main">Costing Sheet</Typography>
        </Breadcrumbs>
      </Box>

      {/* TABLE */}
<DataTable
  title="Costing Sheets"
  columns={columns}
  data={costingSheets || []}
  loading={tableLoading}

  searchPlaceholder="Search costing Sheets"
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
  addLabel="New Costing Sheet"
/>

      {/* MODAL */}
   <FormModal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  title={isEdit ? "Edit Costing Sheet" : "Add New Costing Sheet"}
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
  label="MOC"
  value={
    products.find((p) => p._id === form.product)?.moc?.name || ""
  }
  disabled
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
/>
</Grid>

{/* Dimensions */}
<Grid size={{ xs: 12 }}>
  <Typography variant="subtitle2" sx={{ mb: 1 }}>
    Dimensions
  </Typography>

  <Grid container spacing={2}>
    {dimensionFields.map((field) => (
      <Grid key={field.key} size={{ xs: 6, sm: 4, md: 3 }}>
        <TextField
          fullWidth
          label={field.label}
          type="number"
          value={form.dimensions?.[field.key] ?? 0}
         onChange={(e) =>
  handleDimensionChange(field.key, e.target.value)
}
        />
      </Grid>
    ))}
  </Grid>
</Grid>
<Grid size={{ xs: 12, md: 4 }}>
<TextField
  fullWidth
  label="Qty (Kg)"
  value={form.qty}
  disabled
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
/>
</Grid>

<Grid size={{ xs: 12, md: 4 }}>
  <TextField
    fullWidth
    label="Rate"
    type="number"
    value={form.rate}
    onChange={(e) => {
      const rate = e.target.value;

      setForm((prev) => ({
        ...prev,
        rate,
        amount: Number(prev.qty || 0) * Number(rate || 0),
      }));
    }}
    slotProps={{
      inputLabel: {
        shrink: true,
      },
    }}
  />
</Grid>



<Grid size={{ xs: 12, md: 4 }}>
<TextField
  fullWidth
  label="Amount"
  value={form.amount}
  disabled
  slotProps={{
    inputLabel: {
      shrink: true,
    },
  }}
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