/* eslint-disable react-refresh/only-export-components */
/**
 * routes.jsx
 * ──────────────────────────────────────────────────────────────
 * Central route configuration for the Shree Shakti ERP panel.
 *
 * Structure:
 *  - Public routes   → rendered without any layout or auth guard
 *  - Admin routes    → rendered inside <MainLayout>, protected by Admin role
 *  - User routes     → protected by User role, no MainLayout
 *
 * To add a new page:
 *  1. Import the page component below.
 *  2. Add an entry to the appropriate section of `adminRoutes` (or other arrays).
 *  App.jsx and AppRoutes.jsx do NOT need to change.
 * ──────────────────────────────────────────────────────────────
 */

import { lazy, Suspense } from 'react';
import LoadingScreen from '../components/common/LoadingScreen';

// Auth
import LoginPage     from '../pages/auth/LoginPage';
import UserLoginPage from '../pages/auth/UserLoginPage';

// Non-critical pages (lazy-loaded)
const ComingSoonPage = lazy(() => import('../pages/ComingSoonPage'));
const Dashboard      = lazy(() => import('../pages/Dashboard'));

// Admin
const ProfilePage = lazy(() => import('../pages/admin/ProfilePage'));

// User
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));

// Master
const UsersPage     = lazy(() => import('../pages/master/UsersPage'));
const ProjectsPage  = lazy(() => import('../pages/master/ProjectsPage'));
const QuotationsPage   = lazy(() => import('../pages/quotation/QuotationsPage'));
const ClientsPage   = lazy(() => import('../pages/master/ClientsPage'));
const ProductCategoryPage = lazy(() => import('../pages/master/ProductCategoryPage'));
const ProductsPage = lazy(() => import('../pages/product/ProductsPage'));
const PricePage = lazy(() => import('../pages/price/PricePage'));
const UnitsPage = lazy(() => import('../pages/master/UnitsPage'));
const MocsPage = lazy(() => import('../pages/master/MocsPage'));
const CostingSheetPage = lazy(() => import('../pages/costingSheet/costingSheetPage'));
const MaterialRegisterPage = lazy(() => import('../pages/master/MaterialRegisterPage'));
const StandardsLibraryPage = lazy(() => import('../pages/master/StandardsLibraryPage'));
const TechSpecPage = lazy(() => import('../pages/techSpec/TechSpecPage'));

// Purchase
const PurchaseOrderPage = lazy(() => import('../pages/purchase/PurchaseOrderPage'));
const VendorPage = lazy(() => import('../pages/purchase/VendorPage'));

// Production
const ProductionKanbanPage = lazy(() => import('../pages/production/ProductionKanbanPage'));

// Quality
const IncomingInspectionPage = lazy(() => import('../pages/quality/IncomingInspectionPage'));

// HR
const EmployeesPage = lazy(() => import('../pages/hr/EmployeesPage'));

// Settings
const AuditLogsPage = lazy(() => import('../pages/settings/AuditLogsPage'));

// ─── Helper: Coming Soon shorthand ───────────────────────────
const cs = (module, page) => (
  <Suspense fallback={<LoadingScreen />}>
    <ComingSoonPage module={module} page={page} />
  </Suspense>
);


// ─── Public Routes ────────────────────────────────────────────
export const publicRoutes = [
  { path: '/admin/login', element: <LoginPage /> },
  { path: '/',            element: <UserLoginPage /> },
];

// ─── User Routes (role: User) ─────────────────────────────────
export const userRoutes = [
  { path: '/user/dashboard', element: <UserDashboard /> },
];

// ─── Admin Routes (role: Admin, rendered inside <MainLayout>) ─
export const adminRoutes = [
  // Dashboard
  { path: 'dashboard', element: <Dashboard /> },

  // Profile
  { path: 'profile', element: <ProfilePage /> },

  // ── Master Management ──────────────────────────────────────
  { path: 'master/users',       element: <UsersPage /> },
  { path: 'master/roles',       element: cs('Master Management', 'Roles & Permissions') },
  { path: 'master/customers',   element: cs('Master Management', 'Customer Master') },
  { path: 'master/vendors',     element: <VendorPage /> },
  { path: 'master/clients',     element: <ClientsPage /> },
  { path: 'master/product-categories',     element: <ProductCategoryPage /> },
  { path: 'products',     element: <ProductsPage /> },
  { path: 'price',     element: <PricePage /> },
  { path: 'costingSheet',     element: <CostingSheetPage /> },
  { path: 'master/units',       element: <UnitsPage /> },
  { path: 'master/mocs',        element: <MocsPage /> },
  { path: 'quotations',     element: <QuotationsPage /> },
  { path: 'tech-specs',     element: <TechSpecPage /> },
  { path: 'master/projects',    element: <ProjectsPage /> },
  { path: 'master/units',       element: cs('Master Management', 'Units Master') },
  { path: 'master/departments', element: cs('Master Management', 'Departments Master') },
  { path: 'master/categories',  element: cs('Master Management', 'Item Categories') },
  { path: 'master/drawings',    element: cs('Master Management', 'Drawing Master') },
  { path: 'master/grids',       element: cs('Master Management', 'Grid Master') },
  { path: 'master/heat-numbers',element: cs('Master Management', 'Heat Number Master') },
  { path: 'master/standards',   element: <StandardsLibraryPage /> },

  // ── Purchase Management ────────────────────────────────────
  { path: 'purchase/requisition', element: cs('Purchase Management', 'Purchase Requisition') },
  { path: 'purchase/offer',       element: cs('Purchase Management', 'Purchase Offer') },
  { path: 'purchase/order',       element: <PurchaseOrderPage /> },
  { path: 'purchase/comparison',  element: cs('Purchase Management', 'Vendor Comparison') },
  { path: 'purchase/grn',         element: cs('Purchase Management', 'Goods Receipt (GRN)') },

  // ── Inventory Management ───────────────────────────────────
  { path: 'inventory/materials',  element: <MaterialRegisterPage /> },
  { path: 'inventory/stock',      element: cs('Inventory Management', 'Main Stock Ledger') },
  { path: 'inventory/transfer',   element: cs('Inventory Management', 'Stock Transfer') },
  { path: 'inventory/adjustment', element: cs('Inventory Management', 'Stock Adjustment') },
  { path: 'inventory/bins',       element: cs('Inventory Management', 'Bin Management') },
  { path: 'inventory/imir',       element: cs('Inventory Management', 'IMIR Management') },
  { path: 'inventory/tracking',   element: cs('Inventory Management', 'Material Tracking') },

  // ── Production Management ──────────────────────────────────
  { path: 'production/planning',  element: <ProductionKanbanPage /> },
  { path: 'production/cutting',   element: cs('Production', 'Cutting Stage') },
  { path: 'production/fitting',   element: cs('Production', 'Fitting Shop') },
  { path: 'production/welding',   element: cs('Production', 'Welding Station') },
  { path: 'production/assembly',  element: cs('Production', 'Assembly Line') },
  { path: 'production/packing',   element: cs('Production', 'Packing Stage') },
  { path: 'production/dispatch',  element: cs('Production', 'Dispatch Planning') },

  // ── Quality Control ────────────────────────────────────────
  { path: 'quality/incoming',     element: <IncomingInspectionPage /> },
  { path: 'quality/fim',          element: cs('Quality Control', 'FIM Inspection') },
  { path: 'quality/ncr',          element: cs('Quality Control', 'NCR Management') },
  { path: 'quality/certificates', element: cs('Quality Control', 'Test Certificates') },
  { path: 'quality/approval',     element: cs('Quality Control', 'Material Approval') },

  // ── Issue Management ───────────────────────────────────────
  { path: 'issue/request',     element: cs('Issue Management', 'Material Issue Request') },
  { path: 'issue/acceptance',  element: cs('Issue Management', 'Issue Acceptance') },
  { path: 'issue/return',      element: cs('Issue Management', 'Return Material') },
  { path: 'issue/consumption', element: cs('Issue Management', 'Consumption Tracking') },

  // ── HR & Payroll ───────────────────────────────────────────
  { path: 'hr/employees',  element: <EmployeesPage /> },
  { path: 'hr/attendance', element: cs('HR & Payroll', 'Attendance Logger') },
  { path: 'hr/leaves',     element: cs('HR & Payroll', 'Leave Management') },
  { path: 'hr/salaries',   element: cs('HR & Payroll', 'Salary Processing') },
  { path: 'hr/payslips',   element: cs('HR & Payroll', 'Payslip Generation') },

  // ── Reports ────────────────────────────────────────────────
  { path: 'reports/stock',       element: cs('Reports', 'Stock Reports') },
  { path: 'reports/purchase',    element: cs('Reports', 'Purchase Reports') },
  { path: 'reports/production',  element: cs('Reports', 'Production Reports') },
  { path: 'reports/packing',     element: cs('Reports', 'Packing Reports') },
  { path: 'reports/attendance',  element: cs('Reports', 'Attendance Reports') },
  { path: 'reports/financial',   element: cs('Reports', 'Financial Reports') },

  // ── System Settings ────────────────────────────────────────
  { path: 'settings/company',  element: cs('System Settings', 'Company Settings') },
  { path: 'settings/fy-config', element: cs('System Settings', 'Financial Year Configuration') },
  { path: 'settings/email',     element: cs('System Settings', 'Email Settings') },
  { path: 'settings/whatsapp',  element: cs('System Settings', 'WhatsApp Integration') },
  { path: 'settings/audit',     element: <AuditLogsPage /> },
  { path: 'settings/backup',    element: cs('System Settings', 'Backup & Restore') },
];
