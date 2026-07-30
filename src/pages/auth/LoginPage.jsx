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
  // Chip,
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  // Engineering as EngineeringIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { login } from '../../redux/slices/erpSlice';
import axios from 'axios';
import { V_URL } from '../../baseUrl';
// import whiteLogo from "../../assets/Shree-shakti-logo-white.png";
import logo from "../../assets/Shree-shakti-logo.png";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: passwordErr });

    if (emailErr || passwordErr) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${V_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(login(response.data.user));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const useDemoCredentials = () => {
  //   setEmail('');
  //   setPassword('');
  //   setErrors({});
  //   setTouched({});
  //   setServerError('');
  // };

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
    p: 6,
    position: 'relative',
    overflow: 'hidden',

    // Light Industrial Background
    background: `linear-gradient(
      135deg,
      #F8FAFC 0%,
      #EEF2F7 100%
    )`,

    // Blueprint Grid + Soft Glow
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundImage: `
        linear-gradient(rgba(30,58,95,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30,58,95,0.05) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
      zIndex: 0,
    },

    "&::after": {
      content: '""',
      position: "absolute",
      width: 500,
      height: 500,
      top: -120,
      right: -120,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(30,58,95,0.08) 0%, transparent 70%)",
      zIndex: 0,
    },
  }}
>
  <Box
    sx={{
      maxWidth: 600,
      position: "relative",
      zIndex: 1,
    }}
  >
    {/* Logo */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 5,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Shree Shakti Engineering Works"
        sx={{
          width: 280,
          height: "auto",
          objectFit: "contain",
        }}
      />
    </Box>

    {/* Heading */}
    <Typography
      variant="h3"
      sx={{
        color: "#163B65",
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: "-0.5px",
        mb: 2,
      }}
    >
      Enterprise Resource Planning
    </Typography>

    {/* Description */}
    <Typography
      sx={{
        color: "#4B5563",
        fontSize: "1.05rem",
        lineHeight: 1.8,
        mb: 5,
      }}
    >
      Streamlined management for production planning, purchase orders,
      inventory, quality control, vendor management, and customer operations.
      Access your ERP dashboard securely to manage your business efficiently.
    </Typography>

    {/* Stats */}
    <Box sx={{ display: "flex", gap: 6 }}>
      <Box>
        <Typography
          sx={{
            color: "#163B65",
            fontWeight: 800,
            fontSize: "2rem",
          }}
        >
          100%
        </Typography>

        <Typography
          sx={{
            color: "#6B7280",
            fontWeight: 600,
          }}
        >
          Secure Environment
        </Typography>
      </Box>

      <Box>
        <Typography
          sx={{
            color: "#163B65",
            fontWeight: 800,
            fontSize: "2rem",
          }}
        >
          Real-Time
        </Typography>

        <Typography
          sx={{
            color: "#6B7280",
            fontWeight: 600,
          }}
        >
          Production Tracking
        </Typography>
      </Box>
    </Box>
  </Box>
</Box>

      {/* RIGHT PANEL - LOGIN FORM */}
     {/* RIGHT PANEL - LOGIN FORM */}
<Box
  sx={{
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    p: { xs: 3, md: 6 },
    background: "linear-gradient(135deg,#ffffff 0%,#f8fafc 100%)",

    "&::before": {
      content: '""',
      position: "absolute",
      width: 420,
      height: 420,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(22,59,101,.08) 0%, transparent 70%)",
      top: -120,
      left: -120,
    },

    "&::after": {
      content: '""',
      position: "absolute",
      width: 320,
      height: 320,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(220,38,38,.06) 0%, transparent 70%)",
      bottom: -100,
      right: -80,
    },
  }}
>
  {/* Mobile Logo */}
  {isMobile && (
    <Box
      component="img"
      src={logo}
      alt="Shree Shakti"
      sx={{
        position: "absolute",
        top: 20,
        left: 20,
        width: 140,
        height: "auto",
      }}
    />
  )}

  <Fade in timeout={500}>
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 550,
        p: { xs: 4, md: 5 },
        borderRadius: "24px",
        background: "rgba(255,255,255,.96)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(22,59,101,.08)",
        boxShadow:
          "0 20px 60px rgba(15,23,42,.08), 0 8px 24px rgba(15,23,42,.05)",
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        {!isMobile && (
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: 120,
              mb: 4,
            }}
          />
        )}

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#163B65",
            mb: 1,
          }}
        >
          Welcome Back
        </Typography>

        <Typography
          sx={{
            color: "#6B7280",
            fontSize: 15,
          }}
        >
          Sign in to access Admin ERP Dashboard
        </Typography>
      </Box>

      {serverError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {serverError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleLogin} noValidate>
        {/* Email */}
        <TextField
          fullWidth
          label="Email Address"
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          error={!!(touched.email && errors.email)}
          helperText={touched.email && errors.email}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "#FAFBFC",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
          error={!!(touched.password && errors.password)}
          helperText={touched.password && errors.password}
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "#FAFBFC",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Button */}
        <Button
          fullWidth
          type="submit"
          disabled={loading}
          endIcon={!loading && <ArrowForwardIcon />}
          sx={{
            py: 1.8,
            borderRadius: "14px",
            fontWeight: 700,
            fontSize: 16,
            textTransform: "none",
            color: "#fff",
            background:
              "linear-gradient(135deg,#163B65 0%,#245A9A 100%)",
            boxShadow: "0 10px 25px rgba(22,59,101,.25)",
            transition: ".3s",

            "&:hover": {
              background:
                "linear-gradient(135deg,#123257 0%,#1E4C82 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 16px 35px rgba(22,59,101,.30)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Sign In"
          )}
        </Button>
      </Box>
    </Paper>
  </Fade>
</Box>
    </Box>
  );
}
