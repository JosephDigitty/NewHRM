# NewHRM - Employee Management System

NewHRM is a comprehensive Employee Management System built with React and Vite. It provides role-based dashboards for administrators, HR personnel, team leads, and employees to manage organizational workflows including departments, employees, payroll, leaves, appraisals, and more.

## Features

### Admin Dashboard
- Employee management (add, edit, view profiles)
- Department management with head assignment
- Grade/level management
- Leave management and approvals
- HMO (Health Management Organization) management
- Payroll generation and management
- Salary modifiers and deductions
- Settings and configuration

### Employee Dashboard
- Personal profile and details
- Salary overview and payslip history
- Leave application and tracking
- Appraisal self-assessment

### Appraisals
- Create appraisal cycles
- Assign and manage KPIs
- Supervisor and performance reviews
- Multi-role access (admin, HR, employee, team lead)

### Payroll
- Generate payroll for all employees
- PAYE, Pension, ITF, and NSITF generation
- Bank file export
- Permanent and temporary salary modifiers

## Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4
- **Routing**: React Router DOM 7
- **State Management**: React Context (Toast)
- **Data Tables**: react-data-table-component
- **PDF/Excel**: jsPDF, jsPDF-AutoTable, XLSX, FileSaver
- **Icons**: Lucide React, React Icons
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
src/
  api/             - API request configuration
  Component/       - Reusable components and page sections
    reuseables/    - Shared UI components
    ProtectedRoute - Route guards and role-based access
  Context/         - React Context providers
  pages/           - Top-level page components
  utils/           - Helpers and utilities
Backend/           - Backend API server
```

## Role-Based Access

The application supports the following roles with protected routes:
- `admin`
- `HR`
- `employee`
- `teamlead`

## License

Private
