import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNBSizes, addNBSize, updateNBSize, deleteNBSize } from "../../../redux/slices/standardsSlice";
import DataTable from "../../../components/common/DataTable";
import FormModal from "../../../components/common/FormModal";
import { Box, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, IconButton, InputAdornment, Chip, MenuItem } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import Snackbar from "../../../components/common/SnackBar";

export default function NBSizesTab() {
  const dispatch = useDispatch();
  const { nbSizes, loading } = useSelector((state) => state.standards);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const initialForm = { nb_inch: "", nb_mm: "", od_mm: "", status: true };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchNBSizes());
  }, [dispatch]);

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
    setForm({ nb_inch: row.nb_inch, nb_mm: row.nb_mm, od_mm: row.od_mm, status: row.status ?? true });
    setServerError("");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.nb_inch || !form.nb_mm || !form.od_mm) {
      setServerError("All fields are required");
      return;
    }
    setFormLoading(true);
    setServerError("");
    
    let res;
    if (isEdit) {
      res = await dispatch(updateNBSize({ id: editingId, data: form }));
    } else {
      res = await dispatch(addNBSize(form));
    }

    setFormLoading(false);
    if (res.meta?.requestStatus === "fulfilled") {
      dispatch(fetchNBSizes());
      setSuccessMessage(isEdit ? "Updated successfully" : "Added successfully");
      setModalOpen(false);
    } else {
      setServerError(res.payload?.message || "Something went wrong");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteConfirm(id);
      }
    });
  };

  const handleDeleteConfirm = async (id) => {
    const res = await dispatch(deleteNBSize(id));
    if (res.meta?.requestStatus === "fulfilled") {
      setSuccessMessage("Deleted successfully");
      dispatch(fetchNBSizes());
    } else {
      setServerError(res.payload?.message || "Failed to delete");
    }
    setDeleteDialog(false);
    setDeleteId(null);
  };

  const columns = [
    { id: "sr", label: "Sr No", width: 80, render: (_, index) => index + 1 },
    { id: "nb_inch", label: "NB (inch)" },
    { id: "nb_mm", label: "NB (mm)" },
    { id: "od_mm", label: "Outer Diameter (mm)" },
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
      id: "actions",
      label: "Actions",
      render: (row) => (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(row)} color="primary" size="small"><Edit fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteClick(row._id)} color="error" size="small"><Delete fontSize="small" /></IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  return (
    <Box>
      <DataTable
        title="NB Sizes"
        columns={columns}
        data={nbSizes || []}
        loading={loading}
        onAddClick={handleAdd}
        addLabel="New NB Size"
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEdit ? "Edit NB Size" : "Add NB Size"}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Update" : "Save"}
        serverError={serverError}
        setServerError={setServerError}
        maxWidth="sm"
        loading={formLoading}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="NB (inch)" value={form.nb_inch} onChange={(e) => setForm({ ...form, nb_inch: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="NB (mm)" type="number" value={form.nb_mm} onChange={(e) => setForm({ ...form, nb_mm: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Outer Diameter (mm)" type="number" value={form.od_mm} onChange={(e) => setForm({ ...form, od_mm: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value === true })}>
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FormModal>

      <Snackbar open={!!successMessage} message={successMessage} severity="success" onClose={() => setSuccessMessage("")} />
      <Snackbar open={!!serverError} message={serverError} severity="error" onClose={() => setServerError("")} />
    </Box>
  );
}
