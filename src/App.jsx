import { useMemo,useEffect } from 'react';
import axios from "axios";
import { Provider, useSelector,useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './redux/store';
import { getTheme } from './theme/theme';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import UserLoginPage from './pages/auth/UserLoginPage';
import UserDashboard from './pages/user/UserDashboard';
import Dashboard from './pages/Dashboard';
import ComingSoonPage from './pages/ComingSoonPage';
import ProfilePage from './pages/admin/ProfilePage';
import { login, setAuthLoading } from './redux/slices/erpSlice';
// Master
import ProjectsPage from './pages/master/ProjectsPage';
import VendorsPage from './pages/master/VendorsPage';
import ClientsPage from './pages/master/ClientsPage';
import MaterialsPage from './pages/master/MaterialsPage';

// Purchase
import PurchaseOrderPage from './pages/purchase/PurchaseOrderPage';

// Production
import ProductionKanbanPage from './pages/production/ProductionKanbanPage';

// Quality
import IncomingInspectionPage from './pages/quality/IncomingInspectionPage';

// HR
import EmployeesPage from './pages/hr/EmployeesPage';

// Settings
import AuditLogsPage from './pages/settings/AuditLogsPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, currentUser, authLoading } =
    useSelector((s) => s.erp);

  // Don't show anything while checking auth
  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(currentUser?.role)
  ) {
    if (currentUser?.role === "User") {
      return <Navigate to="/user/dashboard" replace />;
    }

    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

// Inner app with theme wired to Redux state
function ThemedApp() {
   const dispatch = useDispatch();
  const themeMode = useSelector(s => s.erp.themeMode);
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);
 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/auth/get-profile',
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(login(res.data.user));
        }
      } catch (err) {
        console.log('Not authenticated');
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/" element={<UserLoginPage />} />
          
          <Route path="/user/dashboard" element={
            <ProtectedRoute allowedRoles={['User']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['Admin']}><MainLayout /></ProtectedRoute>}>
            {/* Default redirect */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Profile */}
            <Route path="profile" element={<ProfilePage />} />

            {/* Master Management */}
            <Route path="master/users" element={<ComingSoonPage module="Master Management" page="User Management" />} />
            <Route path="master/roles" element={<ComingSoonPage module="Master Management" page="Roles & Permissions" />} />
            <Route path="master/customers" element={<ComingSoonPage module="Master Management" page="Customer Master" />} />
            <Route path="master/clients" element={<ClientsPage />} />
            <Route path="master/vendors" element={<VendorsPage />} />
            <Route path="master/projects" element={<ProjectsPage />} />
            <Route path="master/units" element={<ComingSoonPage module="Master Management" page="Units Master" />} />
            <Route path="master/departments" element={<ComingSoonPage module="Master Management" page="Departments Master" />} />
            <Route path="master/materials" element={<MaterialsPage />} />
            <Route path="master/categories" element={<ComingSoonPage module="Master Management" page="Item Categories" />} />
            <Route path="master/drawings" element={<ComingSoonPage module="Master Management" page="Drawing Master" />} />
            <Route path="master/grids" element={<ComingSoonPage module="Master Management" page="Grid Master" />} />
            <Route path="master/heat-numbers" element={<ComingSoonPage module="Master Management" page="Heat Number Master" />} />

            {/* Purchase Management */}
            <Route path="purchase/requisition" element={<ComingSoonPage module="Purchase Management" page="Purchase Requisition" />} />
            <Route path="purchase/offer" element={<ComingSoonPage module="Purchase Management" page="Purchase Offer" />} />
            <Route path="purchase/order" element={<PurchaseOrderPage />} />
            <Route path="purchase/comparison" element={<ComingSoonPage module="Purchase Management" page="Vendor Comparison" />} />
            <Route path="purchase/grn" element={<ComingSoonPage module="Purchase Management" page="Goods Receipt (GRN)" />} />

            {/* Inventory Management */}
            <Route path="inventory/stock" element={<ComingSoonPage module="Inventory Management" page="Main Stock Ledger" />} />
            <Route path="inventory/transfer" element={<ComingSoonPage module="Inventory Management" page="Stock Transfer" />} />
            <Route path="inventory/adjustment" element={<ComingSoonPage module="Inventory Management" page="Stock Adjustment" />} />
            <Route path="inventory/bins" element={<ComingSoonPage module="Inventory Management" page="Bin Management" />} />
            <Route path="inventory/imir" element={<ComingSoonPage module="Inventory Management" page="IMIR Management" />} />
            <Route path="inventory/tracking" element={<ComingSoonPage module="Inventory Management" page="Material Tracking" />} />

            {/* Production Management */}
            <Route path="production/planning" element={<ProductionKanbanPage />} />
            <Route path="production/cutting" element={<ComingSoonPage module="Production" page="Cutting Stage" />} />
            <Route path="production/fitting" element={<ComingSoonPage module="Production" page="Fitting Shop" />} />
            <Route path="production/welding" element={<ComingSoonPage module="Production" page="Welding Station" />} />
            <Route path="production/assembly" element={<ComingSoonPage module="Production" page="Assembly Line" />} />
            <Route path="production/packing" element={<ComingSoonPage module="Production" page="Packing Stage" />} />
            <Route path="production/dispatch" element={<ComingSoonPage module="Production" page="Dispatch Planning" />} />

            {/* Quality Control */}
            <Route path="quality/incoming" element={<IncomingInspectionPage />} />
            <Route path="quality/fim" element={<ComingSoonPage module="Quality Control" page="FIM Inspection" />} />
            <Route path="quality/ncr" element={<ComingSoonPage module="Quality Control" page="NCR Management" />} />
            <Route path="quality/certificates" element={<ComingSoonPage module="Quality Control" page="Test Certificates" />} />
            <Route path="quality/approval" element={<ComingSoonPage module="Quality Control" page="Material Approval" />} />

            {/* Issue Management */}
            <Route path="issue/request" element={<ComingSoonPage module="Issue Management" page="Material Issue Request" />} />
            <Route path="issue/acceptance" element={<ComingSoonPage module="Issue Management" page="Issue Acceptance" />} />
            <Route path="issue/return" element={<ComingSoonPage module="Issue Management" page="Return Material" />} />
            <Route path="issue/consumption" element={<ComingSoonPage module="Issue Management" page="Consumption Tracking" />} />

            {/* HR & Payroll */}
            <Route path="hr/employees" element={<EmployeesPage />} />
            <Route path="hr/attendance" element={<ComingSoonPage module="HR & Payroll" page="Attendance Logger" />} />
            <Route path="hr/leaves" element={<ComingSoonPage module="HR & Payroll" page="Leave Management" />} />
            <Route path="hr/salaries" element={<ComingSoonPage module="HR & Payroll" page="Salary Processing" />} />
            <Route path="hr/payslips" element={<ComingSoonPage module="HR & Payroll" page="Payslip Generation" />} />

            {/* Reports */}
            <Route path="reports/stock" element={<ComingSoonPage module="Reports" page="Stock Reports" />} />
            <Route path="reports/purchase" element={<ComingSoonPage module="Reports" page="Purchase Reports" />} />
            <Route path="reports/production" element={<ComingSoonPage module="Reports" page="Production Reports" />} />
            <Route path="reports/packing" element={<ComingSoonPage module="Reports" page="Packing Reports" />} />
            <Route path="reports/attendance" element={<ComingSoonPage module="Reports" page="Attendance Reports" />} />
            <Route path="reports/financial" element={<ComingSoonPage module="Reports" page="Financial Reports" />} />

            {/* System Settings */}
            <Route path="settings/company" element={<ComingSoonPage module="System Settings" page="Company Settings" />} />
            <Route path="settings/fy-config" element={<ComingSoonPage module="System Settings" page="Financial Year Configuration" />} />
            <Route path="settings/email" element={<ComingSoonPage module="System Settings" page="Email Settings" />} />
            <Route path="settings/whatsapp" element={<ComingSoonPage module="System Settings" page="WhatsApp Integration" />} />
            <Route path="settings/audit" element={<AuditLogsPage />} />
            <Route path="settings/backup" element={<ComingSoonPage module="System Settings" page="Backup & Restore" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

// Root App wraps everything in the Redux Provider
export default function App() {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
}
