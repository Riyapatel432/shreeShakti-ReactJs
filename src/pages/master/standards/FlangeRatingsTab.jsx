import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlangeRatings, addFlangeRating, updateFlangeRating, deleteFlangeRating, fetchNBSizes } from "../../../redux/slices/standardsSlice";
import DataTable from "../../../components/common/DataTable";
import FormModal from "../../../components/common/FormModal";
import { Box, TextField, Grid, IconButton, Tooltip, MenuItem, Chip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import Snackbar from "../../../components/common/Snackbar";

export default function FlangeRatingsTab() {
  const dispatch = useDispatch();
  const { flangeRatings, nbSizes, loading } = useSelector((state) => state.standards);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const initialForm = { nbSize: "", ratingClass: "", flangeOD: "", pcd: "", numBolts: "", boltSize: "", status: true };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchFlangeRatings());
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
    setForm({ 
      nbSize: row.nbSize?._id || "", 
      ratingClass: row.ratingClass, 
      flangeOD: row.flangeOD, 
      pcd: row.pcd, 
      numBolts: row.numBolts, 
      boltSize: row.boltSize,
      status: row.status ?? true
    });
    setServerError("");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.nbSize || !form.ratingClass || !form.flangeOD) {
      setServerError("NB Size, Rating Class, and Flange OD are required");
      return;
    }
    setFormLoading(true);
    setServerError("");
    
    let res;
    if (isEdit) {
      res = await dispatch(updateFlangeRating({ id: editingId, data: form }));
    } else {
      res = await dispatch(addFlangeRating(form));
    }

    setFormLoading(false);
    if (res.meta?.requestStatus === "fulfilled") {
      dispatch(fetchFlangeRatings());
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
    const res = await dispatch(deleteFlangeRating(id));
    if (res.meta?.requestStatus === "fulfilled") {
      setSuccessMessage("Deleted successfully");
      dispatch(fetchFlangeRatings());
    } else {
      setServerError(res.payload?.message || "Failed to delete");
    }
  };

  const columns = [
    { id: "sr", label: "Sr No", width: 80, render: (_, index) => index + 1 },
    { id: "nbSize", label: "NB Size", render: (row) => row.nbSize ? `${row.nbSize.nb_inch} (${row.nbSize.nb_mm}mm)` : "-" },
    { id: "ratingClass", label: "Class" },
    { id: "flangeOD", label: "OD (mm)" },
    { id: "pcd", label: "PCD (mm)" },
    { id: "bolts", label: "Bolts", render: (row) => `${row.numBolts} x ${row.boltSize}` },
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
      <DataTable title="Flange Ratings" columns={columns} data={flangeRatings || []} loading={loading} onAddClick={handleAdd} addLabel="New Rating" />
      <FormModal open={modalOpen} onClose={() => setModalOpen(false)} title={isEdit ? "Edit Rating" : "Add Rating"} onSubmit={handleSubmit} submitLabel={isEdit ? "Update" : "Save"} serverError={serverError} setServerError={setServerError} maxWidth="sm" loading={formLoading}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth select label="NB Size" value={form.nbSize} onChange={(e) => setForm({ ...form, nbSize: e.target.value })}>
              {nbSizes.map(nb => <MenuItem key={nb._id} value={nb._id}>{nb.nb_inch} ({nb.nb_mm}mm)</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Rating Class (e.g. 150#)" value={form.ratingClass} onChange={(e) => setForm({ ...form, ratingClass: e.target.value })} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Flange OD (mm)" type="number" value={form.flangeOD} onChange={(e) => setForm({ ...form, flangeOD: e.target.value })} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="PCD (mm)" type="number" value={form.pcd} onChange={(e) => setForm({ ...form, pcd: e.target.value })} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="No. of Bolts" type="number" value={form.numBolts} onChange={(e) => setForm({ ...form, numBolts: e.target.value })} /></Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Bolt Size (e.g. M16)" value={form.boltSize} onChange={(e) => setForm({ ...form, boltSize: e.target.value })} /></Grid>
          <Grid item xs={12} md={6}>
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
