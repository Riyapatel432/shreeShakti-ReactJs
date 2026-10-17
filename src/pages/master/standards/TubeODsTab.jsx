import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTubeODs, addTubeOD, updateTubeOD, deleteTubeOD } from "../../../redux/slices/standardsSlice";
import DataTable from "../../../components/common/DataTable";
import FormModal from "../../../components/common/FormModal";
import { Box, TextField, Grid, IconButton, Tooltip, Chip, MenuItem } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import Snackbar from "../../../components/common/SnackBar";

export default function TubeODsTab() {
  const dispatch = useDispatch();
  const { tubeODs, loading } = useSelector((state) => state.standards);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);

  const initialForm = { od_inch: "", od_mm: "", status: true };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchTubeODs());
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
    setForm({ od_inch: row.od_inch, od_mm: row.od_mm, status: row.status ?? true });
    setServerError("");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.od_inch || !form.od_mm) {
      setServerError("All fields are required");
      return;
    }
    setFormLoading(true);
    setServerError("");
    
    let res;
    if (isEdit) {
      res = await dispatch(updateTubeOD({ id: editingId, data: form }));
    } else {
      res = await dispatch(addTubeOD(form));
    }

    setFormLoading(false);
    if (res.meta?.requestStatus === "fulfilled") {
      dispatch(fetchTubeODs());
      setSuccessMessage(isEdit ? "Updated successfully" : "Added successfully");
      setModalOpen(false);
    } else {
      setServerError(res.payload?.message || "Something went wrong");
    }
  };

  const handleDeleteClick = (id) => {
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
    const res = await dispatch(deleteTubeOD(id));
    if (res.meta?.requestStatus === "fulfilled") {
      setSuccessMessage("Deleted successfully");
      dispatch(fetchTubeODs());
    } else {
      setServerError(res.payload?.message || "Failed to delete");
    }
  };

  const columns = [
    { id: "sr", label: "Sr No", width: 80, render: (_, index) => index + 1 },
    { id: "od_inch", label: "OD (inch)" },
    { id: "od_mm", label: "OD (mm)" },
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
      <DataTable title="Tube ODs" columns={columns} data={tubeODs || []} loading={loading} onAddClick={handleAdd} addLabel="New Tube OD" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? "Edit Tube OD" : "Add Tube OD"} onSubmit={handleSubmit} submitLabel={isEdit ? "Update" : "Save"} serverError={serverError} setServerError={setServerError} maxWidth="sm" loading={formLoading}>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="OD (inch)" value={form.od_inch} onChange={(e) => setForm({ ...form, od_inch: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="OD (mm)" type="number" value={form.od_mm} onChange={(e) => setForm({ ...form, od_mm: e.target.value })} /></Grid>
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
