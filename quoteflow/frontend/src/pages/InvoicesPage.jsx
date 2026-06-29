import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/invoices').then(({ data }) => { setInvoices(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Invoices</h1>

        {loading ? <p className="text-gray-400">Loading...</p> :
         invoices.length === 0 ? <p className="text-gray-400">No invoices yet.</p> : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-5 py-3">Invoice #</th>
                  <th className="px-5 py-3">{user.role === 'vendor' ? 'Client' : 'Vendor'}</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-primary">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3">
                      {user.role === 'vendor'
                        ? inv.clientId?.name
                        : (inv.vendorId?.businessName || inv.vendorId?.name)}
                    </td>
                    <td className="px-5 py-3 font-medium">₹{inv.totalAmount?.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        inv.paymentStatus === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>{inv.paymentStatus}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(inv.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <Link to={`/invoices/${inv._id}`} className="text-primary hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
