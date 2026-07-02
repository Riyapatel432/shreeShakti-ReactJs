import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Engineering as EngineeringIcon } from '@mui/icons-material';
import { login } from '../../redux/slices/erpSlice';
import axios from 'axios';
import { V_URL } from '../../baseUrl';
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@shreeshakti.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (email && password) {
      try {
       const response = await axios.post(
  `${V_URL}/auth/login`,
  { email, password },
  {
    withCredentials: true, // ✅ Important for cookies
  }
);

if (response.data.success) {
  dispatch(login(response.data.user));
  navigate('/admin/dashboard');
}
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to login');
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, boxShadow: '0 12px 40px rgba(0,0,0,0.08)', borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(27, 58, 87, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <EngineeringIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={900} color="primary.main" sx={{ letterSpacing: '0.5px' }}>SHREE SHAKTI</Typography>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: '1px' }}>ENGINEERING WORKS</Typography>
          </Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>Sign in to ERP</Typography>
          {error && <Typography color="error" variant="body2" textAlign="center" mb={2}>{error}</Typography>}
          <Box component="form" onSubmit={handleLogin}>
            <TextField fullWidth label="Email Address" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button fullWidth type="submit" variant="contained" color="primary" size="large" sx={{ mt: 3, py: 1.5, fontSize: '1rem', fontWeight: 600 }}>
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
