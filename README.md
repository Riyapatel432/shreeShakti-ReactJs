# Shree Shakti ERP - Frontend (React.js)

**Date**: September 5, 2026

## Overview
This is the frontend client for the Shree Shakti Engineering Works ERP system. It provides a rich, responsive, and dynamic user interface for admins and employees to manage enterprise resources across various departments.

## Tech Stack
- **Core**: React 19, Vite
- **State Management**: Redux Toolkit (RTK)
- **Styling & UI**: Material-UI (MUI) v5/v6, Framer Motion
- **Routing**: React Router DOM v7
- **Forms & Data**: React Hook Form, Recharts, Axios

## Modules & Features Implemented (As of Date)
The ERP dashboard is heavily modularized. Current active modules include:

1. **Dashboard**: High-level KPIs, activity timelines, and real-time operations overview.
2. **Master Management**:
   - Users
   - Roles & Permissions
   - Clients & Customers
   - Projects
   - Units & MOCs (Materials of Construction)
   - Product Categories
3. **Products & Inventory**:
   - Product definitions
   - Price Management
4. **Sales & Estimates**:
   - Costing Sheets
   - Quotation Generation
5. **Human Resources**:
   - Employee Management
6. **Production & Quality**:
   - Production Kanban Board (Planning)
   - Incoming Inspection (Quality Control)
7. **System Settings**:
   - Audit Logs
   - Profile Management

*(Note: Several modules such as complete Purchase Management, Stock Ledgers, and advanced HR features are architected into the routing map and are marked as "Coming Soon")*

## Architecture Patterns
- **Redux Slices**: Each module (e.g., `users`, `clients`, `products`) has a dedicated RTK slice handling API calls via `createAsyncThunk`.
- **Theme**: Consistent industrial theme using `MainLayout`, an expandable `Sidebar`, and a standard `DataTable` + `FormModal` for CRUD operations.

## Setup & Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Environment Configuration**:
   API URL is globally exported via `src/baseUrl.js`. By default, it points to `http://localhost:5000/api`.
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Build for Production**:
   ```bash
   npm run build
   ```

## Troubleshooting
- **Layout breaking on `<Grid>`**: We have migrated away from `item="true"` to prevent flex-box layout breaking. Note that React 19 might log a non-breaking console warning (`Received true for a non-boolean attribute item`) due to MUI legacy Grid compatibility.
- **Vite Caching**: If the UI gets stuck locally, clear the Vite cache by running `npm run dev -- --force`.
