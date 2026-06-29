import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/dashboard/Navbar';
import StatCard from '../components/dashboard/StatCard';
import api from '../api/axios';

export default function VendorDashboard() {
  const [stats, setStats] = useState({ requests: 0, quotes: 0, pendingInvoices: 0, paidInvoices: 0 });
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [reqRes, quoteRes, invRes] = await Promise.all([
        api.get('/requests/incoming'),
        api.get('/quotes'),
        api.get('/invoices'),
      ]);
      setStats({
        requests:       reqRes.data.filter(r => r.status === 'pending').length,
        quotes:         quoteRes.data.length,
        pendingInvoices: invRes.data.filter(i => i.paymentStatus === 'pending').length,
        paidInvoices:   invRes.data.filter(i => i.paymentStatus === 'completed').length,
      });
      setRecentRequests(reqRes.data.slice(0, 5));
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Vendor Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="New Requests"     value={stats.requests}        color="orange" />
          <StatCard label="Active Quotes"    value={stats.quotes}          color="blue" />
          <StatCard label="Pending Payment"  value={stats.pendingInvoices} color="gray" />
          <StatCard label="Paid Invoices"    value={stats.paidInvoices}    color="green" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Recent Requests</h2>
            <Link to="/vendor/requests" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {recentRequests.length === 0 ? (
            <p className="text-gray-400 text-sm">No requests yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Client</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Budget</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(r => (
                  <tr key={r._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2">{r.clientId?.name}</td>
                    <td className="py-2 text-gray-600 truncate max-w-xs">{r.description || '—'}</td>
                    <td className="py-2">{r.budget ? `₹${r.budget}` : '—'}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        r.status === 'quoted'  ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
