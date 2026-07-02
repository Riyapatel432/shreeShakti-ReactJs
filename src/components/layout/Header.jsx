import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography, InputBase, Badge,
  MenuItem, Menu, Box, FormControl, Select, Divider, Tooltip,
  Avatar, Paper, Button
} from '@mui/material';
import {
  Menu as MenuIcon, Search as SearchIcon, Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon, LightMode as LightModeIcon,
  Business as BusinessIcon, CalendarToday as CalendarIcon,
  Person as PersonIcon, Settings as SettingsIcon, ExitToApp as LogoutIcon,
  Engineering as EngineeringIcon
} from '@mui/icons-material';
import {
  toggleThemeMode, setSidebarOpen, setFinancialYear, setPlant, markAllNotificationsRead, logout
} from '../../redux/slices/erpSlice';
import { financialYears, plants } from '../../data/mockData';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { themeMode, sidebarOpen, selectedFinancialYear, selectedPlant, notifications } = useSelector(s => s.erp);
  const [anchorProfile, setAnchorProfile] = useState(null);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>

        {/* Left: Menu + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, position: 'relative', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <SettingsIcon sx={{ color: 'primary.main', fontSize: 40 }} />
            <Typography variant="caption" sx={{ position: 'absolute', color: 'warning.main', fontWeight: 900, fontSize: '0.6rem', letterSpacing: '-0.5px', mt: 0.2 }}>SEW</Typography>
          </Box>
          <Typography variant="h6" noWrap fontWeight={900} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, color: 'primary.main', letterSpacing: '0.5px', ml: 0.5, lineHeight: 1.1 }}>
            SHREE SHAKTI
            <Box component="span" sx={{ color: 'warning.main', fontWeight: 700, fontSize: '0.65em', display: 'block', letterSpacing: '1px' }}>
              ENGINEERING WORKS
            </Box>
          </Typography>
        </Box>

        {/* Middle: Search + Selectors */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 2, flexGrow: 1, justifyContent: 'center' }}>
          <Paper elevation={0} sx={{
            p: '2px 4px', display: 'flex', alignItems: 'center', width: 240, borderRadius: '20px',
            bgcolor: themeMode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <IconButton sx={{ p: '6px' }}><SearchIcon fontSize="small" /></IconButton>
            <InputBase sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }} placeholder="Search drawings, POs..." />
          </Paper>

          <FormControl size="small" sx={{ minWidth: 190 }}>
            <Select value={selectedPlant} onChange={e => dispatch(setPlant(e.target.value))}
              renderValue={val => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.82rem', fontWeight: 600 }}>
                  <BusinessIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                  {plants.find(p => p.id === val)?.name.split(' - ')[0] || 'Plant'}
                </Box>
              )}
              sx={{ borderRadius: '8px', height: 36, bgcolor: 'rgba(255,255,255,0.04)' }}>
              {plants.map(p => <MenuItem key={p.id} value={p.id} sx={{ fontSize: '0.82rem' }}>{p.name}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select value={selectedFinancialYear} onChange={e => dispatch(setFinancialYear(e.target.value))}
              renderValue={val => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.82rem', fontWeight: 600 }}>
                  <CalendarIcon sx={{ color: 'warning.main', fontSize: 14 }} />
                  {val}
                </Box>
              )}
              sx={{ borderRadius: '8px', height: 36, bgcolor: 'rgba(255,255,255,0.04)' }}>
              {financialYears.map(fy => <MenuItem key={fy} value={fy} sx={{ fontSize: '0.82rem' }}>{fy}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* Right: Theme, Notifications, Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
            <IconButton color="inherit" onClick={() => dispatch(toggleThemeMode())}>
              {themeMode === 'dark' ? <LightModeIcon sx={{ color: 'warning.main' }} /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <IconButton color="inherit" onClick={e => setAnchorNotif(e.currentTarget)}>
            <Badge badgeContent={unread} color="error"><NotificationsIcon /></Badge>
          </IconButton>

          {/* Notifications menu */}
          <Menu anchorEl={anchorNotif} open={Boolean(anchorNotif)} onClose={() => setAnchorNotif(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{ sx: { width: 310, mt: 1.5, borderRadius: 2 } }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight="bold">Alerts</Typography>
              {unread > 0 && (
                <Button size="small" onClick={() => dispatch(markAllNotificationsRead())} sx={{ fontSize: '0.72rem', p: 0 }}>
                  Mark all read
                </Button>
              )}
            </Box>
            <Divider />
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {notifications.map(n => (
                <MenuItem key={n.id} sx={{
                  py: 1.5, px: 2, whiteSpace: 'normal',
                  bgcolor: n.read ? 'transparent' : (themeMode === 'dark' ? 'rgba(59,130,246,0.08)' : 'rgba(219,234,254,0.5)'),
                  '&:hover': { bgcolor: 'action.hover' }
                }}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" fontWeight={n.read ? 500 : 700}
                        color={n.type === 'error' ? 'error.main' : n.type === 'warning' ? 'warning.main' : 'primary.main'}>
                        {n.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{n.time}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>{n.message}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Box>
          </Menu>

          {/* Profile */}
          <Box onClick={e => setAnchorProfile(e.currentTarget)} sx={{
            display: 'flex', alignItems: 'center', gap: 1, pl: 1, pr: 1.5, py: 0.5,
            borderRadius: '24px', cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' }
          }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'warning.main', fontSize: '0.82rem', fontWeight: 'bold' }}>SS</Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ lineHeight: 1.2, fontWeight: 700, fontSize: '0.82rem' }}>S. S. Sharma</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>HOD - Operations</Typography>
            </Box>
          </Box>

          <Menu anchorEl={anchorProfile} open={Boolean(anchorProfile)} onClose={() => setAnchorProfile(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{ sx: { width: 200, mt: 1.5, borderRadius: 2 } }}>
            <Box sx={{ py: 1.5, px: 2, textAlign: 'center' }}>
              <Avatar sx={{ width: 44, height: 44, mx: 'auto', mb: 1, bgcolor: 'primary.main', fontSize: '1rem' }}>SS</Avatar>
              <Typography variant="subtitle2" fontWeight="bold">S. S. Sharma</Typography>
              <Typography variant="caption" color="text.secondary">admin@shreeshakti.com</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { navigate('/admin/profile'); setAnchorProfile(null); }} sx={{ gap: 1.5, fontSize: '0.875rem' }}>
              <PersonIcon fontSize="small" /> My Profile
            </MenuItem>
            <MenuItem sx={{ gap: 1.5, fontSize: '0.875rem' }}><SettingsIcon fontSize="small" /> Settings</MenuItem>
            <Divider />
            <MenuItem onClick={() => dispatch(logout())} sx={{ gap: 1.5, color: 'error.main', fontSize: '0.875rem' }}>
              <LogoutIcon fontSize="small" color="error" /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
