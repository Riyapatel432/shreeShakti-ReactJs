import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPipeSchedules, addPipeSchedule, updatePipeSchedule, deletePipeSchedule, fetchNBSizes } from "../../../redux/slices/standardsSlice";
import DataTable from "../../../components/common/DataTable";
import FormModal from "../../../components/common/FormModal";
import { Box, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, Tooltip, IconButton, MenuItem, Chip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import Snackbar from "../../../components/common/SnackBar";

export default function PipeSchedulesTab() {
  const dispatch = useDispatch();
  const { pipeSchedules, nbSizes, loading } = useSelector((state) => state.standards);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const initialForm = { nbSize: "", schedule: "", wallThickness: "", status: true };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchPipeSchedules());
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
    setForm({ nbSize: row.nbSize?._id || "", schedule: row.schedule, wallThickness: row.wallThickness, status: row.status ?? true });
    setServerError("");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.nbSize || !form.schedule || !form.wallThickness) {
      setServerError("All fields are required");
      return;
    }
    setFormLoading(true);
    setServerError("");
    
    let res;
    if (isEdit) {
      res = await dispatch(updatePipeSchedule({ id: editingId, data: form }));
    } else {
      res = await dispatch(addPipeSchedule(form));
    }

    setFormLoading(false);
    if (res.meta?.requestStatus === "fulfilled") {
      dispatch(fetchPipeSchedules());
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
    const res = await dispatch(deletePipeSchedule(id));
    if (res.meta?.requestStatus === "fulfilled") {
      setSuccessMessage("Deleted successfully");
      dispatch(fetchPipeSchedules());
    } else {
      setServerError(res.payload?.message || "Failed to delete");
    }
    setDeleteDialog(false);
    setDeleteId(null);
  };

  const columns = [
    { id: "sr", label: "Sr No", width: 80, render: (_, index) => index + 1 },
    { id: "nbSize", label: "NB Size", render: (row) => row.nbSize ? `${row.nbSize.nb_inch} (${row.nbSize.nb_mm}mm)` : "-" },
    { id: "schedule", label: "Schedule" },
    { id: "wallThickness", label: "Wall Thickness (mm)" },
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
        title="Pipe Schedules"
        columns={columns}
        data={pipeSchedules || []}
        loading={loading}
        onAddClick={handleAdd}
        addLabel="New Schedule"
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEdit ? "Edit Schedule" : "Add Schedule"}
        onSubmit={handleSubmit}
        submitLabel={isEdit ? "Update" : "Save"}
        serverError={serverError}
        setServerError={setServerError}
        maxWidth="sm"
        loading={formLoading}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth select label="NB Size" value={form.nbSize} onChange={(e) => setForm({ ...form, nbSize: e.target.value })}>
              {nbSizes.map(nb => <MenuItem key={nb._id} value={nb._id}>{nb.nb_inch} ({nb.nb_mm}mm)</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Schedule (e.g. 10S, 40)" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Wall Thickness (mm)" type="number" value={form.wallThickness} onChange={(e) => setForm({ ...form, wallThickness: e.target.value })} />
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
