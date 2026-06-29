import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import VendorDashboard  from './pages/VendorDashboard';
import ClientDashboard  from './pages/ClientDashboard';
import VendorListPage   from './pages/VendorListPage';
import VendorDetailPage from './pages/VendorDetailPage';
import RequestsPage     from './pages/RequestsPage';
import QuotesPage       from './pages/QuotesPage';
import QuoteDetailPage  from './pages/QuoteDetailPage';
import InvoicesPage     from './pages/InvoicesPage';
import InvoiceDetailPage from './pages/InvoiceDetailPage';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return user.role === 'vendor'
    ? <Navigate to="/vendor/dashboard" />
    : <Navigate to="/client/dashboard" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<DashboardRedirect />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Vendor routes */}
          <Route path="/vendor/dashboard" element={<PrivateRoute role="vendor"><VendorDashboard /></PrivateRoute>} />
          <Route path="/vendor/requests"  element={<PrivateRoute role="vendor"><RequestsPage /></PrivateRoute>} />
          <Route path="/vendor/quotes"    element={<PrivateRoute role="vendor"><QuotesPage /></PrivateRoute>} />
          <Route path="/vendor/invoices"  element={<PrivateRoute role="vendor"><InvoicesPage /></PrivateRoute>} />

          {/* Client routes */}
          <Route path="/client/dashboard" element={<PrivateRoute role="client"><ClientDashboard /></PrivateRoute>} />
          <Route path="/client/vendors"   element={<PrivateRoute role="client"><VendorListPage /></PrivateRoute>} />
          <Route path="/client/vendors/:id" element={<PrivateRoute role="client"><VendorDetailPage /></PrivateRoute>} />
          <Route path="/client/requests"  element={<PrivateRoute role="client"><RequestsPage /></PrivateRoute>} />
          <Route path="/client/quotes"    element={<PrivateRoute role="client"><QuotesPage /></PrivateRoute>} />
          <Route path="/client/invoices"  element={<PrivateRoute role="client"><InvoicesPage /></PrivateRoute>} />

          {/* Shared detail pages */}
          <Route path="/quotes/:id"   element={<PrivateRoute><QuoteDetailPage /></PrivateRoute>} />
          <Route path="/invoices/:id" element={<PrivateRoute><InvoiceDetailPage /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
