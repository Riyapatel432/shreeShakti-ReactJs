import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";
import { createGoodsReceipt } from "../../redux/slices/purchaseSlice";

export default function GoodsReceiptModal({ open, onClose, po }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  // We fetch materials primarily for descriptions in the PO line items if needed
  const { data: materials = [] } = useSelector((state) => state.materials || {});
  
  const [form, setForm] = useState({
    purchaseOrder: po?._id,
    receiptDate: new Date().toISOString().split('T')[0],
    lineItems: []
  });

  useEffect(() => {
    if (po) {
      setForm({
        purchaseOrder: po._id,
        receiptDate: new Date().toISOString().split('T')[0],
        lineItems: po.lineItems.map(item => ({
          material: item.material?._id || item.material,
          qtyOrdered: item.qtyOrdered,
          qtyReceived: 0, // default new receipt qty
          qtyRejected: 0,
          batchNumber: ""
        }))
      });
    }
  }, [po]);

  const handleQtyChange = (idx, field, value) => {
    setForm(prev => {
      const newItems = [...prev.lineItems];
      newItems[idx][field] = Number(value);
      return { ...prev, lineItems: newItems };
    });
  };

  const handleTextChange = (idx, field, value) => {
    setForm(prev => {
      const newItems = [...prev.lineItems];
      newItems[idx][field] = value;
      return { ...prev, lineItems: newItems };
    });
  };

  const handleSubmit = async () => {
    // Validate that we are receiving at least something
    const totalReceived = form.lineItems.reduce((acc, curr) => acc + curr.qtyReceived, 0);
    if (totalReceived <= 0) {
      return Swal.fire("Error", "You must receive a quantity > 0 for at least one item.", "error");
    }

    setLoading(true);
    // Filter out items where qtyReceived is 0 so we only record actual deliveries
    const payload = {
      ...form,
      lineItems: form.lineItems.filter(item => item.qtyReceived > 0)
    };

    const res = await dispatch(createGoodsReceipt(payload));
    setLoading(false);

    if (res.meta?.requestStatus === "fulfilled") {
      Swal.fire("Success", "Goods Receipt created and Inventory updated!", "success");
      onClose();
    } else {
      Swal.fire("Error", res.payload?.message || "Failed to create GRN", "error");
    }
  };

  if (!po) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Goods Receipt Note (GRN) for {po.poNumber}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="textSecondary">Vendor</Typography>
          <Typography variant="body1">{po.vendor?.company_name}</Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField 
            label="Receipt Date" 
            type="date" 
            size="small" 
            InputLabelProps={{ shrink: true }} 
            value={form.receiptDate}
            onChange={(e) => setForm({ ...form, receiptDate: e.target.value })}
          />
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>Receive Line Items</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Material</TableCell>
              <TableCell>Ordered Qty</TableCell>
              <TableCell>Receive Qty</TableCell>
              <TableCell>Reject Qty</TableCell>
              <TableCell>Batch No</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {form.lineItems.map((item, idx) => {
              // Try to map back to original PO line item to get description, or look up in materials
              const poLineItem = po.lineItems[idx];
              const mat = materials.find(m => m._id === item.material);
              const label = poLineItem?.description || mat?.description || "Unknown Material";
              
              return (
                <TableRow key={idx}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{mat?.materialCode || "N/A"}</Typography>
                    <Typography variant="caption" color="textSecondary">{label}</Typography>
                  </TableCell>
                  <TableCell>{item.qtyOrdered}</TableCell>
                  <TableCell>
                    <TextField 
                      type="number" 
                      size="small" 
                      value={item.qtyReceived} 
                      onChange={(e) => handleQtyChange(idx, 'qtyReceived', e.target.value)}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField 
                      type="number" 
                      size="small" 
                      value={item.qtyRejected} 
                      onChange={(e) => handleQtyChange(idx, 'qtyRejected', e.target.value)}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField 
                      size="small" 
                      value={item.batchNumber} 
                      onChange={(e) => handleTextChange(idx, 'batchNumber', e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? "Processing..." : "Confirm Receipt"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
