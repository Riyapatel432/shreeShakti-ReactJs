import { createSlice } from '@reduxjs/toolkit';
import { 
  mockProjects, 
  mockVendors, 
  mockMaterials, 
  mockPurchaseOrders, 
  mockQCInspection, 
  mockEmployees, 
  productionTasks, 
  mockDrawingMaster,
  mockAuditLogs,
  financialYears,
  plants
} from '../../data/mockData';

const initialState = {
  themeMode: 'light',
  sidebarOpen: true,
  selectedFinancialYear: financialYears[0],
  selectedPlant: plants[0].id,
  authLoading: true,
  isAuthenticated: false,
  currentUser: null,
  
  projects: mockProjects,
  vendors: mockVendors,
  materials: mockMaterials,
  purchaseOrders: mockPurchaseOrders,
  qcInspections: mockQCInspection,
  employees: mockEmployees,
  productionTasks: productionTasks,
  drawings: mockDrawingMaster,
  auditLogs: mockAuditLogs,

  notifications: [
    { id: 1, title: 'New PR Raised', message: 'PR-2026-0120 raised by Design Dept for Reliance Project.', time: '10 mins ago', type: 'info', read: false },
    { id: 2, title: 'QC Rejection Alert', message: 'QC inspection failed for GRN-26-0414 (CS Pipe 8"). Ovality deviation.', time: '1 hour ago', type: 'error', read: false },
    { id: 3, title: 'Delivery Pending', message: 'PO-2026-0042 is past its expected delivery date.', time: '4 hours ago', type: 'warning', read: false },
    { id: 4, title: 'Attendance Processing', message: 'June 2026 Attendance has been finalized.', time: '1 day ago', type: 'success', read: true }
  ]
};

const erpSlice = createSlice({
  name: 'erp',
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setFinancialYear: (state, action) => {
      state.selectedFinancialYear = action.payload;
    },
    setPlant: (state, action) => {
      state.selectedPlant = action.payload;
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        read: false,
        time: 'Just now',
        ...action.payload
      });
    },
    addProject: (state, action) => {
      state.projects.unshift(action.payload);
      state.auditLogs.unshift({ timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), user: 'admin@shreeshakti.com', action: `Created Project ${action.payload.id}: ${action.payload.name}`, module: 'Master', ipAddress: '192.168.1.45' });
    },
    addVendor: (state, action) => {
      state.vendors.unshift(action.payload);
      state.auditLogs.unshift({ timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), user: 'admin@shreeshakti.com', action: `Created Vendor ${action.payload.id}: ${action.payload.name}`, module: 'Master', ipAddress: '192.168.1.45' });
    },
    addMaterial: (state, action) => {
      state.materials.unshift(action.payload);
      state.auditLogs.unshift({ timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), user: 'admin@shreeshakti.com', action: `Added Material ${action.payload.code}`, module: 'Master', ipAddress: '192.168.1.45' });
    },
    addPurchaseOrder: (state, action) => {
      state.purchaseOrders.unshift(action.payload);
      state.auditLogs.unshift({ timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), user: 'admin@shreeshakti.com', action: `Created PO ${action.payload.id}`, module: 'Purchase', ipAddress: '192.168.1.45' });
    },
    setAuthLoading: (state, action) => {
  state.authLoading = action.payload;
},
    updateTaskStage: (state, action) => {
      const { taskId, newStage } = action.payload;
      const task = state.productionTasks.find(t => t.id === taskId);
      if (task) {
        task.stage = newStage;
        state.auditLogs.unshift({ timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), user: 'planner@shreeshakti.com', action: `Moved Task ${taskId} to ${newStage}`, module: 'Production', ipAddress: '192.168.1.48' });
      }
    },
    addEmployee: (state, action) => {
      state.employees.unshift(action.payload);
      state.auditLogs.unshift({ timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19), user: 'hr@shreeshakti.com', action: `Registered Employee ${action.payload.id}`, module: 'HR', ipAddress: '192.168.1.33' });
    }
  }
});

export const {
    setAuthLoading,
  toggleThemeMode, login, logout, setSidebarOpen, setFinancialYear, setPlant, markAllNotificationsRead,
  addNotification, addProject, addVendor, addMaterial, addPurchaseOrder, updateTaskStage, addEmployee
} = erpSlice.actions;

export default erpSlice.reducer;
