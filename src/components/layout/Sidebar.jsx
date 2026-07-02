import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Collapse,
  Box, Typography, Divider, Tooltip, useMediaQuery, useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon, Storage as MasterIcon, ShoppingCart as PurchaseIcon,
  Inventory as InventoryIcon, PrecisionManufacturing as ProductionIcon,
  FactCheck as QCIcon, Transform as IssueIcon, People as HRIcon,
  Assessment as ReportsIcon, SettingsApplications as SettingsIcon,
  ExpandLess, ExpandMore
} from '@mui/icons-material';
import { setSidebarOpen } from '../../redux/slices/erpSlice';

const DRAWER_WIDTH = 260;
const MINI_WIDTH = 68;

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { title: 'Master Management', icon: <MasterIcon />, path: '/admin/master', sub: [
    { name: 'Users', path: '/admin/master/users' }, { name: 'Roles & Permissions', path: '/admin/master/roles' },
    { name: 'Customers', path: '/admin/master/customers' }, { name: 'Vendors', path: '/admin/master/vendors' },
    { name: 'Clients', path: '/admin/master/clients' },
    { name: 'Projects', path: '/admin/master/projects' }, { name: 'Units', path: '/admin/master/units' },
    { name: 'Departments', path: '/admin/master/departments' }, { name: 'Materials Master', path: '/admin/master/materials' },
    { name: 'Item Categories', path: '/admin/master/categories' }, { name: 'Drawing Master', path: '/admin/master/drawings' },
    { name: 'Grid Master', path: '/admin/master/grids' }, { name: 'Heat Number Master', path: '/admin/master/heat-numbers' },
  ]},
  { title: 'Purchase Management', icon: <PurchaseIcon />, path: '/admin/purchase', sub: [
    { name: 'Purchase Requisition', path: '/admin/purchase/requisition' }, { name: 'Purchase Offer', path: '/admin/purchase/offer' },
    { name: 'Purchase Order', path: '/admin/purchase/order' }, { name: 'Vendor Comparison', path: '/admin/purchase/comparison' },
    { name: 'Goods Receipt (GRN)', path: '/admin/purchase/grn' },
  ]},
  { title: 'Inventory Management', icon: <InventoryIcon />, path: '/admin/inventory', sub: [
    { name: 'Main Stock', path: '/admin/inventory/stock' }, { name: 'Stock Transfer', path: '/admin/inventory/transfer' },
    { name: 'Stock Adjustment', path: '/admin/inventory/adjustment' }, { name: 'Bin Management', path: '/admin/inventory/bins' },
    { name: 'IMIR Management', path: '/admin/inventory/imir' }, { name: 'Material Tracking', path: '/admin/inventory/tracking' },
  ]},
  { title: 'Production Management', icon: <ProductionIcon />, path: '/admin/production', sub: [
    { name: 'Drawing Wise Planning', path: '/admin/production/planning' }, { name: 'Cutting', path: '/admin/production/cutting' },
    { name: 'Fitting Shop', path: '/admin/production/fitting' }, { name: 'Welding Station', path: '/admin/production/welding' },
    { name: 'Assembly Line', path: '/admin/production/assembly' }, { name: 'Packing Stage', path: '/admin/production/packing' },
    { name: 'Dispatch Planning', path: '/admin/production/dispatch' },
  ]},
  { title: 'Quality Control', icon: <QCIcon />, path: '/admin/quality', sub: [
    { name: 'Incoming Inspection', path: '/admin/quality/incoming' }, { name: 'FIM Inspection', path: '/admin/quality/fim' },
    { name: 'NCR Management', path: '/admin/quality/ncr' }, { name: 'Test Certificates', path: '/admin/quality/certificates' },
    { name: 'Material Approval', path: '/admin/quality/approval' },
  ]},
  { title: 'Issue Management', icon: <IssueIcon />, path: '/admin/issue', sub: [
    { name: 'Material Issue Request', path: '/admin/issue/request' }, { name: 'Issue Acceptance', path: '/admin/issue/acceptance' },
    { name: 'Return Material', path: '/admin/issue/return' }, { name: 'Consumption Tracking', path: '/admin/issue/consumption' },
  ]},
  { title: 'HR & Payroll', icon: <HRIcon />, path: '/admin/hr', sub: [
    { name: 'Employee Master', path: '/admin/hr/employees' }, { name: 'Attendance', path: '/admin/hr/attendance' },
    { name: 'Leave Management', path: '/admin/hr/leaves' }, { name: 'Salary Processing', path: '/admin/hr/salaries' },
    { name: 'Payslip Generation', path: '/admin/hr/payslips' },
  ]},
  { title: 'Reports', icon: <ReportsIcon />, path: '/admin/reports', sub: [
    { name: 'Stock Reports', path: '/admin/reports/stock' }, { name: 'Purchase Reports', path: '/admin/reports/purchase' },
    { name: 'Production Reports', path: '/admin/reports/production' }, { name: 'Packing Reports', path: '/admin/reports/packing' },
    { name: 'Attendance Reports', path: '/admin/reports/attendance' }, { name: 'Financial Reports', path: '/admin/reports/financial' },
  ]},
  { title: 'System Settings', icon: <SettingsIcon />, path: '/admin/settings', sub: [
    { name: 'Company Settings', path: '/admin/settings/company' }, { name: 'Financial Year', path: '/admin/settings/fy-config' },
    { name: 'Email Settings', path: '/admin/settings/email' }, { name: 'WhatsApp Integration', path: '/admin/settings/whatsapp' },
    { name: 'Audit Logs', path: '/admin/settings/audit' }, { name: 'Backup & Restore', path: '/admin/settings/backup' },
  ]},
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(s => s.erp.sidebarOpen);
  const isDark = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const active = menuItems.find(item => item.sub?.some(s => location.pathname.startsWith(s.path)));
    if (active) setExpanded(prev => ({ ...prev, [active.title]: true }));
  }, [location.pathname]);

  const toggleExpand = (title) => setExpanded(prev => ({ ...prev, [title]: !prev[title] }));

  const navItem = (item) => {
    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
    const isExp = expanded[item.title];
    const hasSub = Boolean(item.sub);

    const activeColor = theme.palette.primary.main;
    const inactiveColor = theme.palette.text.secondary;
    const activeBg = isDark ? 'rgba(96, 165, 250, 0.08)' : 'rgba(27, 58, 87, 0.08)';
    const hoverBg = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)';

    if (!sidebarOpen) {
      return (
        <Tooltip key={item.title} title={item.title} placement="right" arrow>
          <ListItemButton onClick={() => {
            dispatch(setSidebarOpen(true));
            if (!hasSub) navigate(item.path);
          }} sx={{
            justifyContent: 'center', py: 1.5, px: 0, mb: 0.5,
            color: isActive ? activeColor : inactiveColor,
            bgcolor: isActive ? activeBg : 'transparent',
            borderLeft: isActive ? `3px solid ${activeColor}` : '3px solid transparent',
            '&:hover': { bgcolor: hoverBg, color: isActive ? activeColor : theme.palette.text.primary }
          }}>
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center', color: isActive ? activeColor : inactiveColor, '& svg': { fontSize: 22 } }}>
              {item.icon}
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
      );
    }

    return (
      <Box key={item.title}>
        <ListItemButton onClick={() => { hasSub ? toggleExpand(item.title) : navigate(item.path); }} sx={{
          py: 1.2, px: 2, mb: 0.5, borderRadius: '8px',
          color: isActive ? activeColor : inactiveColor,
          bgcolor: isActive ? activeBg : 'transparent',
          '&:hover': { bgcolor: hoverBg, color: isActive ? activeColor : theme.palette.text.primary }
        }}>
          <ListItemIcon sx={{ minWidth: 34, color: isActive ? activeColor : inactiveColor, '& svg': { fontSize: 20 } }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }} />
          {hasSub && (isExp ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />)}
        </ListItemButton>

        {hasSub && (
          <Collapse in={isExp} timeout="auto" unmountOnExit>
            <List disablePadding sx={{ pl: 4, borderLeft: `1px solid ${theme.palette.divider}`, ml: 3.5, mb: 0.5 }}>
              {item.sub.map(s => {
                const isSub = location.pathname === s.path;
                return (
                  <ListItemButton key={s.name} onClick={() => { navigate(s.path); if (isMobile) dispatch(setSidebarOpen(false)); }} sx={{
                    py: 0.7, px: 1.5, borderRadius: '4px', mb: 0.2,
                    color: isSub ? activeColor : inactiveColor,
                    '&:hover': { color: theme.palette.text.primary, bgcolor: hoverBg }
                  }}>
                    <ListItemText primary={s.name} primaryTypographyProps={{ fontSize: '0.8125rem', fontWeight: isSub ? 600 : 400 }} />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ height: 72, display: 'flex', alignItems: 'center', px: sidebarOpen ? 2 : 1, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
        {sidebarOpen ? (
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.65rem' }}>
              Operations Center
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.main', fontSize: '0.75rem', fontWeight: 600 }}>
              Manufacturing ERP v4.2.0
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1rem' }}>SS</Typography>
        )}
      </Box>
      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1, px: sidebarOpen ? 1 : 0.5 }}>
        <List disablePadding>{menuItems.map(navItem)}</List>
      </Box>

      {sidebarOpen && (
        <Box sx={{ p: 2, textAlign: 'center', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', display: 'block' }}>
            🔒 Secured • Role-based Access
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: sidebarOpen ? DRAWER_WIDTH : MINI_WIDTH }, flexShrink: { md: 0 }, transition: 'width 0.3s ease' }}>
      {isMobile ? (
        <Drawer variant="temporary" open={sidebarOpen} onClose={() => dispatch(setSidebarOpen(false))}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="permanent" open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: sidebarOpen ? DRAWER_WIDTH : MINI_WIDTH,
              boxSizing: 'border-box',
              transition: 'width 0.3s ease',
              overflowX: 'hidden'
            }
          }}>
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
}
