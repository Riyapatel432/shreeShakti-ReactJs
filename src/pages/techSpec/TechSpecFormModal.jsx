import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTechSpec } from "../../redux/slices/techSpecSlice";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Grid, TextField, Typography, Box, Divider, MenuItem, IconButton, Switch, FormControlLabel
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function TechSpecFormModal({ open, onClose, spec }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (spec) {
      setForm({
        ...spec,
        moc: spec.moc || { shell: '', head: '', nozzles: '' },
        categoryDetails: spec.categoryDetails || {},
        nozzleSchedule: spec.nozzleSchedule || []
      });
    }
  }, [spec]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMocChange = (e) => {
    setForm({ ...form, moc: { ...form.moc, [e.target.name]: e.target.value } });
  };

  const handleCategoryDetailChange = (e) => {
    setForm({ ...form, categoryDetails: { ...form.categoryDetails, [e.target.name]: e.target.value } });
  };

  const handleAddNozzle = () => {
    setForm({
      ...form,
      nozzleSchedule: [...form.nozzleSchedule, { mark: '', service: '', size: '', rating: '', type: '', qty: 1 }]
    });
  };

  const handleNozzleChange = (index, field, value) => {
    const updated = [...form.nozzleSchedule];
    updated[index][field] = value;
    setForm({ ...form, nozzleSchedule: updated });
  };

  const handleRemoveNozzle = (index) => {
    const updated = [...form.nozzleSchedule];
    updated.splice(index, 1);
    setForm({ ...form, nozzleSchedule: updated });
  };

  const handleSubmit = async (incrementRevision = false) => {
    setLoading(true);
    const dataToSubmit = { ...form, incrementRevision };
    const res = await dispatch(updateTechSpec({ id: spec._id, data: dataToSubmit }));
    setLoading(false);

    if (res.meta?.requestStatus === "fulfilled") {
      Swal.fire("Saved", "Technical Specification updated", "success");
      onClose();
    } else {
      Swal.fire("Error", res.payload?.message || "Something went wrong", "error");
    }
  };

  if (!form) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Technical Specification</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">General Details</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}><TextField fullWidth label="Client" value={form.client?.company_name || ""} disabled /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Project" value={form.project?.name || ""} disabled /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Product Category" value={form.product_category || ""} disabled /></Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth select label="Status" name="status" value={form.status} onChange={handleChange}>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Issued">Issued</MenuItem>
                <MenuItem value="Superseded">Superseded</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Header Parameters</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}><TextField fullWidth label="Design Code" name="designCode" value={form.designCode || ""} onChange={handleChange} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Design Pressure" name="designPressure" value={form.designPressure || ""} onChange={handleChange} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Design Temperature" name="designTemperature" value={form.designTemperature || ""} onChange={handleChange} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Corrosion Allowance" name="corrosionAllowance" value={form.corrosionAllowance || ""} onChange={handleChange} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Capacity / Volume" name="capacity" value={form.capacity || ""} onChange={handleChange} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Painting Spec" name="paintingSpec" value={form.paintingSpec || ""} onChange={handleChange} /></Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel 
                control={<Switch checked={!!form.insulation} onChange={(e) => setForm({...form, insulation: e.target.checked})} />} 
                label="Requires Insulation" 
              />
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Material of Construction (MOC)</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}><TextField fullWidth label="Shell" name="shell" value={form.moc?.shell || ""} onChange={handleMocChange} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Head" name="head" value={form.moc?.head || ""} onChange={handleMocChange} /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Nozzles" name="nozzles" value={form.moc?.nozzles || ""} onChange={handleMocChange} /></Grid>
          </Grid>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">Category Specific Details ({form.product_category})</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {form.product_category === "HeatExchanger" && (
              <>
                <Grid item xs={12} md={4}><TextField fullWidth label="TEMA Type" name="temaType" value={form.categoryDetails?.temaType || ""} onChange={handleCategoryDetailChange} /></Grid>
                <Grid item xs={12} md={4}><TextField fullWidth label="Tube Count" name="tubeCount" value={form.categoryDetails?.tubeCount || ""} onChange={handleCategoryDetailChange} /></Grid>
                <Grid item xs={12} md={4}><TextField fullWidth label="Bundle Diameter" name="bundleDiameter" value={form.categoryDetails?.bundleDiameter || ""} onChange={handleCategoryDetailChange} /></Grid>
              </>
            )}
            {form.product_category === "StorageTank" && (
              <>
                <Grid item xs={12} md={4}><TextField fullWidth label="Tank OD" name="tankOD" value={form.categoryDetails?.tankOD || ""} onChange={handleCategoryDetailChange} /></Grid>
                <Grid item xs={12} md={4}><TextField fullWidth label="Tank Height" name="tankHeight" value={form.categoryDetails?.tankHeight || ""} onChange={handleCategoryDetailChange} /></Grid>
                <Grid item xs={12} md={4}><TextField fullWidth label="Orientation" name="orientation" value={form.categoryDetails?.orientation || ""} onChange={handleCategoryDetailChange} /></Grid>
              </>
            )}
            {/* Fallback for others to just view JSON or generic inputs can be added */}
             {!["HeatExchanger", "StorageTank"].includes(form.product_category) && (
               <Grid item xs={12}>
                 <Typography variant="body2" color="textSecondary">No specific fields mapped for {form.product_category} yet. Additional details can be added manually.</Typography>
                 <TextField fullWidth multiline rows={3} label="Additional Details" name="misc" value={form.categoryDetails?.misc || ""} onChange={handleCategoryDetailChange} sx={{mt: 2}}/>
               </Grid>
             )}
          </Grid>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Nozzle Schedule</Typography>
            <Button startIcon={<Add />} variant="outlined" size="small" onClick={handleAddNozzle}>Add Nozzle</Button>
          </Box>
          {form.nozzleSchedule.map((nozzle, idx) => (
            <Grid container spacing={1} sx={{ mb: 1 }} key={idx}>
              <Grid item xs={2}><TextField size="small" fullWidth label="Mark" value={nozzle.mark} onChange={(e) => handleNozzleChange(idx, "mark", e.target.value)} /></Grid>
              <Grid item xs={3}><TextField size="small" fullWidth label="Service" value={nozzle.service} onChange={(e) => handleNozzleChange(idx, "service", e.target.value)} /></Grid>
              <Grid item xs={2}><TextField size="small" fullWidth label="Size (NB)" value={nozzle.size} onChange={(e) => handleNozzleChange(idx, "size", e.target.value)} /></Grid>
              <Grid item xs={2}><TextField size="small" fullWidth label="Rating" value={nozzle.rating} onChange={(e) => handleNozzleChange(idx, "rating", e.target.value)} /></Grid>
              <Grid item xs={2}><TextField size="small" fullWidth label="Type" value={nozzle.type} onChange={(e) => handleNozzleChange(idx, "type", e.target.value)} /></Grid>
              <Grid item xs={1}>
                <IconButton color="error" onClick={() => handleRemoveNozzle(idx)}><Delete /></IconButton>
              </Grid>
            </Grid>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Box>
          <Button onClick={() => handleSubmit(false)} variant="contained" color="primary" disabled={loading} sx={{ mr: 1 }}>Save</Button>
          <Button onClick={() => handleSubmit(true)} variant="outlined" color="warning" disabled={loading}>Save & Revise</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
