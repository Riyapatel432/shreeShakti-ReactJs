import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Typography } from "@mui/material";
import { fetchCostingSheet } from "../../redux/slices/costingSheet/costingSheetSlice";
import { generateTechSpec } from "../../redux/slices/techSpecSlice";
import Swal from "sweetalert2";

export default function SelectCostingSheetModal({ open, onClose, onGenerated }) {
  const dispatch = useDispatch();
  const { data: costingSheets, loading } = useSelector((state) => state.costingSheets);
  const [selectedSheetId, setSelectedSheetId] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(fetchCostingSheet({ page: 1, limit: 100 }));
    }
  }, [open, dispatch]);

  const handleGenerate = async () => {
    if (!selectedSheetId) return;
    setGenerating(true);
    const res = await dispatch(generateTechSpec(selectedSheetId));
    setGenerating(false);

    if (res.meta?.requestStatus === "fulfilled") {
      Swal.fire("Success", "Technical Specification generated!", "success");
      onGenerated(res.payload.data); // pass the newly created spec back so it can be edited immediately
      onClose();
    } else {
      Swal.fire("Error", res.payload?.message || "Failed to generate", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Generate Technical Specification</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Technical Specifications are intrinsically linked to a Costing Sheet. Select an existing Costing Sheet below to generate its Technical Specification.
        </Typography>
        <TextField
          fullWidth
          select
          label="Select Costing Sheet"
          value={selectedSheetId}
          onChange={(e) => setSelectedSheetId(e.target.value)}
          disabled={loading}
        >
          <MenuItem value="">Select...</MenuItem>
          {costingSheets?.map((sheet) => {
            const catName = sheet.product_category?.name || sheet.product_category || "General";
            const prodName = sheet.product?.name || "";
            const amountText = sheet.amount ? `₹${sheet.amount}` : (sheet.grandTotal ? `₹${sheet.grandTotal}` : "");
            return (
              <MenuItem key={sheet._id} value={sheet._id}>
                {catName} {prodName ? `- ${prodName}` : ""} {amountText ? `(${amountText})` : ""}
              </MenuItem>
            );
          })}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleGenerate} variant="contained" color="primary" disabled={!selectedSheetId || generating}>
          {generating ? "Generating..." : "Generate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
