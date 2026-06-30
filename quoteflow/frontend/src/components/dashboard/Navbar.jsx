import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const vendorLinks = [
    { to: '/vendor/dashboard', label: 'Dashboard' },
    { to: '/vendor/requests',  label: 'Requests' },
    { to: '/vendor/quotes',    label: 'Quotes' },
    { to: '/vendor/invoices',  label: 'Invoices' },
  ];

  const clientLinks = [
    { to: '/client/dashboard', label: 'Dashboard' },
    { to: '/client/vendors',   label: 'Find Vendors' },
    { to: '/client/requests',  label: 'My Requests' },
    { to: '/client/quotes',    label: 'My Quotes' },
    { to: '/client/invoices',  label: 'Invoices' },
  ];

  const links = user?.role === 'vendor' ? vendorLinks : clientLinks;

  return (
    <nav className="bg-primary text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold tracking-wide">QuoteFlow</Link>
      <div className="flex items-center gap-6">
        {links.map(link => (
          <Link key={link.to} to={link.to} className="text-sm hover:text-yellow-300 transition">
            {link.label}
          </Link>
        ))}
        <div className="flex items-center gap-3 ml-4 border-l border-blue-400 pl-4">
          <span className="text-xs text-blue-200 capitalize">{user?.role}</span>
          <span className="text-sm font-medium">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-xs bg-white text-primary px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
