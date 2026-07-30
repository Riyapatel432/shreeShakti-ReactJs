import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Alert,
  useTheme,
  useMediaQuery,
  Chip,
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { login } from '../../redux/slices/erpSlice';

export default function UserLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Form State
  const [email, setEmail] = useState('user@shreeshakti.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation & Loading
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Validators
  const validateEmail = (val) => {
    if (!val || val.trim() === '') return 'Email is required';
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(val)) return 'Invalid email address format';
    return '';
  };

  const validatePassword = (val) => {
    if (!val) return 'Password is required';
    if (val.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === 'email' ? email : password;
    const err = field === 'email' ? validateEmail(val) : validatePassword(val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
      if (touched.email) {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      }
    } else {
      setPassword(value);
      if (touched.password) {
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
      }
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setServerError('');
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: passwordErr });

    if (emailErr || passwordErr) return;

    setLoading(true);
    setTimeout(() => {
      if (email === 'user@shreeshakti.com' && password === 'password123') {
        dispatch(login({ email, name: 'Employee', role: 'User' }));
        navigate('/user/dashboard');
      } else {
        setServerError('Invalid employee credentials. For demo, use the prefill button below.');
        setLoading(false);
      }
    }, 800);
  };

  const useDemoCredentials = () => {
    setEmail('user@shreeshakti.com');
    setPassword('password123');
    setErrors({});
    setTouched({});
    setServerError('');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* LEFT PANEL - BRANDING/SHOWCASE */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 6,
          position: 'relative',
          background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 60%),
            radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 0),
            linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)
          `,
          backgroundSize: '100% 100%, 24px 24px, 100% 100%',
        }}
      >
        <Box sx={{ maxWidth: 450, position: 'relative', zIndex: 1 }}>
          {/* Logo Group */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
            <Paper
              elevation={0}
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
              }}
            >
              <PersonIcon sx={{ fontSize: 32, color: 'white' }} />
            </Paper>
            <Box>
              <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: '1px', lineHeight: 1 }}>
                SHREE SHAKTI
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: '2px', opacity: 0.8 }}>
                EMPLOYEE PORTAL
              </Typography>
            </Box>
          </Box>

          {/* Showcase Heading */}
          <Typography variant="h3" fontWeight={800} sx={{ mb: 2, lineHeight: 1.25, letterSpacing: '-0.5px' }}>
            Workforce Portal
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 5, lineHeight: 1.6, fontSize: '1.05rem' }}>
            Access your personalized employee dashboard to track active tasks, cutting, fitting, welding stages, and attendance sheets.
          </Typography>

          {/* Metrics */}
          <Box sx={{ display: 'flex', gap: 6 }}>
            <Box>
              <Typography variant="h4" fontWeight={900} sx={{ mb: 0.5 }}>Tasks</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>Kanban Pipeline</Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={900} sx={{ mb: 0.5 }}>Attendance</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>Log & Leave Tracking</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* RIGHT PANEL - LOGIN FORM */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f8fafc',
          p: { xs: 3, md: 6 },
          position: 'relative',
        }}
      >
        {/* Mobile Header Logo */}
        {isMobile && (
          <Box sx={{ position: 'absolute', top: 32, left: 32, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <PersonIcon sx={{ color: 'secondary.main', fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={900} color="secondary.main" sx={{ lineHeight: 1 }}>
                SHREE SHAKTI
              </Typography>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: '0.5px' }}>
                EMPLOYEE PORTAL
              </Typography>
            </Box>
          </Box>
        )}

        <Fade in={true} timeout={400}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 420,
              p: { xs: 4, sm: 5 },
              borderRadius: '20px',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 12px 40px rgba(0, 0, 0, 0.5)' 
                : '0 20px 48px rgba(71, 85, 105, 0.05)',
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
            }}
          >
            {/* Header Text */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h5" fontWeight={800} color="text.primary">
                  Employee Sign In
                </Typography>
                <Chip 
                  label="Workforce" 
                  color="secondary" 
                  size="small" 
                  sx={{ 
                    fontWeight: 700, 
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    height: '24px'
                  }} 
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Enter your credentials to access your dashboard
              </Typography>
            </Box>

            {serverError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>
                {serverError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} noValidate>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={!!(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" sx={{ color: touched.email && errors.email ? 'error.main' : 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={!!(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" sx={{ color: touched.password && errors.password ? 'error.main' : 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ 
                  mb: 3.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                disabled={loading}
                endIcon={!loading && <ArrowForwardIcon />}
                sx={{
                  py: 1.6,
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: `0 8px 20px -4px ${theme.palette.secondary.main}30`,
                  '&:hover': {
                    boxShadow: `0 12px 28px -4px ${theme.palette.secondary.main}40`,
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In to Portal'}
              </Button>
            </Box>

            {/* Quick Demo Helper */}
            <Box 
              sx={{ 
                mt: 4, 
                pt: 3, 
                borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 1.5 
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Testing the workforce portal?
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={useDemoCredentials}
                color="secondary"
                sx={{
                  textTransform: 'none',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  px: 2.5,
                  py: 0.6,
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.05)' : 'rgba(71, 85, 105, 0.04)',
                  }
                }}
              >
                Auto-fill Demo Credentials
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
}
