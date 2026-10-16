import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function TechSpecPreviewModal({ open, onClose, spec }) {
  if (!spec) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Technical Specification</Typography>
        <Typography variant="body2" color="textSecondary">Revision: R{spec.revisionNumber} ({spec.status})</Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4, backgroundColor: '#fff', color: '#000' }}>
        
        {/* Header Block */}
        <Box sx={{ borderBottom: '2px solid #000', pb: 2, mb: 3 }}>
          <Typography variant="h4" align="center" fontWeight="bold" sx={{ mb: 1 }}>SHREE SHAKTI EQUIPMENTS</Typography>
          <Typography variant="subtitle1" align="center">TECHNICAL SPECIFICATION SHEET</Typography>
        </Box>

        {/* Client & Project */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2"><strong>Client:</strong> {spec.client?.company_name}</Typography>
            <Typography variant="body2"><strong>Project:</strong> {spec.project?.name}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body2"><strong>Date:</strong> {new Date(spec.createdAt).toLocaleDateString()}</Typography>
            <Typography variant="body2"><strong>Equipment:</strong> {spec.product_category}</Typography>
          </Grid>
        </Grid>

        {/* General Parameters */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ bgcolor: '#f0f0f0', p: 1, mb: 2 }}>General Parameters</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}><Typography variant="body2"><strong>Design Code:</strong> {spec.designCode}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><strong>Capacity / Volume:</strong> {spec.capacity}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><strong>Design Pressure:</strong> {spec.designPressure}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><strong>Design Temperature:</strong> {spec.designTemperature}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><strong>Corrosion Allowance:</strong> {spec.corrosionAllowance}</Typography></Grid>
          <Grid item xs={6}><Typography variant="body2"><strong>Insulation:</strong> {spec.insulation ? "Yes" : "No"}</Typography></Grid>
          <Grid item xs={12}><Typography variant="body2"><strong>Painting Spec:</strong> {spec.paintingSpec}</Typography></Grid>
        </Grid>

        {/* MOC */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ bgcolor: '#f0f0f0', p: 1, mb: 2 }}>Material of Construction</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}><Typography variant="body2"><strong>Shell:</strong> {spec.moc?.shell}</Typography></Grid>
          <Grid item xs={4}><Typography variant="body2"><strong>Head:</strong> {spec.moc?.head}</Typography></Grid>
          <Grid item xs={4}><Typography variant="body2"><strong>Nozzles:</strong> {spec.moc?.nozzles}</Typography></Grid>
        </Grid>

        {/* Category Details */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ bgcolor: '#f0f0f0', p: 1, mb: 2 }}>Equipment Details</Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Object.entries(spec.categoryDetails || {}).map(([key, value]) => (
            <Grid item xs={6} key={key}>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Nozzle Schedule */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ bgcolor: '#f0f0f0', p: 1, mb: 2 }}>Nozzle Schedule</Typography>
        <Table size="small" sx={{ mb: 3 }}>
          <TableHead sx={{ bgcolor: '#f9f9f9' }}>
            <TableRow>
              <TableCell><strong>Mark</strong></TableCell>
              <TableCell><strong>Service</strong></TableCell>
              <TableCell><strong>Size (NB)</strong></TableCell>
              <TableCell><strong>Rating</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Qty</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spec.nozzleSchedule && spec.nozzleSchedule.length > 0 ? spec.nozzleSchedule.map((n, i) => (
              <TableRow key={i}>
                <TableCell>{n.mark}</TableCell>
                <TableCell>{n.service}</TableCell>
                <TableCell>{n.size}</TableCell>
                <TableCell>{n.rating}</TableCell>
                <TableCell>{n.type}</TableCell>
                <TableCell>{n.qty}</TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={6} align="center">No nozzles defined</TableCell></TableRow>
            )}
          </TableBody>
        </Table>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Close</Button>
        <Button onClick={() => window.print()} variant="contained" color="primary">Print / PDF</Button>
      </DialogActions>
    </Dialog>
  );
}
