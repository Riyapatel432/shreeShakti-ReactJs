import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Typography, Box } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { createPurchaseOrder, updatePurchaseOrder, fetchVendors } from "../../redux/slices/purchaseSlice";
import { getMaterials } from "../../redux/slices/materialSlice";

export default function PurchaseOrderFormModal({ open, onClose, po }) {
  const dispatch = useDispatch();
  const { vendors = [] } = useSelector((state) => state.purchase || {});
  const materials = useSelector((state) => state.materials?.materials || state.materials?.data || []);
  
  const [loading, setLoading] = useState(false);
  const isEdit = !!po;

  useEffect(() => {
    if (open) {
      dispatch(fetchVendors({ limit: 100 }));
      dispatch(getMaterials({ limit: 100 }));
    }
  }, [open, dispatch]);

  const [form, setForm] = useState({
    vendor: "",
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: "",
    lineItems: [],
    subtotal: 0,
    taxPercent: 0,
    taxAmount: 0,
    freight: 0,
    grandTotal: 0,
  });

  const [newItem, setNewItem] = useState({ material: "", description: "", qtyOrdered: 1, rate: 0 });

  useEffect(() => {
    if (po) {
      setForm({
        vendor: po.vendor?._id || po.vendor,
        orderDate: new Date(po.orderDate).toISOString().split('T')[0],
        expectedDeliveryDate: po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toISOString().split('T')[0] : "",
        lineItems: po.lineItems.map(li => ({
          material: li.material?._id || li.material,
          description: li.description || "",
          qtyOrdered: li.qtyOrdered,
          rate: li.rate,
          amount: li.amount
        })),
        subtotal: po.subtotal || 0,
        taxPercent: po.taxPercent || 0,
        taxAmount: po.taxAmount || 0,
        freight: po.freight || 0,
        grandTotal: po.grandTotal || 0,
      });
    }
  }, [po]);

  // Recalculate totals when items or taxes change
  useEffect(() => {
    let sub = 0;
    form.lineItems.forEach(item => {
      sub += (item.qtyOrdered * item.rate);
    });
    const taxAmt = sub * (form.taxPercent / 100);
    const grand = sub + taxAmt + Number(form.freight);
    
    setForm(prev => ({
      ...prev,
      subtotal: sub,
      taxAmount: taxAmt,
      grandTotal: grand
    }));
  }, [form.lineItems, form.taxPercent, form.freight]);

  const handleAddItem = () => {
    if (!newItem.material) return Swal.fire("Error", "Please select a material", "error");
    if (newItem.qtyOrdered <= 0) return Swal.fire("Error", "Quantity must be greater than 0", "error");

    setForm(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { ...newItem, amount: newItem.qtyOrdered * newItem.rate }]
    }));
    setNewItem({ material: "", description: "", qtyOrdered: 1, rate: 0 });
  };

  const handleRemoveItem = (idx) => {
    setForm(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async () => {
    if (!form.vendor) return Swal.fire("Error", "Vendor is required", "error");
    if (form.lineItems.length === 0) return Swal.fire("Error", "At least one line item is required", "error");

    setLoading(true);
    let res;
    if (isEdit) {
      res = await dispatch(updatePurchaseOrder({ id: po._id, data: form }));
    } else {
      res = await dispatch(createPurchaseOrder(form));
    }
    setLoading(false);

    if (res.meta?.requestStatus === "fulfilled") {
      Swal.fire("Success", `Purchase Order ${isEdit ? "updated" : "created"} successfully`, "success");
      onClose();
    } else {
      Swal.fire("Error", res.payload?.message || "Operation failed", "error");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>{isEdit ? "Edit Purchase Order" : "Create Purchase Order"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
           <Grid size={{ xs: 12, sm: 6, md: 4 }}>
  <TextField
    fullWidth
    select
    label="Vendor"
    value={form.vendor}
    onChange={(e) =>
      setForm({ ...form, vendor: e.target.value })
    }
  >
    <MenuItem value="">-- Select Vendor --</MenuItem>
    {vendors.map((v) => (
      <MenuItem key={v._id} value={v._id}>
        {v.company_name}
      </MenuItem>
    ))}
  </TextField>
</Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Order Date"
                value={form.orderDate ? dayjs(form.orderDate) : null}
                onChange={(newValue) => setForm({
                  ...form,
                  orderDate: newValue && newValue.isValid() ? newValue.format('YYYY-MM-DD') : ''
                })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Delivery Date"
                value={form.expectedDeliveryDate ? dayjs(form.expectedDeliveryDate) : null}
                onChange={(newValue) => setForm({
                  ...form,
                  expectedDeliveryDate: newValue && newValue.isValid() ? newValue.format('YYYY-MM-DD') : ''
                })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2 }}>Line Items</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1 }}>
              <TextField select label="Material" size="small" value={newItem.material} onChange={(e) => {
                const mat = materials.find(m => m._id === e.target.value);
                setNewItem({ ...newItem, material: e.target.value, description: mat?.description || mat?.materialName || "", rate: mat?.unitRate || 0 });
              }} sx={{ flex: 2 }}>
                <MenuItem value="">-- Select Material --</MenuItem>
                {materials.map(m => (
                  <MenuItem key={m._id} value={m._id}>
                    {m.materialCode ? `${m.materialCode} - ` : ""}{m.description || m.materialName || "Unnamed Material"}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Description" size="small" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} sx={{ flex: 2 }} />
              <TextField label="Qty" type="number" size="small" value={newItem.qtyOrdered} onChange={(e) => setNewItem({ ...newItem, qtyOrdered: Number(e.target.value) })} sx={{ flex: 1 }} />
              <TextField label="Rate (₹)" type="number" size="small" value={newItem.rate} onChange={(e) => setNewItem({ ...newItem, rate: Number(e.target.value) })} sx={{ flex: 1 }} />
              <Button variant="contained" onClick={handleAddItem}>Add</Button>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Material</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Rate (₹)</TableCell>
                    <TableCell>Amount (₹)</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.lineItems.map((item, idx) => {
                    const mat = materials.find(m => m._id === item.material);
                    return (
                      <TableRow key={idx}>
                        <TableCell>{mat?.materialCode || "Unknown"}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.qtyOrdered}</TableCell>
                        <TableCell>{item.rate}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="error" onClick={() => handleRemoveItem(idx)}><Delete fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {form.lineItems.length === 0 && (
                    <TableRow><TableCell colSpan={6} align="center">No items added.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={4} sx={{ ml: 'auto' }}>
            <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <span>Subtotal:</span> <span>₹{form.subtotal.toFixed(2)}</span>
              </Typography>
              <TextField label="Tax (%)" type="number" size="small" fullWidth value={form.taxPercent} onChange={(e) => setForm({ ...form, taxPercent: Number(e.target.value) })} sx={{ mb: 2 }} />
              <TextField label="Freight (₹)" type="number" size="small" fullWidth value={form.freight} onChange={(e) => setForm({ ...form, freight: Number(e.target.value) })} sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc', pt: 1 }}>
                <span>Grand Total:</span> <span>₹{form.grandTotal.toFixed(2)}</span>
              </Typography>
            </Box>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
    </LocalizationProvider>
  );
}
