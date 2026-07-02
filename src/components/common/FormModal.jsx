import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Typography, Box,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export default function FormModal({
  open,
  onClose,
  title,
  children,
  onSubmit,

  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  submitColor = 'warning',
  maxWidth = 'sm',
  fullWidth = true,

  // ✅ NEW FEATURES
  loading = false,
  serverError = '',
  setServerError,
}) {

  const handleClose = () => {
    setServerError?.('');
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={maxWidth}
        fullWidth={fullWidth}
        PaperProps={{
          sx: {
      width: '100%',
      maxWidth: '1100px',   // force wider modal
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    }
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: (t) =>
              t.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.02)'
                : 'rgba(0,0,0,0.02)',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>

          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* FORM */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (onSubmit) onSubmit(e);
          }}
        >
          <DialogContent sx={{ p: 3, maxHeight: '65vh', overflowY: 'auto' }}>
            {children}
          </DialogContent>

          {/* FOOTER */}
          <DialogActions
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: (t) =>
                t.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.01)'
                  : 'rgba(0,0,0,0.01)'
            }}
          >
            <Button onClick={handleClose} color="inherit" variant="outlined">
              {cancelLabel}
            </Button>

            <Button
              type="submit"
              color={submitColor}
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} /> : null}
            >
              {submitLabel}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* GLOBAL ERROR SNACKBAR */}
      <Snackbar
        open={!!serverError}
        autoHideDuration={4000}
        onClose={() => setServerError?.('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" variant="filled">
          {serverError}
        </Alert>
      </Snackbar>
    </>
  );
}