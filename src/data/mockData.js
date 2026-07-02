// Shree Shakti Mechanical ERP Mock Data

export const financialYears = [
  'FY 2026-2027',
  'FY 2025-2026',
  'FY 2024-2025'
];

export const plants = [
  { id: 'plant-1', name: 'Heavy Fabrication Unit - I (Ahmedabad)' },
  { id: 'plant-2', name: 'Piping & Vessel Shop - II (Sanand)' },
  { id: 'plant-3', name: 'Machine Shop & Assembly - III (Mundra)' }
];

export const mockProjects = [
  { id: 'PRJ-2026-001', name: 'ONGC Offshore Structure Fabrication', client: 'ONGC Ltd', manager: 'Rajesh Sharma', status: 'In Progress', progress: 68, budget: 12000000, value: 8500000, startDate: '2026-01-10', endDate: '2026-11-30' },
  { id: 'PRJ-2026-002', name: 'Reliance Jamnagar Piping Expansion', client: 'Reliance Industries', manager: 'Amit Patel', status: 'In Progress', progress: 45, budget: 24500000, value: 11000000, startDate: '2026-02-15', endDate: '2027-02-28' },
  { id: 'PRJ-2026-003', name: 'L&T Supercritical Boiler Parts', client: 'Larsen & Toubro', manager: 'Vikas Mishra', status: 'In Progress', progress: 82, budget: 9800000, value: 8000000, startDate: '2025-11-01', endDate: '2026-08-15' },
  { id: 'PRJ-2026-004', name: 'IOCL Refinery Storage Tanks', client: 'IOCL', manager: 'Sanjay Dutt', status: 'Planning', progress: 12, budget: 18000000, value: 2000000, startDate: '2026-05-01', endDate: '2027-06-30' },
  { id: 'PRJ-2026-005', name: 'NTPC Steam Piping System', client: 'NTPC Limited', manager: 'Karan Malhotra', status: 'Completed', progress: 100, budget: 6500000, value: 6500000, startDate: '2025-06-20', endDate: '2026-04-30' }
];

export const mockVendors = [
  { id: 'VND-001', name: 'Tata Steel BSL Ltd', code: 'TATA-ST', contact: 'Manoj Gupta', email: 'sales@tatasteel.com', phone: '+91 98250 12345', category: 'Plates & Pipes', rating: 4.8 },
  { id: 'VND-002', name: 'Jindal Stainless Ltd', code: 'JINDAL-SS', contact: 'Ramesh Shah', email: 'sales@jindalss.com', phone: '+91 98980 67890', category: 'SS Pipes & Flanges', rating: 4.5 },
  { id: 'VND-003', name: 'Sandvik Materials Technology', code: 'SANDVIK', contact: 'Suresh Rao', email: 'sm.india@sandvik.com', phone: '+91 22 66778899', category: 'Special Alloys', rating: 4.9 },
  { id: 'VND-004', name: 'Adani Logistics', code: 'ADANI-LOG', contact: 'Hardik Shah', email: 'cargo@adani.com', phone: '+91 79 25556666', category: 'Services & Logistics', rating: 4.2 },
  { id: 'VND-005', name: 'Apex Fasteners Corp', code: 'APEX-FAST', contact: 'Nitin Vyas', email: 'info@apexfast.in', phone: '+91 94260 55443', category: 'Fasteners & Gaskets', rating: 4.0 }
];

export const mockMaterials = [
  { id: 'MAT-001', code: 'CS-PL-12MM-A516Gr70', description: 'Carbon Steel Plate 12mm thick A516 Gr.70', category: 'Steel Plates', uom: 'MT', stock: 45.2, minStock: 10.0, unitPrice: 62000, bin: 'A-12-B' },
  { id: 'MAT-002', code: 'CS-PP-08IN-SCH40-A106B', description: 'Carbon Steel Pipe 8" Sch 40 ASTM A106 Gr.B', category: 'Pipes', uom: 'Mtrs', stock: 320, minStock: 100, unitPrice: 2450, bin: 'P-08-A' },
  { id: 'MAT-003', code: 'SS-PL-10MM-316L', description: 'Stainless Steel Plate 10mm ASTM A240 TP316L', category: 'Steel Plates', uom: 'MT', stock: 12.8, minStock: 5.0, unitPrice: 215000, bin: 'B-04-A' },
  { id: 'MAT-004', code: 'SS-PP-04IN-SCH10-304L', description: 'Stainless Steel Pipe 4" Sch 10S ASTM A312 TP304L', category: 'Pipes', uom: 'Mtrs', stock: 480, minStock: 150, unitPrice: 1650, bin: 'P-04-C' },
  { id: 'MAT-005', code: 'FLG-06IN-A105-150RF', description: 'Carbon Steel Flange 6" 150# ANSI B16.5 RF A105', category: 'Flanges', uom: 'Nos', stock: 74, minStock: 20, unitPrice: 3200, bin: 'F-06-A' },
  { id: 'MAT-006', code: 'ELB-90-08IN-SCH40-A234WPB', description: '90 Deg Elbow 8" Sch 40 ASTM A234 WPB Welded', category: 'Fittings', uom: 'Nos', stock: 35, minStock: 10, unitPrice: 1850, bin: 'FT-08-D' },
  { id: 'MAT-007', code: 'WE-E7018-3.15MM', description: 'Welding Electrode E7018 Size 3.15mm', category: 'Consumables', uom: 'Kgs', stock: 850, minStock: 200, unitPrice: 180, bin: 'C-01-B' }
];

export const mockPurchaseOrders = [
  { id: 'PO-2026-0041', reqNo: 'PR-2026-0098', date: '2026-06-12', vendor: 'Tata Steel BSL Ltd', project: 'ONGC Offshore Structure Fabrication', totalAmount: 4850000, status: 'Released', approvalStatus: 'Approved', itemsCount: 4 },
  { id: 'PO-2026-0042', reqNo: 'PR-2026-0105', date: '2026-06-18', vendor: 'Jindal Stainless Ltd', project: 'Reliance Jamnagar Piping Expansion', totalAmount: 3240000, status: 'Pending Delivery', approvalStatus: 'Approved', itemsCount: 2 },
  { id: 'PO-2026-0043', reqNo: 'PR-2026-0112', date: '2026-06-25', vendor: 'Apex Fasteners Corp', project: 'L&T Supercritical Boiler Parts', totalAmount: 680000, status: 'Draft', approvalStatus: 'Pending HOD', itemsCount: 5 },
  { id: 'PO-2026-0044', reqNo: 'PR-2026-0115', date: '2026-06-28', vendor: 'Sandvik Materials Technology', project: 'Reliance Jamnagar Piping Expansion', totalAmount: 7800000, status: 'Released', approvalStatus: 'Approved', itemsCount: 1 },
  { id: 'PO-2026-0045', reqNo: 'PR-2026-0120', date: '2026-06-29', vendor: 'Tata Steel BSL Ltd', project: 'IOCL Refinery Storage Tanks', totalAmount: 11200000, status: 'Under Review', approvalStatus: 'Pending MD', itemsCount: 6 }
];

export const mockQCInspection = [
  { id: 'QC-26-0312', source: 'GRN-26-0410', date: '2026-06-27', inspector: 'S. N. Mehta', item: 'SS Plate 10mm ASTM A240 TP316L', quantity: '5.2 MT', vendor: 'Jindal Stainless Ltd', status: 'Passed', heatNo: 'H-56892-A', mtrNo: 'MTR-JSL-8849', deviation: 'None' },
  { id: 'QC-26-0313', source: 'GRN-26-0412', date: '2026-06-28', inspector: 'K. R. Varma', item: 'CS Flange 6" 150# A105', quantity: '40 Nos', vendor: 'Apex Fasteners Corp', status: 'Passed', heatNo: 'HT-99042', mtrNo: 'MTR-AF-3029', deviation: 'None' },
  { id: 'QC-26-0314', source: 'GRN-26-0414', date: '2026-06-29', inspector: 'S. N. Mehta', item: 'Carbon Steel Pipe 8" Sch 40 A106B', quantity: '120 Mtrs', vendor: 'Tata Steel BSL Ltd', status: 'Rejected', heatNo: 'HT-TSL-00392', mtrNo: 'MTR-TATA-7629', deviation: 'OVALITY BEYOND ASTM TOLERANCE (+2.4mm)', ncrNo: 'NCR-2026-012' },
  { id: 'QC-26-0315', source: 'GRN-26-0415', date: '2026-06-30', inspector: 'K. R. Varma', item: 'Welding Electrode E7018 3.15mm', quantity: '500 Kgs', vendor: 'Apex Fasteners Corp', status: 'Pending', heatNo: 'B-77491', mtrNo: 'MTR-AP-9904', deviation: 'Pending Bake Test' }
];

export const mockEmployees = [
  { id: 'EMP-001', name: 'Dinesh Panchal', role: 'Structural Fitter', dept: 'Production', category: 'High Skilled', status: 'Present', attendanceRate: 94 },
  { id: 'EMP-002', name: 'Vijay Chawda', role: '6G Welder', dept: 'Production', category: 'High Skilled', status: 'Present', attendanceRate: 96 },
  { id: 'EMP-003', name: 'Rakesh Parmar', role: 'QC Inspector', dept: 'Quality Assurance', category: 'Skilled', status: 'Present', attendanceRate: 98 },
  { id: 'EMP-004', name: 'Gopal Solanki', role: 'Store Keeper', dept: 'Purchase & Stores', category: 'Skilled', status: 'On Leave', attendanceRate: 90 },
  { id: 'EMP-005', name: 'Mukesh Prajapati', role: 'Fabrication Supervisor', dept: 'Production', category: 'Supervisor', status: 'Present', attendanceRate: 95 }
];

export const productionTasks = [
  { id: 'TSK-001', name: 'Drawing Review - CS Tank T-102', drawingNo: 'SS-TANK-T102-DWG-001', project: 'ONGC Offshore Structure Fabrication', stage: 'Drawing Review', assignedTo: 'Amit Patel', priority: 'High', date: '2026-06-25' },
  { id: 'TSK-002', name: 'Plate Cutting - 12mm A516 Shell Plates', drawingNo: 'SS-TANK-T102-DWG-002', project: 'ONGC Offshore Structure Fabrication', stage: 'Cutting', assignedTo: 'Dinesh Panchal', priority: 'High', date: '2026-06-26' },
  { id: 'TSK-003', name: 'Fitup Assembly - Dish End to Shell 1', drawingNo: 'SS-TANK-T102-DWG-003', project: 'ONGC Offshore Structure Fabrication', stage: 'Fitting', assignedTo: 'Dinesh Panchal', priority: 'Medium', date: '2026-06-27' },
  { id: 'TSK-004', name: 'Longitudinal Seam Welding - Shell 1', drawingNo: 'SS-TANK-T102-DWG-003', project: 'ONGC Offshore Structure Fabrication', stage: 'Welding', assignedTo: 'Vijay Chawda', priority: 'High', date: '2026-06-28' },
  { id: 'TSK-005', name: 'Nozzle Assembly & Structural Attachments', drawingNo: 'SS-TANK-T102-DWG-004', project: 'ONGC Offshore Structure Fabrication', stage: 'Assembly', assignedTo: 'Mukesh Prajapati', priority: 'Medium', date: '2026-06-29' },
  { id: 'TSK-006', name: 'Radiography Testing & Hydro Testing', drawingNo: 'SS-TANK-T102-DWG-005', project: 'ONGC Offshore Structure Fabrication', stage: 'Drawing Review', assignedTo: 'Rakesh Parmar', priority: 'High', date: '2026-06-30' },
  { id: 'TSK-007', name: 'Internal Sand Blasting & Epoxy Coating', drawingNo: 'SS-TANK-T102-DWG-005', project: 'ONGC Offshore Structure Fabrication', stage: 'Packing', assignedTo: 'Gopal Solanki', priority: 'Low', date: '2026-06-30' }
];

export const mockDrawingMaster = [
  { id: 'DWG-001', drawingNo: 'SS-ONGC-STR-0101', title: 'ONGC Main Deck Structural Framing Layout', project: 'ONGC Offshore Structure Fabrication', revision: 'R0', releasedDate: '2026-01-15', status: 'Approved', approvedBy: 'R. K. Verma (PMC)' },
  { id: 'DWG-002', drawingNo: 'SS-JMN-PIP-1205', title: 'Refinery Spool Piping Isometric Section 5', project: 'Reliance Jamnagar Piping Expansion', revision: 'R2', releasedDate: '2026-03-22', status: 'Approved', approvedBy: 'S. G. Roy (TPI)' },
  { id: 'DWG-003', drawingNo: 'SS-LNT-BLR-8809', title: 'Boiler Header Pipe Spool Detail Assembly', project: 'L&T Supercritical Boiler Parts', revision: 'R1', releasedDate: '2025-11-20', status: 'Approved', approvedBy: 'P. D. Patel (L&T)' }
];

export const mockAuditLogs = [
  { timestamp: '2026-06-30 15:20:10', user: 'admin@shreeshakti.com', action: 'Approved Purchase Order PO-2026-0041', module: 'Purchase', ipAddress: '192.168.1.45' },
  { timestamp: '2026-06-30 14:15:32', user: 'stores@shreeshakti.com', action: 'Created GRN-26-0415 for Apex Fasteners', module: 'Inventory', ipAddress: '192.168.1.52' },
  { timestamp: '2026-06-30 11:05:04', user: 'qc@shreeshakti.com', action: 'Logged NCR-2026-012 for Tata Steel Pipe', module: 'Quality Control', ipAddress: '192.168.1.61' },
  { timestamp: '2026-06-30 09:30:15', user: 'planner@shreeshakti.com', action: 'Assigned Welder Vijay Chawda to Drawing SS-TANK-T102-DWG-003', module: 'Production', ipAddress: '192.168.1.48' }
];

export const monthlyProductionData = [
  { name: 'Jan', Fabrication: 120, Piping: 85, Machining: 40 },
  { name: 'Feb', Fabrication: 145, Piping: 110, Machining: 52 },
  { name: 'Mar', Fabrication: 170, Piping: 125, Machining: 65 },
  { name: 'Apr', Fabrication: 130, Piping: 140, Machining: 58 },
  { name: 'May', Fabrication: 195, Piping: 165, Machining: 72 },
  { name: 'Jun', Fabrication: 220, Piping: 190, Machining: 85 }
];

export const materialConsumptionData = [
  { name: 'CS Plates', planned: 80, actual: 95 },
  { name: 'CS Pipes', planned: 120, actual: 112 },
  { name: 'SS Plates', planned: 30, actual: 35 },
  { name: 'SS Pipes', planned: 60, actual: 72 },
  { name: 'Flanges', planned: 40, actual: 38 },
  { name: 'Fittings', planned: 50, actual: 55 }
];

export const departmentEfficiencyData = [
  { name: 'Fabrication Shop', value: 88, color: '#1976d2' },
  { name: 'Piping Shop', value: 92, color: '#ed6c02' },
  { name: 'Machine Shop', value: 85, color: '#2e7d32' },
  { name: 'Quality Control', value: 96, color: '#9c27b0' },
  { name: 'Design / Planning', value: 90, color: '#0288d1' }
];

export const purchaseCostData = [
  { name: 'Jan', RawMaterials: 4.5, Consumables: 0.8, Services: 1.2 },
  { name: 'Feb', RawMaterials: 5.2, Consumables: 0.9, Services: 1.5 },
  { name: 'Mar', RawMaterials: 6.8, Consumables: 1.2, Services: 1.8 },
  { name: 'Apr', RawMaterials: 5.9, Consumables: 1.0, Services: 1.4 },
  { name: 'May', RawMaterials: 7.4, Consumables: 1.4, Services: 2.1 },
  { name: 'Jun', RawMaterials: 8.5, Consumables: 1.6, Services: 2.5 }
];
