import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, Button, Divider,
  Avatar, Tabs, Tab, Alert, Chip, CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon, Lock as LockIcon, Edit as EditIcon,
  Save as SaveIcon, Badge as BadgeIcon, Email as EmailIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import axios from 'axios';
import { login } from '../../redux/slices/erpSlice';
import { V_URL } from '../../baseUrl';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const currentUser = useSelector(s => s.erp.currentUser);
 

  const [tab, setTab] = useState(0);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Profile form state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  // ── Update Profile ──────────────────────────────────────────
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);
    try {
    const res = await axios.put(
  `${V_URL}/admin/update-profile`,
  { name, email },
  {
    withCredentials: true,
  }
);
      dispatch(login({ ...currentUser, name: res.data.admin.name, email: res.data.admin.email }));
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Change Password ─────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    if (newPassword !== confirmPassword) {
      return setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
    }
    if (newPassword.length < 6) {
      return setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
    }
    setPasswordLoading(true);
    try {
     const res = await axios.put(
  `${V_URL}/admin/change-password`,
  { currentPassword, newPassword },
  {
    withCredentials: true,
  }
);
      setPasswordMsg({ type: 'success', text: res.data.message });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Page Header */}
      <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>My Profile</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account details and security settings
      </Typography>

      {/* Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight={700}>{currentUser?.name || 'Admin'}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{currentUser?.email}</Typography>
              <Chip label={currentUser?.role || 'Admin'} color="primary" size="small" icon={<BadgeIcon />} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab icon={<EditIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Edit Profile" />
            <Tab icon={<LockIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Change Password" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>

          {/* ── Tab 0: Edit Profile ── */}
          <TabPanel value={tab} index={0}>
            {profileMsg.text && (
              <Alert severity={profileMsg.type} sx={{ mb: 3 }} onClose={() => setProfileMsg({ type: '', text: '' })}>
                {profileMsg.text}
              </Alert>
            )}
            <Box component="form" onSubmit={handleProfileUpdate}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Personal Information</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth label="Full Name" value={name}
                  onChange={e => setName(e.target.value)} required
                  InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }}
                />
                <TextField
                  fullWidth label="Email Address" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} required
                  InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} /> }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit" variant="contained" color="primary"
                  startIcon={profileLoading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                  disabled={profileLoading}
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outlined" onClick={() => { setName(currentUser?.name || ''); setEmail(currentUser?.email || ''); }}>
                  Reset
                </Button>
              </Box>
            </Box>
          </TabPanel>

          {/* ── Tab 1: Change Password ── */}
          <TabPanel value={tab} index={1}>
            {passwordMsg.text && (
              <Alert severity={passwordMsg.type} sx={{ mb: 3 }} onClose={() => setPasswordMsg({ type: '', text: '' })}>
                {passwordMsg.text}
              </Alert>
            )}
            <Box component="form" onSubmit={handlePasswordChange}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>Update Password</Typography>
              <TextField
                fullWidth label="Current Password" type="password" margin="normal"
                value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required
              />
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth label="New Password" type="password" margin="normal"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} required
                helperText="Minimum 6 characters"
              />
              <TextField
                fullWidth label="Confirm New Password" type="password" margin="normal"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                error={confirmPassword.length > 0 && newPassword !== confirmPassword}
                helperText={confirmPassword.length > 0 && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
              />
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit" variant="contained" color="primary"
                  startIcon={passwordLoading ? <CircularProgress size={16} color="inherit" /> : <LockIcon />}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </Box>
            </Box>
          </TabPanel>

        </CardContent>
      </Card>
    </Box>
  );
}
