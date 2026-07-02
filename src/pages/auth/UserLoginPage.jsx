import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Person as PersonIcon } from '@mui/icons-material';
import { login } from '../../redux/slices/erpSlice';

export default function UserLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('user@shreeshakti.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      // Assuming a generic user login might go to a different dashboard later, 
      // but for now we authenticate them.
      dispatch(login({ email, name: 'Employee', role: 'User' }));
      navigate('/user/dashboard'); 
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, boxShadow: '0 12px 40px rgba(0,0,0,0.08)', borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'rgba(27, 58, 87, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <PersonIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" fontWeight={900} color="primary.main" sx={{ letterSpacing: '0.5px' }}>SHREE SHAKTI</Typography>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: '1px' }}>EMPLOYEE PORTAL</Typography>
          </Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>Employee Login</Typography>
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
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
