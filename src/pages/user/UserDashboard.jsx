import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/erpSlice';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(s => s.erp.currentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={800} color="primary.main">Employee Portal</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Welcome, {currentUser?.name || 'Employee'}</Typography>
              <Typography variant="body2" color="text.secondary">
                You are currently logged into the Employee Portal. Admin features are restricted.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
