import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import HelpCenterPage from './pages/HelpCenterPage';
import Dashboard from './pages/Dashboard';
import AIAgents from './pages/AIAgents';
import Communications from './pages/Communications';
import Marketing from './pages/Marketing';
import Invoicing from './pages/Invoicing';
import DecisionEngine from './pages/DecisionEngine';
import Notifications from './pages/Notifications';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SectorModule from './pages/SectorModule';
import AdminDashboard from './pages/AdminDashboard';
import Employees from './pages/Employees';
import HRModule from './pages/HRModule';
import Reports from './pages/Reports';
import Clients from './pages/Clients';
import './index.css';
import './App.css';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/app" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/help" element={<HelpCenterPage />} />

      {/* Shared Profile & Settings */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Client Dashboard */}
      <Route path="/app" element={
        <ProtectedRoute><DashboardLayout /></ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="ai-agents" element={<AIAgents />} />
        <Route path="communications" element={<Communications />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="invoicing" element={<Invoicing />} />
        <Route path="decisions" element={<DecisionEngine />} />
        <Route path="sector" element={<SectorModule />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="billing" element={<Billing />} />
        <Route path="employees" element={<Employees />} />
        <Route path="hr" element={<HRModule />} />
        <Route path="reports" element={<Reports />} />
        <Route path="clients" element={<Clients />} />
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['super_admin']}><DashboardLayout /></ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="companies" element={<AdminDashboard />} />
        <Route path="revenue" element={<AdminDashboard />} />
        <Route path="subscriptions" element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminDashboard />} />
        <Route path="ai-control" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
